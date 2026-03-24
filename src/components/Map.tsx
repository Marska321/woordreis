import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { WordEtymology, MigrationStage } from '../types';
import { getArcPoints } from '../lib/utils';

interface MapProps {
  etymology: WordEtymology | null;
  currentStage: number;
}

const Map: React.FC<MapProps> = ({ etymology, currentStage }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    import('../data/countries-110m.json').then(module => {
      setWorldData(module.default || module);
    }).catch(err => console.error("Failed to load map data offline:", err));
  }, []);

  useEffect(() => {
    if (!worldData || !svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    svg.selectAll('*').remove();

    // Projection - increased scale for better desktop visibility
    let baseScale = 0.22;
    if (width > 1600) baseScale = 0.32;
    else if (width > 1200) baseScale = 0.28;
    
    const projection = d3.geoNaturalEarth1()
      .scale(Math.min(width, height) * baseScale)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw countries
    const countries = topojson.feature(worldData, worldData.objects.countries) as any;
    
    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Sphere (Ocean)
    g.append('path')
      .datum({ type: 'Sphere' })
      .attr('d', path)
      .attr('fill', '#b5cfc3');

    // Grid lines
    const graticule = d3.geoGraticule();
    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#9abfb0')
      .attr('stroke-width', 0.3);

    g.selectAll('.country')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', d => String((d as any).id) === '710' ? 'country-sa' : 'country')
      .attr('d', path)
      .attr('fill', d => String((d as any).id) === '710' ? '#6d9e8c' : '#8db8a6')
      .attr('stroke', d => String((d as any).id) === '710' ? '#5a8878' : '#7aaa96')
      .attr('stroke-width', d => String((d as any).id) === '710' ? 1.2 : 0.5);

    if (etymology && etymology.stages.length > 0) {
      const stages = etymology.stages;
      
      const lineGenerator = d3.line<[number, number]>();

      if (stages.length > 1) {
        for (let i = 0; i < stages.length - 1; i++) {
          const start = stages[i].coordinates;
          const end = stages[i + 1].coordinates;
          const segmentPoints = getArcPoints(start as [number, number], end as [number, number]);
          const lineData = segmentPoints.map(p => projection(p) as [number, number]);

          const routePath = g.append('path')
            .datum(lineData)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', '#162620')
            .attr('stroke-width', 2.5)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round');

          const length = (routePath.node() as SVGPathElement).getTotalLength();
          
          // Fix visual pop-in by setting strict initial dasharrays
          routePath.attr('stroke-dasharray', `${length} ${length}`);
          
          const isActivated = currentStage > i;
          const isJustActivated = currentStage === i + 1;
          
          if (isActivated) {
            if (isJustActivated) {
              // Newly active hop: animate drawing dynamically
              routePath.attr('stroke-dashoffset', length)
                .transition()
                .duration(800) // Fast and punchy
                .attr('stroke-dashoffset', 0);
            } else {
              // Past hops: fully visible instantly
              routePath.attr('stroke-dashoffset', 0);
            }
          } else {
            // Future hops: totally invisible
            routePath.attr('stroke-dashoffset', length);
          }
        }
      }

      // Draw points
      g.selectAll<SVGCircleElement, MigrationStage>('.stage-point')
        .data(stages.slice(0, currentStage + 1))
        .enter()
        .append('g')
        .each(function(d: any, i) {
          const [cx, cy] = projection((d as MigrationStage).coordinates)!;
          const point = d3.select(this);
          
          point.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', i === 0 || i === stages.length - 1 ? 9 : 7)
            .attr('fill', 'none')
            .attr('stroke', '#b5cfc3')
            .attr('stroke-width', 2.5);

          point.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', i === 0 || i === stages.length - 1 ? 5 : 4)
            .attr('fill', '#162620');

          const locName = (d as MigrationStage).location_name;
          if (locName) {
            point.append('text')
              .attr('x', cx + 12)
              .attr('y', cy + 4)
              .text(locName.toUpperCase())
              .attr('font-size', '10px')
              .attr('font-weight', 'bold')
              .attr('fill', '#162620')
              .attr('stroke', '#b5cfc3') // matching ocean color context
              .attr('stroke-width', 3)
              .attr('stroke-linejoin', 'round')
              .style('paint-order', 'stroke fill');
          }
        });

      // Current stage marker (Bubble)
      const current = stages[currentStage];
      const [cx, cy] = projection(current.coordinates)!;

      // Bubble UI is handled in App.tsx for easier positioning, 
      // but we can add a small indicator here if needed.
    }

    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).interrupt();
        d3.select(svgRef.current).selectAll('*').interrupt(); // Ensure child paths are interrupted
      }
    };
  }, [worldData, etymology, currentStage, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#E4E3E0] relative overflow-hidden border-r border-[#141414]">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Coordinates Overlay */}
      <div className="absolute bottom-4 left-4 font-mono text-[10px] opacity-50 pointer-events-none">
        SYSTEM.RESEARCH.GLOBAL_LITHOMORPHOLOGY // 34.0452° S, 18.5905° E
      </div>
    </div>
  );
};

export default Map;

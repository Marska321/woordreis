import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates a series of points forming a Great Circle arc between two coordinates.
 * Useful for realistic geographical animations.
 */
export function getArcPoints(start: [number, number], end: [number, number], segments = 50): [number, number][] {
  const points: [number, number][] = [];
  const [lng1, lat1] = start.map(d => d * Math.PI / 180);
  const [lng2, lat2] = end.map(d => d * Math.PI / 180);

  // Angular distance between points
  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng1 - lng2) / 2), 2)
  ));

  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);

    const newLat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const newLng = Math.atan2(y, x);

    points.push([newLng * 180 / Math.PI, newLat * 180 / Math.PI]);
  }
  return points;
}

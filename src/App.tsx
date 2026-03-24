import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import Map from './components/Map';
import { Sidebar } from './components/Sidebar';
import { Controls } from './components/Controls';
import Phrasebook from './components/Phrasebook';
import Quiz from './components/Quiz';
import { WordEtymology, WordData } from './types';
import wordDataJson from './data/words.json';

const WORD_DATA = wordDataJson as unknown as WordData;
const WORDS = WORD_DATA.words;

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'phrasebook' | 'quiz'>('map');
  const [etymology, setEtymology] = useState<WordEtymology | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSearch = useCallback((query: string) => {
    const normalizedQuery = query.toLowerCase();
    const wordData = WORDS[normalizedQuery];
    
    if (wordData) {
      setEtymology(wordData);
      setCurrentStage(0);
      setIsPlaying(false);
      setError(null);
      setIsSidebarOpen(true); // Open sidebar when searching
    } else {
      setError(`Woord "${query}" nie gevind nie.`);
    }
  }, []);

  const handleStepForward = useCallback(() => {
    if (etymology && currentStage < etymology.stages.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [etymology, currentStage]);

  const handleStepBackward = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
    }
  }, [currentStage]);

  const handleReset = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying && etymology) {
      timerRef.current = setInterval(() => {
        handleStepForward();
      }, 2000 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, etymology, speed, handleStepForward]);

  // Initial word
  useEffect(() => {
    handleSearch('koffie');
  }, [handleSearch]);

  return (
    <div className="flex flex-col h-screen bg-bg text-ink font-mono overflow-hidden">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onSearch={handleSearch}
        isLoading={isLoading}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'map' && (
          <>
            <div className="absolute inset-0 bg-ocean">
              <Map 
                etymology={etymology} 
                currentStage={currentStage} 
              />
            </div>
            
            {etymology && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
                <Controls 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentStage={currentStage}
                  totalStages={etymology.stages.length}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  onReset={handleReset}
                  speed={speed}
                  setSpeed={setSpeed}
                />
              </div>
            )}

            {error && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-sm text-xs font-bold shadow-xl z-50">
                {error}
                <button onClick={() => setError(null)} className="ml-4 underline text-[10px]">TOE</button>
              </div>
            )}

            {etymology && isSidebarOpen && (
              <div className="absolute top-6 right-6 bottom-24 w-80 lg:w-96 z-30 pointer-events-none">
                <div className="h-full pointer-events-auto shadow-2xl rounded-xl overflow-hidden border border-ink/20">
                  <Sidebar 
                    etymology={etymology} 
                    currentStage={currentStage} 
                    onClose={() => setIsSidebarOpen(false)}
                  />
                </div>
              </div>
            )}

            {etymology && !isSidebarOpen && (
              <div className="absolute top-6 right-6 z-30">
                {/* Space for header toggle to be clear or just leave empty */}
              </div>
            )}
          </>
        )}

        {activeTab === 'phrasebook' && <Phrasebook />}
        {activeTab === 'quiz' && <Quiz />}
      </main>
    </div>
  );
}

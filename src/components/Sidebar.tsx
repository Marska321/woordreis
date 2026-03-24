import React from 'react';
import { WordEtymology } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, History, Info, X } from 'lucide-react';

interface SidebarProps {
  etymology: WordEtymology | null;
  currentStage: number;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ etymology, currentStage, onClose }) => {
  if (!etymology) {
    return (
      <div className="w-full h-full border-l border-border bg-panel flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-panel-d flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-ink3" />
        </div>
        <h3 className="text-sm font-bold text-ink mb-2 uppercase tracking-widest">Geen woord gekies nie</h3>
        <p className="text-xs text-ink2 font-serif italic">Soek 'n woord om sy reis deur die geskiedenis te sien.</p>
      </div>
    );
  }

  const current = etymology.stages[currentStage];

  return (
    <div className="w-full h-full bg-panel flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-panel-d relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-ink/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-ink3" />
          </button>
        )}
        <h2 className="text-3xl font-bold tracking-tighter text-ink mb-1 uppercase pr-8">
          {etymology.afrikaans}
        </h2>
        <div className="flex items-center text-xs font-bold text-ink2 uppercase tracking-widest">
          <MapPin className="w-3 h-3 mr-1" />
          {current.location_name}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Origin Section */}
        <section>
          <h3 className="text-[10px] font-bold text-ink3 uppercase tracking-[0.2em] mb-3 flex items-center">
            <History className="w-3 h-3 mr-2" />
            Oorsprong
          </h3>
          <p className="text-sm font-serif leading-relaxed text-ink italic">
            {etymology.origin.meaning} ({etymology.origin.language}, {etymology.origin.period})
          </p>
        </section>

        {/* Narrative Section */}
        <section>
          <h3 className="text-[10px] font-bold text-ink3 uppercase tracking-[0.2em] mb-3">
            Verhaal
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-serif leading-relaxed text-ink"
            >
              {current.description}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Migration Log */}
        <section>
          <h3 className="text-[10px] font-bold text-ink3 uppercase tracking-[0.2em] mb-4">
            Reislogboek
          </h3>
          <div className="space-y-4">
            {etymology.stages.map((stage, idx) => (
              <div
                key={idx}
                className={`relative pl-6 pb-4 border-l transition-colors ${
                  idx <= currentStage ? 'border-ink' : 'border-ink3/30'
                } last:pb-0 last:border-l-0`}
              >
                {/* Dot */}
                <div
                  className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full transition-colors ${
                    idx <= currentStage ? 'bg-ink' : 'bg-ink3/30'
                  }`}
                />
                
                <div className={`transition-opacity ${idx <= currentStage ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="text-[10px] font-bold text-ink2 uppercase tracking-widest mb-1">
                    {stage.location_name}
                  </div>
                  <div className="text-xs font-bold text-ink">
                    {stage.word}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-ink text-bg text-[9px] font-bold uppercase tracking-widest text-center">
        Data verskaf deur Woordreis API
      </div>
    </div>
  );
};

export default Sidebar;

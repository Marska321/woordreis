import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentStage: number;
  totalStages: number;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  setIsPlaying,
  currentStage,
  totalStages,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  setSpeed,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress Bar */}
      <div className="w-80 md:w-[500px] h-1 bg-ink3/20 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-ink transition-all duration-300"
          style={{ width: `${((currentStage + 1) / totalStages) * 100}%` }}
        />
      </div>

      {/* Control Panel */}
      <div className="flex items-center gap-1 bg-panel p-1 border border-border shadow-2xl rounded-sm">
        <button
          onClick={onReset}
          className="p-2 hover:bg-panel-d text-ink transition-colors"
          title="Herstel"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={onStepBackward}
          disabled={currentStage === 0}
          className="p-2 hover:bg-panel-d text-ink disabled:opacity-30 transition-colors"
          title="Stap Terug"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-ink text-bg hover:bg-ink2 transition-colors rounded-sm mx-1"
          title={isPlaying ? 'Pouse' : 'Speel'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStage === totalStages - 1}
          className="p-2 hover:bg-panel-d text-ink disabled:opacity-30 transition-colors"
          title="Stap Vorentoe"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Speed Selector */}
        <div className="flex items-center gap-1 px-2">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`text-[10px] font-bold w-6 h-6 flex items-center justify-center transition-colors rounded-sm ${
                speed === s ? 'bg-ink text-bg' : 'text-ink2 hover:bg-panel-d'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Stage Indicator */}
      <div className="text-[10px] font-bold text-ink uppercase tracking-widest bg-bg/80 backdrop-blur-sm px-3 py-1 border border-border">
        Stadium {currentStage + 1} van {totalStages}
      </div>
    </div>
  );
};

export default Controls;

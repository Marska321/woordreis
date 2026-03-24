import React, { useState, useRef } from 'react';
import { Search, Map as MapIcon, Book, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import wordDataJson from '../data/words.json';

interface HeaderProps {
  activeTab: 'map' | 'phrasebook' | 'quiz';
  onTabChange: (tab: 'map' | 'phrasebook' | 'quiz') => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const ALL_WORDS = Object.keys(wordDataJson.words).sort();

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onSearch,
  isLoading,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  const scrollMap = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <header className="flex flex-col border-b border-border bg-panel z-50">
      {/* Top Bar */}
      <div className="flex items-stretch h-12">
        {/* Logo */}
        <div className="flex items-center px-4 bg-ink text-bg font-bold tracking-tighter text-xl">
          WOORDREIS
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-1 items-stretch">
          <button
            onClick={() => onTabChange('map')}
            className={`flex items-center px-6 border-r border-border transition-colors ${
              activeTab === 'map' ? 'bg-bg text-ink' : 'bg-panel text-ink2 hover:bg-panel-d'
            }`}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold tracking-widest uppercase">Kaart</span>
          </button>
          <button
            onClick={() => onTabChange('phrasebook')}
            className={`flex items-center px-6 border-r border-border transition-colors ${
              activeTab === 'phrasebook' ? 'bg-bg text-ink' : 'bg-panel text-ink2 hover:bg-panel-d'
            }`}
          >
            <Book className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold tracking-widest uppercase">Fraseboek</span>
          </button>
          <button
            onClick={() => onTabChange('quiz')}
            className={`flex items-center px-6 border-r border-border transition-colors ${
              activeTab === 'quiz' ? 'bg-bg text-ink' : 'bg-panel text-ink2 hover:bg-panel-d'
            }`}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold tracking-widest uppercase">Vasvra</span>
          </button>
        </div>

        {/* Sidebar Toggle (Only on Map tab) */}
        {activeTab === 'map' && (
          <button
            onClick={onToggleSidebar}
            className={`flex items-center px-4 border-l border-border transition-colors ${
              isSidebarOpen ? 'bg-ink text-bg' : 'bg-panel text-ink hover:bg-panel-d'
            }`}
            title={isSidebarOpen ? 'Versteek Sidebar' : 'Wys Sidebar'}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
              <div className={`w-4 h-0.5 transition-all ${isSidebarOpen ? 'bg-bg' : 'bg-ink'}`}></div>
              <div className={`w-4 h-0.5 transition-all ${isSidebarOpen ? 'bg-bg' : 'bg-ink'}`}></div>
              <div className={`w-4 h-0.5 transition-all ${isSidebarOpen ? 'bg-bg' : 'bg-ink'}`}></div>
            </div>
          </button>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center px-4 border-l border-border bg-panel-d">
          <Search className="w-4 h-4 text-ink3 mr-2" />
          <input
            type="text"
            list="word-list"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SOEK WOORD..."
            disabled={isLoading}
            className="bg-transparent border-none outline-none text-xs font-bold tracking-widest placeholder:text-ink3 w-48"
          />
          <datalist id="word-list">
            {ALL_WORDS.map((word) => (
              <option key={word} value={word} />
            ))}
          </datalist>
        </form>
      </div>

      {/* Word Strip (Only on Map tab) */}
      {activeTab === 'map' && (
        <div className="flex items-center h-10 bg-bg px-4 border-t border-border relative">
          <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest mr-4 whitespace-nowrap z-10 bg-bg pr-2">
            Alle Woorde:
          </span>
          
          <button 
            onClick={() => scrollMap(-250)} 
            className="z-10 bg-bg hover:bg-panel text-ink py-1 px-2 border-r border-border transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div ref={scrollRef} className="flex gap-4 overflow-x-hidden scroll-smooth flex-1 px-4 no-scrollbar">
            {ALL_WORDS.map((word) => (
              <button
                key={word}
                onClick={() => onSearch(word)}
                className="text-xs font-bold text-ink2 hover:text-ink transition-colors whitespace-nowrap shrink-0"
              >
                {word.toUpperCase()}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollMap(250)} 
            className="z-10 bg-bg hover:bg-panel text-ink py-1 px-2 border-l border-border transition-colors flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

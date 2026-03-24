import React, { useState } from 'react';
import { PhraseCategory } from '../types';
import { Search, Volume2, BookOpen } from 'lucide-react';

const PHRASEBOOK_DATA: PhraseCategory[] = [
  {
    category: "Groete (Greetings)",
    phrases: [
      { afrikaans: "Goeiemôre", english: "Good morning", phonetic: "Goo-ee-mor-uh" },
      { afrikaans: "Goeiedag", english: "Good day", phonetic: "Goo-ee-dag" },
      { afrikaans: "Goeienaand", english: "Good evening", phonetic: "Goo-ee-nahnd" },
      { afrikaans: "Hoe gaan dit?", english: "How are you?", phonetic: "Who gahn dit?" },
      { afrikaans: "Goed, dankie", english: "Fine, thank you", phonetic: "Goot, dahn-kee" },
      { afrikaans: "Totsiens", english: "Goodbye", phonetic: "Tot-seens" },
      { afrikaans: "Aangename kennis", english: "Pleased to meet you", phonetic: "Ahn-guh-nah-muh ken-nis" },
      { afrikaans: "Sien jou later", english: "See you later", phonetic: "Seen yo lah-ter" },
    ]
  },
  {
    category: "Algemene Vrae (General Questions)",
    phrases: [
      { afrikaans: "Wat is jou naam?", english: "What is your name?", phonetic: "Vat is yo nahm?" },
      { afrikaans: "Praat jy Engels?", english: "Do you speak English?", phonetic: "Praht yay Eng-uls?" },
      { afrikaans: "Ek verstaan nie", english: "I don't understand", phonetic: "Ek fer-stahn nee" },
      { afrikaans: "Kan jy help?", english: "Can you help?", phonetic: "Kahn yay help?" },
    ]
  },
  {
    category: "Aanwysings (Directions)",
    phrases: [
      { afrikaans: "Waar is die...?", english: "Where is the...?", phonetic: "Vahr is dee...?" },
      { afrikaans: "Draai links", english: "Turn left", phonetic: "Dry links" },
      { afrikaans: "Draai regs", english: "Turn right", phonetic: "Dry rechs" },
      { afrikaans: "Reguit aan", english: "Straight ahead", phonetic: "Rech-it ahn" },
      { afrikaans: "Hoe ver is dit?", english: "How far is it?", phonetic: "Who fer is dit?" },
    ]
  },
  {
    category: "Kos Bestel (Ordering Food)",
    phrases: [
      { afrikaans: "Ek wil graag... hê", english: "I would like... please", phonetic: "Ek vil grahch... hay" },
      { afrikaans: "Die rekening, asseblief", english: "The bill, please", phonetic: "Dee ray-ken-ing, ah-suh-bleef" },
      { afrikaans: "Baie lekker", english: "Very delicious", phonetic: "By-uh lek-ker" },
      { afrikaans: "Water, asseblief", english: "Water, please", phonetic: "Vah-ter, ah-suh-bleef" },
    ]
  },
  {
    category: "Noodgevalle (Emergencies)",
    phrases: [
      { afrikaans: "Help my!", english: "Help me!", phonetic: "Help may!" },
      { afrikaans: "Bel 'n dokter", english: "Call a doctor", phonetic: "Bel un dok-ter" },
      { afrikaans: "Ek is verlore", english: "I am lost", phonetic: "Ek is fer-lor-uh" },
    ]
  }
];

const Phrasebook: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = PHRASEBOOK_DATA.map(cat => ({
    ...cat,
    phrases: cat.phrases.filter(p => 
      p.afrikaans.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.english.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.phrases.length > 0);

  return (
    <div className="flex-1 bg-[#E4E3E0] overflow-y-auto p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center gap-3">
            <BookOpen size={32} /> FRASEBOEK
          </h1>
          <p className="opacity-60 text-sm italic">NOODSAAKLIKE AFRIKAANSE FRASES VIR ELKE SITUASIE.</p>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="SOEK FRASES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-[#141414] px-4 py-3 focus:outline-none focus:bg-[#fff]/50 transition-colors"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {filteredData.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <div className="inline-block bg-[#141414] text-[#E4E3E0] px-3 py-1 text-xs font-bold uppercase tracking-widest">
                {cat.category}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.phrases.map((phrase, pIdx) => (
                  <div key={pIdx} className="border border-[#141414] p-4 bg-[#fff]/50 hover:bg-[#141414] hover:text-[#E4E3E0] group transition-all cursor-default shadow-[2px_2px_0_0_#141414]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-bold">{phrase.afrikaans}</span>
                      <Volume2 size={16} className="opacity-30 group-hover:opacity-100" />
                    </div>
                    <div className="text-xs opacity-60 group-hover:opacity-80 mb-1">{phrase.english}</div>
                    <div className="text-[10px] italic opacity-40 group-hover:opacity-60">
                      Uitspraak: {phrase.phonetic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-20 opacity-40 italic">
            GEEN FRASES GEVIND NIE...
          </div>
        )}
      </div>
    </div>
  );
});

export default Phrasebook;

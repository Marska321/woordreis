export interface MigrationStage {
  word: string;
  language: string;
  period: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  location_name: string;
}

export interface WordOrigin {
  word: string;
  language: string;
  language_code?: string;
  period: string;
  meaning: string;
  location_name: string;
  coordinates: [number, number];
}

export interface WordEtymology {
  afrikaans: string;
  english: string;
  part_of_speech?: string;
  source_language?: string;
  wiktionary_url?: string;
  verified?: boolean;
  origin: WordOrigin;
  narrative: string;
  stages: MigrationStage[];
  notes?: string;
}

export interface WordData {
  _meta: {
    version: string;
    language: string;
    description: string;
    sources: string[];
    notes: string;
  };
  words: Record<string, WordEtymology>;
}

export interface Phrase {
  afrikaans: string;
  english: string;
  phonetic: string;
}

export interface PhraseCategory {
  category: string;
  phrases: Phrase[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizTheme {
  theme: string;
  questions: QuizQuestion[];
}

export interface MapData {
  type: string;
  objects: {
    countries: any;
    land: any;
  };
  arcs: any[];
  transform: any;
}

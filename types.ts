
export type ThemeType = 'solana' | 'quantum' | 'stealth';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  bg: string;
  text: string;
  border: string;
}

export interface LifePathResult {
  value: number;
  method: string;
}

export interface ChineseZodiacResult {
  animal: string;
  element: string;
  yinYang: string;
  animalDescription: string;
  elementDescription: string;
}

export interface LetterologyData {
  pythagorean: { 
    expression: { number: number; keyword: string; trait: string }; 
    soulUrge: { number: number; keyword: string; trait: string }; 
    personality: { number: number; keyword: string; trait: string };
    hiddenPassion: { letters: string[]; count: number; numbers: number[] };
    karmicLessons: { missingNumbers: number[]; lessons: string[] };
    cornerstone: { letter: string; value: number; meaning: string };
    capstone: { letter: string; value: number; meaning: string };
    firstVowel: { letter: string; value: number; meaning: string };
  };
  chaldean: { 
    compound: number; 
    reduced: number; 
    meaning: string;
  };
  kabbalah: { 
    gematria: number; 
    treePath: { num: number; name: string; meaning: string };
  };
  onomastics: {
    origin: string;
    archetype: string;
    phoneticPower: number; // 1-100 based on plosives/vibrants
  };
  stats: { 
    vowels: number; 
    consonants: number; 
    ratio: string; 
    balance: string; 
    mostFrequent: string[];
    dominantElement: { name: string; interpretation: string };
  };
}

export interface UserData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  focusYear: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
}

export interface DomainExpertise {
  id: string;
  name: string;
  level: number;
  xp: number;
  predictions: number;
  winRate: number;
}

export interface GamificationState {
  xp: number;
  level: number;
  tokens: number;
  streak: number;
  lastActive: number;
  badges: Badge[];
  quests: Quest[];
  expertise: DomainExpertise[];
}

export interface PredictionRecord {
  id: string;
  domain: string;
  reasoning: string;
  marketPrice: number; // probability 0-1
  modelEstimate: number; // probability 0-1
  edge: number;
  sizing: number; // Fractional Kelly
  outcome?: 'Win' | 'Loss' | 'Push';
  pnl?: number;
  timestamp: number;
}

export interface VaultItem {
  id: string;
  type: 'script' | 'mnemonic' | 'lecture' | 'prediction';
  title: string;
  content: string;
  timestamp: number;
  metadata?: any;
}

export interface RoadmapStep {
  step: number;
  title: string;
  detail: string;
}

export interface LectureContent {
  title: string;
  effortQuantification: string;
  cliffnotes: string;
  roadmap: RoadmapStep[];
  contrastAnalogy: string; 
  mnemonic: string;
  popCultureAnalogy: string;
  practicalWorkflow: string;
  psychologicalInsight: string;
  assessment: string[];
  holyShitInsight: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  glyph: string;
  house?: number;
}

export interface HousePosition {
  number: number;
  sign: string;
  meaning: string;
}

export interface AstrologyData {
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant?: string;
  completion: number;
  traditions?: {
    vedic: {
      nakshatra: { name: string; lord: string; deity: string; pada: number; quality: string; theme: string };
      rashi: string;
      dashas: { lord: string; startDate: string; endDate: string }[];
    };
    arabian: {
      partOfFortune: { degrees: string; sign: string; meaning: string };
      partOfSpirit: { degrees: string; sign: string; meaning: string };
      lunarMansion: { name: string; range: number[]; meaning: string };
      planetaryHour?: string;
    };
    druid: {
      tree: string;
      symbol: string;
      traits: string;
      totem: string;
      ogham: string;
      moonPhase: string;
    };
    mayan: {
      daySign: string;
      tone: string;
      kin: number;
      longCount: string;
    };
  };
}

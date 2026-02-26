
import { LifePathResult, ChineseZodiacResult, LetterologyData } from '../types';

/**
 * Digit Reduction helper with Master Number support (11, 22, 33)
 * Matches the 'reduce' function in the provided engine.
 */
export const dr = (n: number): number => {
  let v = Math.abs(n);
  if (isNaN(v)) return 0;
  
  while (v > 9 && ![11, 22, 33].includes(v)) {
    v = v.toString().split('').reduce((a, b) => a + Number(b), 0);
  }
  return v;
};

// GG33 Compatibility Sets
const COMPATIBILITY_SETS = [
  [3, 6, 9],
  [2, 4, 8],
  [1, 5, 7],
  [11, 22, 33]
];

export interface LifePathInterpretation {
  number: number;
  title: string;
  objective: string;
  blueprint: string;
  potential: string;
  shadow: string;
  archetype: string;
}

export interface DestinyInterpretation {
  number: number;
  title: string;
  objective: string;
  blueprint: string;
  potential: string;
  shadow: string;
  archetype: string;
}

const LIFE_PATH_DATA: Record<number, LifePathInterpretation> = {
  1: {
    number: 1,
    title: "The Sovereign Leader",
    objective: "Attain total independence and pioneer new pathways through raw initiative.",
    blueprint: "Independence, innovation, and the courage to stand alone as an individual.",
    potential: "CEO, High-level military officer, Serial entrepreneur, or Revolutionary thinker.",
    shadow: "Egotism, aggression, and a paralyzing fear of failure or dependence.",
    archetype: "The Warrior"
  },
  2: {
    number: 2,
    title: "The Master Diplomat",
    objective: "Master the art of cooperation, sensitivity, and maintaining cosmic balance.",
    blueprint: "The power of the support system; working behind the scenes to ensure stability.",
    potential: "Peacemaker, Liaison, Intuitive advisor, or Harmonious architect.",
    shadow: "Over-sensitivity, passivity, and the tendency to become a 'doormat'.",
    archetype: "The Mediator"
  },
  3: {
    number: 3,
    title: "The Radiant Communicator",
    objective: "Master creative self-expression and spread optimism through words and art.",
    blueprint: "Child-like curiosity combined with the adult power of speech and social magnetism.",
    potential: "Public speaker, Entertainer, Master orator, or Creative visionary.",
    shadow: "Scattered energy, superficiality, and a tendency toward gossip or moodiness.",
    archetype: "The Artist"
  },
  4: {
    number: 4,
    title: "The Structural Builder",
    objective: "Build lasting foundations and manifest reality through discipline and order.",
    blueprint: "Practicality, hard work, and the systematic reduction of complexity into form.",
    potential: "Engineer, Project manager, Systems architect, or Security specialist.",
    shadow: "Rigidity, stubbornness, and getting lost in the details while missing the vision.",
    archetype: "The Foundation"
  },
  5: {
    number: 5,
    title: "The Dynamic Catalyst",
    objective: "Experience the breadth of life through freedom, travel, and sensory intelligence.",
    blueprint: "Adaptability and the ability to pivot instantly; the bridge between worlds.",
    potential: "Traveler, Media mogul, Investigative journalist, or Market disruptor.",
    shadow: "Restlessness, impulsiveness, and addiction to stimulation without purpose.",
    archetype: "The Free Spirit"
  },
  6: {
    number: 6,
    title: "The Cosmic Nurturer",
    objective: "Accept responsibility for the harmony of family, community, and service.",
    blueprint: "The vibration of love and justice in action; the pillar of domestic stability.",
    potential: "Teacher, Healer, Community leader, or Interior/Structural designer.",
    shadow: "Perfectionism, meddling, and the 'martyr complex' that sacrifices self-growth.",
    archetype: "The Guardian"
  },
  7: {
    number: 7,
    title: "The Sacred Seeker",
    objective: "Uncover the hidden laws of nature and the mysteries of the human psyche.",
    blueprint: "Intellectual depth, introversion, and the relentless pursuit of spiritual truth.",
    potential: "Scientist, Philosopher, Mystic, or Strategic analyst.",
    shadow: "Isolation, cynicism, and the tendency to disconnect from physical reality.",
    archetype: "The Sage"
  },
  8: {
    number: 8,
    title: "The Power Executive",
    objective: "Balance the material and spiritual worlds through the mastery of authority.",
    blueprint: "Abundance, financial intelligence, and the karmic understanding of power dynamics.",
    potential: "Financier, Property developer, Power broker, or Industry titan.",
    shadow: "Greed, ruthlessness, and the abuse of power for purely egoic ends.",
    archetype: "The Boss"
  },
  9: {
    number: 9,
    title: "The Universal Finisher",
    objective: "Attain universal compassion and master the art of selfless release.",
    blueprint: "The culmination of all numbers; the sage who understands that the end is the beginning.",
    potential: "Philanthropist, Artist, Global influencer, or Humanitarian leader.",
    shadow: "Emotional weight, living in the past, and feeling burdened by the world's pain.",
    archetype: "The Humanitarian"
  },
  11: {
    number: 11,
    title: "The Master Intuitive",
    objective: "Channel high-frequency spiritual illumination into the material plane.",
    blueprint: "The messenger; possessing heightened sensitivity and electric visionary capability.",
    potential: "Spiritual guide, Psychic innovator, or Master of hidden knowledge.",
    shadow: "Nervous tension, indecision, and the 'false prophet' complex.",
    archetype: "The Visionary"
  },
  22: {
    number: 22,
    title: "The Master Architect",
    objective: "Turn grand spiritual visions into concrete, large-scale physical realities.",
    blueprint: "The practical idealist; capable of building global structures that benefit humanity.",
    potential: "World leader, Global builder, or Architect of entire new systems.",
    shadow: "Overwhelming pressure, arrogance, and the 'failed genius' syndrome.",
    archetype: "The Master Builder"
  },
  33: {
    number: 33,
    title: "The Master Teacher",
    objective: "Guide humanity's evolution through compassionate service and selfless healing.",
    blueprint: "The highest vibration of service; protecting and teaching the collective soul.",
    potential: "Master healer, Spiritual teacher at scale, or Universal guardian.",
    shadow: "Emotional burnout, taking on others' karma, and the savior delusion.",
    archetype: "The Master Guardian"
  }
};

const DESTINY_DATA: Record<number, DestinyInterpretation> = {
  1: {
    number: 1,
    title: "The Manifest Individuality",
    objective: "Realize personal ambition and manifest unique ideas into the physical realm.",
    blueprint: "The power to self-start; your name carries the vibration of original creation.",
    potential: "Pioneering entrepreneur, Unique personal brand, or Individualistic innovator.",
    shadow: "Overbearing nature, intolerance, or a struggle with feelings of inadequacy.",
    archetype: "The Originator"
  },
  2: {
    number: 2,
    title: "The Manifest Harmony",
    objective: "Create balance and foster deep cooperation within your sphere of influence.",
    blueprint: "The vibration of the 'glue' that holds systems together through diplomacy.",
    potential: "Tactical negotiator, Strategic partner, or Master of collective synergy.",
    shadow: "Fear of conflict, dependency, or sacrificing personal truth for peace.",
    archetype: "The Facilitator"
  },
  3: {
    number: 3,
    title: "The Manifest Expression",
    objective: "Communicate complex truths through creative and artistic mediums.",
    blueprint: "The vibration of joy and social magnetism; bringing light to the Matrix.",
    potential: "Influential writer, Prolific artist, or Master of social architecture.",
    shadow: "Superficiality, emotional drama, or wasting creative potential on trivia.",
    archetype: "The Messenger"
  },
  4: {
    number: 4,
    title: "The Manifest Stability",
    objective: "Ground spiritual energy into concrete, useful, and lasting structures.",
    blueprint: "The vibration of the square; providing the necessary limits for growth.",
    potential: "Operations director, Systems builder, or Master of practical application.",
    shadow: "Rigidity, excessive caution, or getting trapped in 'how' instead of 'why'.",
    archetype: "The Architect"
  },
  5: {
    number: 5,
    title: "The Manifest Progress",
    objective: "Promote evolution through the embrace of change and personal freedom.",
    blueprint: "The vibration of variety; you are the catalyst that breaks stagnant patterns.",
    potential: "Public relations master, Market explorer, or Catalyst for systemic change.",
    shadow: "Irresponsibility, lack of focus, or fear of emotional depth.",
    archetype: "The Adventurer"
  },
  6: {
    number: 6,
    title: "The Manifest Responsibility",
    objective: "Heal and nurture the collective through dedicated service and love.",
    blueprint: "The vibration of the domestic and cosmic pillar; maintaining harmony.",
    potential: "Holistic healer, Community protector, or Master of aesthetic balance.",
    shadow: "Smothering others, anxiety, or a compulsive need to 'fix' everyone else.",
    archetype: "The Provider"
  },
  7: {
    number: 7,
    title: "The Manifest Wisdom",
    objective: "Search for and disseminate the hidden truths of the universe.",
    blueprint: "The vibration of the specialist; you are hardwired to see behind the veil.",
    potential: "Spiritual researcher, Data mystic, or Strategic deep-thinker.",
    shadow: "Cynicism, social withdrawal, or being 'too smart' for your own good.",
    archetype: "The Truth Seeker"
  },
  8: {
    number: 8,
    title: "The Manifest Authority",
    objective: "Master the material plane and use power for structural advancement.",
    blueprint: "The vibration of the executive; your name is synonymous with efficient power.",
    potential: "Hedge fund manager, Industry leader, or Master of material scaling.",
    shadow: "Greed, bullying tactics, or a complete disconnection from the spiritual.",
    archetype: "The Commander"
  },
  9: {
    number: 9,
    title: "The Manifest Completion",
    objective: "Achieve universal brotherhood and prepare humanity for the next cycle.",
    blueprint: "The vibration of the old soul; understanding the culmination of all experience.",
    potential: "Humanitarian world-leader, Global artist, or Master of spiritual release.",
    shadow: "Martyrdom, living in regrets, or emotional overwhelm from global issues.",
    archetype: "The Sage"
  },
  11: {
    number: 11,
    title: "The Master Illumination",
    objective: "Bridge the gap between the intuitive and the material for the collective.",
    blueprint: "High-voltage spiritual connection; you are a living antenna for the Divine.",
    potential: "Inspirational orator, Master of metaphysical systems, or Intuitive guide.",
    shadow: "Extreme nervous energy, unrealistic expectations, or being 'too intense'.",
    archetype: "The Spiritual Beacon"
  },
  22: {
    number: 22,
    title: "The Master Manifestation",
    objective: "Build global foundations that serve the long-term evolution of humanity.",
    blueprint: "The Master Builder; your name encodes the power of large-scale reality design.",
    potential: "Founder of global institutions, Architect of new eras, or Master of systems.",
    shadow: "Deep internal pressure, arrogance, or failing to use power for the good.",
    archetype: "The Titan"
  },
  33: {
    number: 33,
    title: "The Master Service",
    objective: "Perform selfless acts of healing and teaching at a global scale.",
    blueprint: "The highest vibration of loving-kindness; protecting the vulnerable collective.",
    potential: "World-class teacher, Universal spiritual protector, or Master of healing.",
    shadow: "Total self-neglect, bearing the world's cross, or spiritual pride.",
    archetype: "The Universal Healer"
  }
};

const ZODIAC_ANIMAL_DATA: Record<string, string> = {
  Rat: "The most intelligent sign. Resourceful, versatile, and quick-witted. Rats excel in complex systems and social navigation.",
  Ox: "The pillar of diligence and reliability. Strong-willed and dependable, the Ox provides the foundation for any long-term structure.",
  Tiger: "The primal warrior. Brave, competitive, and unpredictable. Tigers are natural leaders who thrive on high-stakes challenges and independence.",
  Rabbit: "Elegant, quiet, and alert. The Rabbit possesses deep tactical intuition and prefers a strategic, harmonious approach to conflict.",
  Dragon: "The most powerful sign. Enthusiastic, confident, and gifted with natural authority. Dragons are the architects of grand visions.",
  Snake: "Enigmatic, wise, and highly intuitive. The Snake acts with surgical precision and possesses a deep understanding of the hidden Matrix.",
  Horse: "Animated and active. Horses represent the spirit of freedom and raw energy, capable of immense speed and independent achievement.",
  Goat: "Gentle, sympathetic, and creative. Goats are the healers of the zodiac, possessing an innate sense of justice and aesthetic harmony.",
  Monkey: "Sharp, smart, and innovative. The Monkey is the master of problem-solving and can manipulate the material plane with effortless skill.",
  Rooster: "Observant, hardworking, and courageous. Roosters are the guardians of truth and precision, often excelling in technical or strategic roles.",
  Dog: "Loyal, honest, and prudent. The Dog is the ultimate protector, possessing a fierce sense of duty and an unwavering moral compass.",
  Pig: "Compassionate, generous, and diligent. The Pig represents noble abundance and the ability to finish what others have started with grace."
};

const ZODIAC_ELEMENT_DATA: Record<string, string> = {
  Metal: "Rigid, determined, and persistent. Metal types value precision and are driven by logic and structural integrity.",
  Water: "Flexible, intuitive, and wise. Water types excel in communication and understanding the unseen flows of the universe.",
  Wood: "Expansive, creative, and idealistic. Wood types are focused on growth, innovation, and building future-facing systems.",
  Fire: "Dynamic, passionate, and aggressive. Fire types are the catalysts of change, providing the heat for transformation and leadership.",
  Earth: "Stable, reliable, and grounded. Earth types are the providers of security and practical common sense in any environment."
};

export interface PersonalYearInterpretation {
  number: number;
  title: string;
  theme: string;
  advice: string;
}

const PERSONAL_YEAR_DATA: Record<number, PersonalYearInterpretation> = {
  1: {
    number: 1,
    title: "The Year of New Beginnings",
    theme: "Initiative, independence, and planting seeds for the next 9-year cycle.",
    advice: "Take bold action. Start new projects. Trust your individual vision."
  },
  2: {
    number: 2,
    title: "The Year of Cooperation",
    theme: "Patience, relationships, and working behind the scenes.",
    advice: "Focus on partnerships. Be patient. Nurture what you started last year."
  },
  3: {
    number: 3,
    title: "The Year of Self-Expression",
    theme: "Creativity, social expansion, and joy.",
    advice: "Express yourself. Network. Don't scatter your energy too thin."
  },
  4: {
    number: 4,
    title: "The Year of Discipline",
    theme: "Hard work, foundations, and organization.",
    advice: "Get organized. Focus on health and stability. Build for the long term."
  },
  5: {
    number: 5,
    title: "The Year of Change",
    theme: "Freedom, travel, and unexpected opportunities.",
    advice: "Be adaptable. Embrace change. Explore new horizons."
  },
  6: {
    number: 6,
    title: "The Year of Responsibility",
    theme: "Family, service, and domestic harmony.",
    advice: "Focus on home and community. Be of service to others. Heal relationships."
  },
  7: {
    number: 7,
    title: "The Year of Introspection",
    theme: "Spiritual growth, study, and inner reflection.",
    advice: "Spend time alone. Meditate. Analyze your path. Don't force material growth."
  },
  8: {
    number: 8,
    title: "The Year of Manifestation",
    theme: "Power, finances, and material achievement.",
    advice: "Take charge of your career. Balance material and spiritual power. Think big."
  },
  9: {
    number: 9,
    title: "The Year of Completion",
    theme: "Release, endings, and humanitarianism.",
    advice: "Let go of what no longer serves you. Finish projects. Prepare for a new cycle."
  }
};

export function getPersonalYearInterpretation(num: number): PersonalYearInterpretation | null {
  return PERSONAL_YEAR_DATA[num] || null;
}

export function getLifePathInterpretation(num: number): LifePathInterpretation | null {
  return LIFE_PATH_DATA[num] || null;
}

export function getDestinyInterpretation(num: number): DestinyInterpretation | null {
  return DESTINY_DATA[num] || null;
}

export function getCompatibilityScore(n1: number, n2: number): { score: number; relation: 'Friendly' | 'Neutral' | 'Enemy' } {
  const r1 = dr(n1);
  const r2 = dr(n2);
  
  const set = COMPATIBILITY_SETS.find(s => s.includes(r1) && s.includes(r2));
  if (set) return { score: 90 + Math.floor(Math.random() * 10), relation: 'Friendly' };
  
  if ((r1 === 1 && r2 === 8) || (r1 === 8 && r2 === 1)) return { score: 15 + Math.floor(Math.random() * 15), relation: 'Enemy' };
  
  return { score: 45 + Math.floor(Math.random() * 20), relation: 'Neutral' };
}

export function getVibrationalAxes(lp: number, destiny: number, zodiac: string) {
  const base = { physical: 50, mental: 50, emotional: 50, spiritual: 50 };
  
  if ([1, 4, 8].includes(lp)) base.physical += 30;
  if ([3, 5, 7].includes(lp)) base.mental += 30;
  if ([2, 6, 9].includes(lp)) base.emotional += 30;
  if ([11, 22, 33].includes(lp)) base.spiritual += 40;

  const fire = ["Tiger", "Horse", "Dog"];
  const water = ["Pig", "Rabbit", "Goat"];
  
  if (fire.includes(zodiac)) base.physical += 10;
  if (water.includes(zodiac)) base.emotional += 10;
  
  return [
    { axis: 'Physical', value: Math.min(base.physical, 100) },
    { axis: 'Mental', value: Math.min(base.mental, 100) },
    { axis: 'Emotional', value: Math.min(base.emotional, 100) },
    { axis: 'Spiritual', value: Math.min(base.spiritual, 100) },
  ];
}

/**
 * GG33 Life Path Engine
 * Sums all individual digits of the DOB as per the engine requirement.
 */
export function calculateLifePathGG33(birthDateStr: string): LifePathResult {
  if (!birthDateStr) return { value: 0, method: "0 + 0 + 0 = 0" };
  const digits = birthDateStr.replace(/[^0-9]/g, '').split('').map(Number);
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const reduced = dr(rawSum);
  return { 
    value: reduced, 
    method: digits.join(' + ') + ` = ${rawSum} → ${reduced}` 
  };
}

export function calculatePersonalYear(birthDateStr: string, focusYear: number): number {
  if (!birthDateStr) return 0;
  const dt = new Date(birthDateStr);
  if (isNaN(dt.getTime())) return 0;
  const m = dt.getUTCMonth() + 1;
  const d = dt.getUTCDate();
  const fyDigits = focusYear.toString().split('').map(Number);
  const fySum = fyDigits.reduce((a, b) => a + b, 0);
  return dr(m + d + fySum);
}

/**
 * Expression (Destiny) Number
 * Matches provided engine logic.
 */
export function calculateDestinyNumber(name: string): number {
  const map: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
  };
  const sum = (name || "")
    .toUpperCase()
    .replace(/[^A-Z]/g,'')
    .split('')
    .reduce((a,c)=>a+(map[c]||0),0);

  return dr(sum);
}

/**
 * Check for Wealth 28 vibration
 */
export function isWealth28(num: number): boolean {
  const reduceToRaw = (n: number) => n.toString().split('').reduce((a, b) => a + Number(b), 0);
  let v = num;
  while (v > 28) {
    v = reduceToRaw(v);
  }
  return v === 28;
}

export function calculateRarityScore(lp: number, destiny: number, animal: string): number {
  let score = 50; 
  if (lp === 11) score += 25;
  if (lp === 22) score += 35;
  if (lp === 33) score += 45;
  if (lp === 8 || lp === 9) score += 10;
  if (animal === "Dragon" || animal === "Tiger") score += 15;
  if (lp === destiny) score += 20;
  return Math.min(score, 99);
}

export function getChineseZodiac(year: number): ChineseZodiacResult {
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const stemData = [
    { element: "Metal", yin: false }, { element: "Metal", yin: true },
    { element: "Water", yin: false }, { element: "Water", yin: true },
    { element: "Wood", yin: false }, { element: "Wood", yin: true },
    { element: "Fire", yin: false }, { element: "Fire", yin: true },
    { element: "Earth", yin: false }, { element: "Earth", yin: true }
  ];
  if (isNaN(year)) year = 2000;
  const animalIndex = (year - 4) % 12;
  const animal = animals[(animalIndex + 12) % 12];
  const stemIndex = year % 10;
  const { element, yin } = stemData[stemIndex];
  
  return { 
    animal, 
    element, 
    yinYang: yin ? "Yin" : "Yang", 
    animalDescription: ZODIAC_ANIMAL_DATA[animal] || "Archetype decoding in progress.", 
    elementDescription: ZODIAC_ELEMENT_DATA[element] || "Vibrational signature analyzing." 
  };
}

/**
 * COMPREHENSIVE LETTEROLOGY (NAME ANALYSIS) CALCULATOR
 */
export function calculateLetterology(name: string): LetterologyData {
  const cleanName = (name || "").toUpperCase().replace(/[^A-Z]/g, '');
  const letters = cleanName.split('');
  const vowelsArr = ['A', 'E', 'I', 'O', 'U'];
  const firstName = (name || "").split(' ')[0].toUpperCase();

  const map: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
  };
  
  const chaldValues: Record<string, number> = { 'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1, 'B': 2, 'K': 2, 'R': 2, 'C': 3, 'G': 3, 'L': 3, 'S': 3, 'D': 4, 'M': 4, 'T': 4, 'E': 5, 'H': 5, 'N': 5, 'X': 5, 'U': 6, 'V': 6, 'W': 6, 'O': 7, 'Z': 7, 'F': 8, 'P': 8 };
  const kabValues: Record<string, number> = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10, 'K': 20, 'L': 30, 'M': 40, 'N': 50, 'O': 60, 'P': 70, 'Q': 80, 'R': 90, 'S': 100, 'T': 110, 'U': 120, 'V': 130, 'W': 140, 'X': 150, 'Y': 160, 'Z': 170 };

  const pythInt = (n: number) => {
    const interpretations: Record<number, { keyword: string; trait: string }> = {
      1: { keyword: "Leadership", trait: "Independent, pioneering, ambitious, confident" },
      2: { keyword: "Cooperation", trait: "Diplomatic, sensitive, peacemaker, intuitive" },
      3: { keyword: "Expression", trait: "Creative, social, optimistic, expressive" },
      4: { keyword: "Stability", trait: "Practical, organized, hardworking, loyal" },
      5: { keyword: "Freedom", trait: "Adventurous, dynamic, versatile, progressive" },
      6: { keyword: "Responsibility", trait: "Nurturing, caring, responsible, harmonious" },
      7: { keyword: "Analysis", trait: "Spiritual, analytical, introspective, wise" },
      8: { keyword: "Power", trait: "Ambitious, authoritative, material success, efficient" },
      9: { keyword: "Humanitarianism", trait: "Compassionate, idealistic, generous, artistic" },
      11: { keyword: "Inspiration", trait: "Intuitive, spiritual, visionary, idealistic (Master)" },
      22: { keyword: "Master Builder", trait: "Practical idealist, manifests dreams, powerful (Master)" },
      33: { keyword: "Master Teacher", trait: "Selfless service, spiritual teaching, healing (Master)" }
    };
    return interpretations[n] || { keyword: "Neutral", trait: "Observation mode" };
  };

  const chaldCompInt = (n: number) => {
    const meanings: Record<number, string> = {
      10: "Wheel of Fortune - Success through ups and downs",
      11: "Lion Muzzled - Hidden strength, requires courage",
      12: "Sacrifice - Anxiety and struggle, victim mentality",
      13: "Regeneration - Death and rebirth, transformation",
      14: "Movement - Changeability, speculation, risk",
      15: "Magician - Spiritual insight, eloquence, charm",
      16: "Shattered Tower - Warnings, destruction, new beginnings",
      17: "Star of the Magi - Spiritual power, immortality",
      18: "Spiritual Insight - Conflict, materialism vs spirituality",
      19: "Prince of Heaven - Success, happiness, victory",
      20: "Awakening - Judgment, renewal, transformation",
      21: "Crown of the Magi - Ultimate success, advancement",
      22: "Fool - Caution needed, blind faith, materialism"
    };
    return meanings[n] || "Compound resonance active";
  };

  const getOnomasticArchetype = (l: string) => {
    const archetypes: Record<string, { origin: string; arch: string }> = {
      'A': { origin: 'Ancient Semitic', arch: 'The Pioneer' },
      'B': { origin: 'Phoenician', arch: 'The Builder' },
      'C': { origin: 'Latin', arch: 'The Communicator' },
      'D': { origin: 'Greek', arch: 'The Foundation' },
      'E': { origin: 'Hebrew', arch: 'The Visionary' },
      'F': { origin: 'Germanic', arch: 'The Protector' }
    };
    return archetypes[l] || { origin: 'Indo-European', arch: 'The Seeker' };
  };

  const sephirot = [
    { num: 1, name: "Kether", meaning: "Crown - Divine will, unity" },
    { num: 2, name: "Chokmah", meaning: "Wisdom - Pure creation" },
    { num: 3, name: "Binah", meaning: "Understanding - Form, structure" },
    { num: 4, name: "Chesed", meaning: "Mercy - Love, expansion" },
    { num: 5, name: "Geburah", meaning: "Severity - Strength, discipline" },
    { num: 6, name: "Tiphareth", meaning: "Beauty - Balance, harmony" },
    { num: 7, name: "Netzach", meaning: "Victory - Eternity, emotions" },
    { num: 8, name: "Hod", meaning: "Glory - Intellect, communication" },
    { num: 9, name: "Yesod", meaning: "Foundation - Connection, sexuality" },
    { num: 10, name: "Malkuth", meaning: "Kingdom - Physical world, manifestation" }
  ];

  let pythExpr = 0, soulSum = 0, personaSum = 0, chaldSum = 0, kabSum = 0;
  let vCount = 0, cCount = 0, phoneticScore = 0;
  const freq: Record<string, number> = {};

  const plosives = ['P', 'B', 'T', 'D', 'K', 'G'];
  const vibrants = ['R', 'L'];

  letters.forEach(l => {
    pythExpr += map[l] || 0;
    chaldSum += chaldValues[l] || 0;
    kabSum += kabValues[l] || 0;
    if (vowelsArr.includes(l)) {
      soulSum += map[l] || 0;
      vCount++;
    } else if (map[l]) {
      personaSum += map[l] || 0;
      cCount++;
      if (plosives.includes(l)) phoneticScore += 10;
      if (vibrants.includes(l)) phoneticScore += 5;
    }
    freq[l] = (freq[l] || 0) + 1;
  });

  const hiddenPassionLetters = Object.entries(freq).sort((a,b) => b[1] - a[1]);
  const maxFreq = hiddenPassionLetters[0]?.[1] || 0;
  const passionLetters = hiddenPassionLetters.filter(x => x[1] === maxFreq).map(x => x[0]);

  const presentNumbers = new Set(letters.map(l => map[l]).filter(Boolean));
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !presentNumbers.has(n));

  const cornerstone = firstName[0] || "";
  const capstone = firstName[firstName.length - 1] || "";
  const firstVowel = firstName.split('').find(l => vowelsArr.includes(l)) || "";

  const elements = {
    fire: ['A', 'J', 'S'], water: ['B', 'K', 'T'], air: ['C', 'L', 'U'],
    earth: ['D', 'M', 'V'], spirit: ['E', 'N', 'W'], love: ['F', 'O', 'X'],
    wisdom: ['G', 'P', 'Y'], power: ['H', 'Q', 'Z'], universal: ['I', 'R']
  };
  const elementCounts: Record<string, number> = { fire:0, water:0, air:0, earth:0, spirit:0, love:0, wisdom:0, power:0, universal:0 };
  letters.forEach(l => {
    Object.entries(elements).forEach(([k, v]) => { if(v.includes(l)) elementCounts[k]++; });
  });
  const dominantElement = Object.entries(elementCounts).reduce((a,b) => b[1] > a[1] ? b : a, ['spirit', 0])[0];
  const elementInt: Record<string, string> = { fire: "Passionate, leader", water: "Emotional, intuitive", air: "Intellectual, speaker", earth: "Grounded, stable", spirit: "Freedom, seeker", love: "Nurturing, harmony", wisdom: "Analytical, wise", power: "Authoritative, material", universal: "Compassionate, humanitarian" };

  const onomastic = getOnomasticArchetype(cornerstone);

  return {
    pythagorean: {
      expression: { number: dr(pythExpr), ...pythInt(dr(pythExpr)) },
      soulUrge: { number: dr(soulSum), ...pythInt(dr(soulSum)) },
      personality: { number: dr(personaSum), ...pythInt(dr(personaSum)) },
      hiddenPassion: { letters: passionLetters, count: maxFreq, numbers: passionLetters.map(l => map[l]) },
      karmicLessons: { missingNumbers: missing, lessons: missing.map(n => "Learn " + pythInt(n).keyword) },
      cornerstone: { letter: cornerstone, value: map[cornerstone], meaning: "Approach to life" },
      capstone: { letter: capstone, value: map[capstone], meaning: "Handling endings" },
      firstVowel: { letter: firstVowel, value: map[firstVowel], meaning: "Inner reaction" }
    },
    chaldean: {
      compound: chaldSum,
      reduced: dr(chaldSum),
      meaning: chaldCompInt(chaldSum)
    },
    kabbalah: {
      gematria: kabSum,
      treePath: sephirot[(kabSum % 10)]
    },
    onomastics: {
      origin: onomastic.origin,
      archetype: onomastic.arch,
      phoneticPower: Math.min(100, phoneticScore)
    },
    stats: {
      vowels: vCount,
      consonants: cCount,
      ratio: cCount > 0 ? (vCount / cCount).toFixed(2) : vCount.toString(),
      balance: vCount === cCount ? "Balanced" : (vCount > cCount ? "Vowel Heavy" : "Consonant Heavy"),
      mostFrequent: passionLetters,
      dominantElement: { name: dominantElement, interpretation: elementInt[dominantElement] }
    }
  };
}

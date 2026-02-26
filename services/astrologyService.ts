
import { PlanetPosition, HousePosition, AstrologyData, UserData } from '../types';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANET_GLYPHS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  Ascendant: "AC", Midheaven: "MC"
};

// ============================================
// 1. VEDIC (JYOTISH) ASTROLOGY
// ============================================

class VedicAstrology {
  static AYANAMSA_LAHIRI = 24.11;

  static nakshatras = [
    { name: "Ashwini", lord: "Ketu", range: [0, 13.33], deity: "Ashwini Kumaras" },
    { name: "Bharani", lord: "Venus", range: [13.33, 26.67], deity: "Yama" },
    { name: "Krittika", lord: "Sun", range: [26.67, 40], deity: "Agni" },
    { name: "Rohini", lord: "Moon", range: [40, 53.33], deity: "Brahma" },
    { name: "Mrigashira", lord: "Mars", range: [53.33, 66.67], deity: "Soma" },
    { name: "Ardra", lord: "Rahu", range: [66.67, 80], deity: "Rudra" },
    { name: "Punarvasu", lord: "Jupiter", range: [80, 93.33], deity: "Aditi" },
    { name: "Pushya", lord: "Saturn", range: [93.33, 106.67], deity: "Brihaspati" },
    { name: "Ashlesha", lord: "Mercury", range: [106.67, 120], deity: "Nagas" },
    { name: "Magha", lord: "Ketu", range: [120, 133.33], deity: "Pitris" },
    { name: "Purva Phalguni", lord: "Venus", range: [133.33, 146.67], deity: "Bhaga" },
    { name: "Uttara Phalguni", lord: "Sun", range: [146.67, 160], deity: "Aryaman" },
    { name: "Hasta", lord: "Moon", range: [160, 173.33], deity: "Savitar" },
    { name: "Chitra", lord: "Mars", range: [173.33, 186.67], deity: "Tvashtar" },
    { name: "Swati", lord: "Rahu", range: [186.67, 200], deity: "Vayu" },
    { name: "Vishakha", lord: "Jupiter", range: [200, 213.33], deity: "Indra-Agni" },
    { name: "Anuradha", lord: "Saturn", range: [213.33, 226.67], deity: "Mitra" },
    { name: "Jyeshtha", lord: "Mercury", range: [226.67, 240], deity: "Indra" },
    { name: "Mula", lord: "Ketu", range: [240, 253.33], deity: "Nirriti" },
    { name: "Purva Ashadha", lord: "Venus", range: [253.33, 266.67], deity: "Apas" },
    { name: "Uttara Ashadha", lord: "Sun", range: [266.67, 280], deity: "Vishvadevas" },
    { name: "Shravana", lord: "Moon", range: [280, 293.33], deity: "Vishnu" },
    { name: "Dhanishtha", lord: "Mars", range: [293.33, 306.67], deity: "Vasus" },
    { name: "Shatabhisha", lord: "Rahu", range: [306.67, 320], deity: "Varuna" },
    { name: "Purva Bhadrapada", lord: "Jupiter", range: [320, 333.33], deity: "Aja Ekapada" },
    { name: "Uttara Bhadrapada", lord: "Saturn", range: [333.33, 346.67], deity: "Ahir Budhnya" },
    { name: "Revati", lord: "Mercury", range: [346.67, 360], deity: "Pushan" }
  ];

  static tropicalToSidereal(tropicalDegrees: number) {
    let sidereal = tropicalDegrees - this.AYANAMSA_LAHIRI;
    if (sidereal < 0) sidereal += 360;
    return sidereal % 360;
  }

  static calculateNakshatra(moonDegrees: number) {
    const siderealDegrees = this.tropicalToSidereal(moonDegrees);
    for (let nakshatra of this.nakshatras) {
      if (siderealDegrees >= nakshatra.range[0] && siderealDegrees < nakshatra.range[1]) {
        const interpretation = this.interpretNakshatra(nakshatra.name);
        return {
          ...nakshatra,
          pada: Math.floor((siderealDegrees - nakshatra.range[0]) / 3.33) + 1,
          quality: interpretation.quality,
          theme: interpretation.theme
        };
      }
    }
    return { ...this.nakshatras[0], pada: 1, quality: "Swift", theme: "Beginnings" };
  }

  static calculateRashi(tropicalDegrees: number) {
    const rashis = [
      "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)",
      "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
      "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)",
      "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
    ];
    const sidereal = this.tropicalToSidereal(tropicalDegrees);
    return rashis[Math.floor(sidereal / 30)];
  }

  static calculateDasha(nakshatraLord: string, birthDate: string): { lord: string; startDate: string; endDate: string }[] {
    const dashaLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    const dashaYears = [7, 20, 6, 10, 7, 18, 16, 19, 17];
    let startIndex = dashaLords.indexOf(nakshatraLord);
    if (startIndex === -1) startIndex = 0;
    const birthDateObj = new Date(birthDate);
    const dashas: { lord: string; startDate: string; endDate: string }[] = [];
    let currentDate = new Date(birthDateObj);
    for (let i = 0; i < 9; i++) {
      const lordIndex = (startIndex + i) % dashaLords.length;
      const endDate = new Date(currentDate);
      endDate.setFullYear(endDate.getFullYear() + dashaYears[lordIndex]);
      dashas.push({
        lord: dashaLords[lordIndex],
        startDate: currentDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });
      currentDate = new Date(endDate);
    }
    return dashas;
  }

  static interpretNakshatra(nakshatraName: string) {
    const interpretations: Record<string, { quality: string; theme: string }> = {
      "Ashwini": { quality: "Swift, healing, pioneering", theme: "New beginnings, speed, vitality" },
      "Bharani": { quality: "Transformative, creative, intense", theme: "Birth, death, transformation" },
      "Krittika": { quality: "Sharp, purifying, determined", theme: "Cutting through, clarity, fame" },
      "Rohini": { quality: "Creative, beautiful, material", theme: "Growth, abundance, fertility" },
      "Mrigashira": { quality: "Curious, seeking, gentle", theme: "Search, exploration, sensitivity" },
      "Ardra": { quality: "Stormy, intellectual, intense", theme: "Destruction, renewal, clarity" },
      "Punarvasu": { quality: "Abundant, nurturing, returning", theme: "Renewal, safety, prosperity" },
      "Pushya": { quality: "Nourishing, spiritual, protective", theme: "Support, nourishment, wisdom" }
    };
    return interpretations[nakshatraName] || { quality: "Mysterious", theme: "Universal flow" };
  }
}

// ============================================
// 2. ARABIAN/ISLAMIC ASTROLOGY
// ============================================

class ArabianAstrology {
  static calculateParts(sunDegrees: number, moonDegrees: number, ascendantDegrees: number) {
    const partOfFortune = (ascendantDegrees + moonDegrees - sunDegrees + 360) % 360;
    const partOfSpirit = (ascendantDegrees + sunDegrees - moonDegrees + 360) % 360;
    return {
      partOfFortune: { degrees: partOfFortune.toFixed(2), sign: this.degreesToSign(partOfFortune), meaning: "Material prosperity & health" },
      partOfSpirit: { degrees: partOfSpirit.toFixed(2), sign: this.degreesToSign(partOfSpirit), meaning: "Soul purpose & spiritual path" }
    };
  }

  static lunarMansions = [
    { name: "Al-Sharatain", range: [0, 12.86], meaning: "The Two Signs" },
    { name: "Al-Butain", range: [12.86, 25.71], meaning: "The Belly" },
    { name: "Al-Thurayya", range: [25.71, 38.57], meaning: "The Pleiades" },
    { name: "Al-Dabaran", range: [38.57, 51.43], meaning: "The Follower" }
  ];

  static calculateLunarMansion(moonDegrees: number) {
    const mansion = this.lunarMansions.find(m => moonDegrees >= m.range[0] && moonDegrees < m.range[1]);
    return mansion || this.lunarMansions[0];
  }

  static degreesToSign(degrees: number) {
    return ZODIAC_SIGNS[Math.floor(degrees / 30)] + " " + (degrees % 30).toFixed(2) + "°";
  }

  static calculatePlanetaryHour() {
    const planets = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const planet = planets[(day + hour) % 7];
    return `${planet} Hour - Good for ${planet} activities`;
  }
}

// ============================================
// 3. DRUID/CELTIC TREE ASTROLOGY
// ============================================

class DruidAstrology {
  static treeCalendar = [
    { tree: "Birch", symbol: "Beth", range: [[12, 24], [1, 20]], traits: "Pioneer spirit, cleansing" },
    { tree: "Rowan", symbol: "Luis", range: [[1, 21], [2, 17]], traits: "Vision, spiritual insight" },
    { tree: "Ash", symbol: "Nion", range: [[2, 18], [3, 17]], traits: "Connection, perspective" },
    { tree: "Alder", symbol: "Fearn", range: [[3, 18], [4, 14]], traits: "Courage, passion" },
    { tree: "Willow", symbol: "Saille", range: [[4, 15], [5, 12]], traits: "Intuition, cycles" },
    { tree: "Hawthorn", symbol: "Uath", range: [[5, 13], [6, 9]], traits: "Sacred union, protection" },
    { tree: "Oak", symbol: "Duir", range: [[6, 10], [7, 7]], traits: "Wisdom, endurance" },
    { tree: "Holly", symbol: "Tinne", range: [[7, 8], [8, 4]], traits: "Balance, warrior spirit" },
    { tree: "Hazel", symbol: "Coll", range: [[8, 5], [9, 1]], traits: "Wisdom, inspiration" },
    { tree: "Vine", symbol: "Muin", range: [[9, 2], [9, 29]], traits: "Transformation, depth" },
    { tree: "Ivy", symbol: "Gort", range: [[9, 30], [10, 27]], traits: "Resilience, growth" },
    { tree: "Reed", symbol: "Ngetal", range: [[10, 28], [11, 24]], traits: "Truth, clarity" },
    { tree: "Elder", symbol: "Ruis", range: [[11, 25], [12, 23]], traits: "Regeneration, release" }
  ];

  static getTreeSign(birthDate: string) {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const found = this.treeCalendar.find(t => {
      const [[sm, sd], [em, ed]] = t.range;
      if (sm === em) return month === sm && day >= sd && day <= ed;
      return (month === sm && day >= sd) || (month === em && day <= ed);
    });
    return found || { tree: "Reed", traits: "Truth", symbol: "Ngetal" };
  }

  static getTotemAnimal(treeName: string) {
    const totems: Record<string, string> = {
      "Birch": "White Stag", "Rowan": "Dragon", "Ash": "Serpent", "Alder": "Raven",
      "Willow": "Hare", "Hawthorn": "Bee", "Oak": "White Horse", "Holly": "Unicorn",
      "Hazel": "Salmon", "Vine": "Swan", "Ivy": "Boar", "Reed": "Owl", "Elder": "Raven"
    };
    return totems[treeName] || "Wild Stag";
  }

  static calculateMoonPhase(birthDate: string) {
    const date = new Date(birthDate);
    const knownNewMoon = new Date(2000, 0, 6);
    const diff = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const lunarMonth = 29.53;
    const phase = (diff % lunarMonth) / lunarMonth;
    if (phase < 0.125) return "New Moon - Initiator";
    if (phase < 0.25) return "Waxing Crescent - Builder";
    if (phase < 0.5) return "First Quarter - Action";
    if (phase < 0.625) return "Full Moon - Realization";
    return "Waning - Releasing";
  }
}

// ============================================
// 4. MAYAN/AZTEC ASTROLOGY
// ============================================

class MayanAstrology {
  static dayNames = ["Imix", "Ik", "Akbal", "Kan", "Chicchan", "Cimi", "Manik", "Lamat", "Muluc", "Oc", "Chuen", "Eb", "Ben", "Ix", "Men", "Cib", "Caban", "Etznab", "Cauac", "Ahau"];
  static tones = ["Unity", "Polarity", "Rhythm", "Measure", "Radiance", "Organic", "Resonant", "Galactic", "Solar", "Planetary", "Spectral", "Crystal", "Cosmic"];

  static calculateTzolkin(birthDate: string) {
    const date = new Date(birthDate);
    const gregorianToMayan = 584283;
    const jd = date.getTime() / 86400000 + 2440587.5;
    const mayanDay = Math.floor(jd - gregorianToMayan);
    const pos = mayanDay % 260;
    return {
      daySign: this.dayNames[pos % 20],
      tone: this.tones[pos % 13],
      kin: pos + 1
    };
  }

  static calculateLongCount(birthDate: string) {
    const date = new Date(birthDate);
    const jd = date.getTime() / 86400000 + 2440587.5;
    const mayanDay = Math.floor(jd - 584283);
    const baktun = Math.floor(mayanDay / 144000);
    const katun = Math.floor((mayanDay % 144000) / 7200);
    const tun = Math.floor((mayanDay % 7200) / 360);
    const uinal = Math.floor((mayanDay % 360) / 20);
    const kin = mayanDay % 20;
    return `${baktun}.${katun}.${tun}.${uinal}.${kin}`;
  }
}

export function calculateAstrology(userData: UserData): AstrologyData {
  const { name, birthDate, birthTime } = userData;
  let completion = 0;
  if (name) completion += 20;
  if (birthDate) completion += 40;
  if (birthTime) completion += 40;

  const planets: PlanetPosition[] = [];
  const houses: HousePosition[] = [];

  if (birthDate) {
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const getSign = (offset: number) => ZODIAC_SIGNS[(dayOfYear + offset) % 12];
    
    planets.push({ name: "Sun", sign: getSign(0), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Sun });
    planets.push({ name: "Moon", sign: getSign(Math.floor(dayOfYear / 2.5)), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Moon });
    planets.push({ name: "Mercury", sign: getSign(1), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Mercury });
    planets.push({ name: "Venus", sign: getSign(2), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Venus });
    planets.push({ name: "Mars", sign: getSign(3), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Mars });
    planets.push({ name: "Jupiter", sign: getSign(5), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Jupiter });
    planets.push({ name: "Saturn", sign: getSign(7), degree: (dayOfYear % 30), glyph: PLANET_GLYPHS.Saturn });
  }

  if (birthTime) {
    const [hours, minutes] = birthTime.split(':').map(Number);
    const ascIndex = (hours + Math.floor(minutes / 5)) % 12;
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        sign: ZODIAC_SIGNS[(ascIndex + i - 1) % 12],
        meaning: getHouseMeaning(i)
      });
    }
    planets.forEach((p, idx) => { p.house = ((idx + ascIndex) % 12) + 1; });
  }

  const sunDegrees = planets.find(p => p.name === "Sun")?.degree || 0;
  const moonDegrees = planets.find(p => p.name === "Moon")?.degree || 0;
  const ascDegrees = houses[0] ? ZODIAC_SIGNS.indexOf(houses[0].sign) * 30 : 0;

  const traditions = birthDate ? {
    vedic: {
      nakshatra: VedicAstrology.calculateNakshatra(moonDegrees),
      rashi: VedicAstrology.calculateRashi(sunDegrees),
      dashas: VedicAstrology.calculateDasha(VedicAstrology.calculateNakshatra(moonDegrees).lord, birthDate)
    },
    arabian: {
      partOfFortune: ArabianAstrology.calculateParts(sunDegrees, moonDegrees, ascDegrees).partOfFortune,
      partOfSpirit: ArabianAstrology.calculateParts(sunDegrees, moonDegrees, ascDegrees).partOfSpirit,
      lunarMansion: ArabianAstrology.calculateLunarMansion(moonDegrees),
      planetaryHour: ArabianAstrology.calculatePlanetaryHour()
    },
    druid: {
      tree: DruidAstrology.getTreeSign(birthDate).tree,
      symbol: DruidAstrology.getTreeSign(birthDate).symbol,
      traits: DruidAstrology.getTreeSign(birthDate).traits,
      totem: DruidAstrology.getTotemAnimal(DruidAstrology.getTreeSign(birthDate).tree),
      ogham: DruidAstrology.getTreeSign(birthDate).symbol,
      moonPhase: DruidAstrology.calculateMoonPhase(birthDate)
    },
    mayan: {
      daySign: MayanAstrology.calculateTzolkin(birthDate).daySign,
      tone: MayanAstrology.calculateTzolkin(birthDate).tone,
      kin: MayanAstrology.calculateTzolkin(birthDate).kin,
      longCount: MayanAstrology.calculateLongCount(birthDate)
    }
  } : undefined;

  return {
    planets,
    houses,
    ascendant: houses[0]?.sign,
    completion,
    traditions
  };
}

function getHouseMeaning(h: number): string {
  const meanings: Record<number, string> = {
    1: "Self", 2: "Value", 3: "Communication", 4: "Home", 5: "Joy", 6: "Health",
    7: "Union", 8: "Change", 9: "Wisdom", 10: "Legacy", 11: "Aspiration", 12: "Karma"
  };
  return meanings[h] || "";
}

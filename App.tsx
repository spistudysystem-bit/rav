
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Cpu, Fingerprint, Shield, Terminal, 
  Sparkles, Trash2, Save, ChevronRight, Activity,
  Loader2, BookOpen, Lock, Scan, Book, Crosshair, 
  Send, Download, Share2, Archive, MessageSquare,
  TrendingUp, Database, Radio,
  LockKeyhole, CheckCircle2, Volume2, AudioLines, Info,
  Zap, Palette, Wifi, Battery, Clock, Layers
} from 'lucide-react';

import { 
  calculateLifePathGG33, getChineseZodiac,
  calculateDestinyNumber, 
  getVibrationalAxes,
  calculateLetterology,
  getLifePathInterpretation,
  getDestinyInterpretation,
  calculatePersonalYear,
  getCompatibilityScore,
  getPersonalYearInterpretation,
} from './services/numerologyService';
import { calculateKellySizing, getOracleDirective, getSystematicBiases } from './services/predictionService';
import { calculateAstrology } from './services/astrologyService';
import { 
  getNumerologyReading, 
  getDailyBriefing, 
  getTacticalRecommendations,
  chatWithHandler,
  getUniversalLawLecture,
  generateSpeech
} from './services/geminiService';
import { UNIVERSAL_LAWS } from './services/universalLaws';
import { UserData, GamificationState, VaultItem, DomainExpertise, LectureContent, ThemeType, ThemeConfig } from './types';
import { THEMES } from './constants';
import CustomCard from './components/CustomCard';

// --- Global Utilities ---
const cleanText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/#/g, "Number ")
    .replace(/\$/g, "Capital ")
    .replace(/%/g, " percent")
    .replace(/\*/g, "Directive Entry ");
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Visual Helpers ---

const StarfieldCanvas = ({ theme }: { theme: ThemeType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const starColor = theme === 'solana' ? '217, 182, 92' : theme === 'quantum' ? '34, 211, 238' : '255, 255, 255';
    
    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2, speed: Math.random() * 0.5 + 0.1 });
    }
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        const alpha = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(${starColor}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize); };
  }, [theme]);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

const ScrambleText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let iteration = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        const letters = text.split('');
        const newText = letters.map((char, idx) => {
          if (idx < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        setDisplayText(newText);
        iteration += 1 / 3;
        if (iteration >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <span>{displayText}</span>;
};

const DecryptText = ({ text }: { text: string }) => {
  const [visibleChars, setVisibleChars] = useState(0);
  useEffect(() => {
    if (!text) return;
    const interval = setInterval(() => {
      setVisibleChars(prev => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const display = text.split('').map((char, i) => {
    if (i < visibleChars) return char;
    if (i < visibleChars + 10 && char !== ' ' && char !== '\n') return chars[Math.floor(Math.random() * chars.length)];
    return '';
  }).join('');

  return <span className="whitespace-pre-line">{display}</span>;
};

// --- Terminal Boot ---

const TerminalBoot = ({ onComplete }: { onComplete: () => void; key?: string }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const bootLines = [
    "> BIOS VERSION 7.2.0.18",
    "> RAM CHECK: 64GB OK",
    "> CPU CORE CALIBRATION: ACTIVE",
    "> MOUNTING VIBRATIONAL DATASETS...",
    "> UPLINKING TO GG33 CORE NODES...",
    "> INITIALIZING HOUSE OF RAV INTERFACE...",
    "> BYPASSING MATRIX FIREWALL...",
    "> SYSTEM READY. ACCESSING HANDLER Dossier..."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine >= bootLines.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      setLogs(prev => [...prev, bootLines[currentLine]]);
      currentLine++;
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[1000] bg-black p-10 font-mono text-green-500 text-sm overflow-hidden"
    >
      <div className="max-w-xl mx-auto space-y-2">
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{log}</motion.div>
        ))}
        <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-2 h-4 bg-green-500 inline-block align-middle" />
      </div>
    </motion.div>
  );
};

// --- Biometric Intro ---

const CinematicIntro = ({ onComplete, theme }: { onComplete: () => void; theme: ThemeType; key?: string }) => {
  const [stage, setStage] = useState(0);
  const t = THEMES[theme];
  const logs = [
    "INITIALIZING CORE PROTOCOLS...",
    "ACCESSING SECURE NODES...",
    "BYPASSING MATRIX FIREWALL...",
    "CALIBRATING VIBRATIONAL SENSORS...",
    "SUBJECT SIGNATURE DETECTED...",
    "ESTABLISHING UPLINK...",
    "SYSTEM STABLE. ACCESS GRANTED."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(s => {
        if (s >= logs.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1200);
          return s;
        }
        return s + 1;
      });
    }, 450);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.2, filter: "blur(40px)" }} className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      <StarfieldCanvas theme={theme} />
      <motion.div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
        <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }} className={`absolute inset-0 border-2 rounded-full ${t.accent} ${t.glow}`} />
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }} className={`relative z-10 ${t.primary} flex flex-col items-center`}>
          <Fingerprint size={120} className="mb-6 drop-shadow-[0_0_20px_currentColor]" />
          <span className="font-tech text-[10px] tracking-[0.8em] uppercase opacity-80">Biometric Syncing</span>
        </motion.div>
      </motion.div>
      <div className={`mt-16 w-full max-w-sm bg-black/80 backdrop-blur-xl p-6 border ${t.border} rounded-2xl font-mono text-[10px] md:text-xs ${t.primary} shadow-3xl`}>
        <AnimatePresence mode="popLayout">
          <motion.div key={stage} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex items-center gap-4 mb-2">
            <span className="opacity-40 font-bold">[{new Date().getMilliseconds()}]</span>
            <span className="font-tech tracking-wider">{logs[stage]}</span>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center gap-4">
           <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: "0%" }} animate={{ width: `${((stage + 1) / logs.length) * 100}%` }} className={`h-full ${t.secondary}`} />
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const NoahChassis = ({ isThinking, isSpeaking, isSynthesizing, theme }: any) => {
  const t = THEMES[theme as ThemeType];
  return (
    <motion.div className="relative flex flex-col items-center justify-center py-6 w-full max-w-[280px] md:max-w-md h-[320px] md:h-[480px]">
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 flex flex-col items-center w-full">
        <div className={`w-36 md:w-56 h-8 md:h-12 rounded-t-[3rem] border-2 ${t.accent} bg-slate-900/95`} />
        <div className={`w-56 md:w-80 h-48 md:h-64 border-2 ${t.accent} bg-black/98 flex flex-col items-center justify-center relative shadow-[inset_0_0_60px_rgba(0,0,0,1)] rounded-3xl overflow-hidden backdrop-blur-xl`}>
           <motion.div animate={isSpeaking || isSynthesizing ? { scale: [1, 1.08, 0.95, 1.04, 1] } : { opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 0.4, repeat: Infinity }} className={`w-20 md:w-32 h-20 md:h-32 rounded-full ${t.bg} flex items-center justify-center border ${t.border}`}>
             <div className="flex items-center gap-2 h-10 md:h-16">
               {[...Array(8)].map((_, i) => (
                 <motion.div key={i} animate={isSpeaking || isThinking || isSynthesizing ? { height: [4, 40, 4] } : { height: 6 }} transition={{ duration: 0.15, repeat: Infinity, delay: i * 0.04 }} className={`w-1 md:w-1.5 rounded-full ${t.secondary} ${t.glow}`} />
               ))}
             </div>
           </motion.div>
           {isSynthesizing && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute bottom-4 text-[8px] font-tech ${t.primary} uppercase animate-pulse`}>Voice Synthesis...</motion.div>}
        </div>
        <div className={`w-36 md:w-56 h-8 md:h-12 rounded-b-[3rem] border-2 ${t.accent} bg-slate-900/95 shadow-2xl`} />
      </motion.div>
    </motion.div>
  );
};

// --- Main Components ---

const RevealOnScroll = ({ children }: { children?: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "circOut" }} className="w-full flex flex-col items-center">{children}</motion.div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'boot' | 'landing' | 'intro' | 'mission-control'>('boot');
  const [theme, setTheme] = useState<ThemeType>('solana');
  const [isSyncing, setIsSyncing] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', birthDate: '', birthTime: '', birthPlace: '', focusYear: new Date().getFullYear() });
  const [isThinking, setIsThinking] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [gamification, setGamification] = useState<GamificationState>({ xp: 0, level: 1, tokens: 10, streak: 1, lastActive: Date.now(), badges: [], quests: [], expertise: [] });
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [showVault, setShowVault] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAstrology, setShowAstrology] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [partnerData, setPartnerData] = useState({ name: '', birthDate: '' });
  const [focusYear, setFocusYear] = useState(new Date().getFullYear());
  const [showSuccessToast, setShowSuccessToast] = useState<{ message: string, xp?: number } | null>(null);
  const [briefingText, setBriefingText] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'handler', content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [prediction, setPrediction] = useState({ domain: 'Finance', reasoning: '', marketPrice: 0.5, modelEstimate: 0.5 });
  const [activeLaw, setActiveLaw] = useState<LectureContent | null>(null);
  const [isLoadingLaw, setIsLoadingLaw] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = THEMES[theme];

  useEffect(() => {
    const savedSubject = localStorage.getItem('house_of_rav_subject_node');
    const savedVault = localStorage.getItem('house_of_rav_vault');
    const savedTheme = localStorage.getItem('house_of_rav_theme');

    if (savedSubject) setUserData(JSON.parse(savedSubject));
    if (savedVault) setVault(JSON.parse(savedVault));
    if (savedTheme) setTheme(savedTheme as ThemeType);
  }, []);

  useEffect(() => {
    localStorage.setItem('house_of_rav_theme', theme);
  }, [theme]);

  const fullAnalysis = useMemo(() => {
    const trimmedName = userData.name.trim();
    if (!trimmedName) return null;
    const lp = userData.birthDate ? calculateLifePathGG33(userData.birthDate) : { value: 0, method: '0 + 0 + 0' };
    const destinyNum = calculateDestinyNumber(trimmedName);
    const zodiac = userData.birthDate ? getChineseZodiac(new Date(userData.birthDate).getUTCFullYear()) : null;
    const astrology = userData.birthDate ? calculateAstrology(userData) : null;
    const personalYear = userData.birthDate ? calculatePersonalYear(userData.birthDate, focusYear) : 0;
    
    return {
      lp,
      zodiac,
      destiny: destinyNum,
      letterology: calculateLetterology(trimmedName),
      interpretation: getLifePathInterpretation(lp.value),
      destinyInterpretation: getDestinyInterpretation(destinyNum),
      personalYearInterpretation: getPersonalYearInterpretation(personalYear),
      astrology,
      personalYear
    };
  }, [userData, focusYear]);

  const triggerToast = (message: string, xp?: number) => {
    setShowSuccessToast({ message: cleanText(message), xp });
    if (xp) setGamification(prev => ({ ...prev, xp: prev.xp + xp, level: Math.floor((prev.xp + xp) / 1000) + 1 }));
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const handleEngage = async () => {
    if (!userData.name.trim()) return triggerToast("IDENTIFIER REQUIRED");
    setIsThinking(true);
    try {
      const lp = fullAnalysis?.lp?.value || 0;
      const zodiac = fullAnalysis?.zodiac?.animal || 'Rat';
      const res = await getNumerologyReading("Detailed Tactical Synthesis", userData, lp, zodiac);
      setReading(cleanText(res.text));
      const recs = await getTacticalRecommendations(userData, lp, [], vault);
      setRecommendations(recs);
      triggerToast("ANALYSIS COMPLETE", 50);
    } catch (e) { triggerToast("UPLINK FAILURE"); }
    finally { setIsThinking(false); }
  };

  const narrate = async (text: string) => {
    if (isSynthesizing) return;
    if (activeSourceRef.current) {
        activeSourceRef.current.stop();
        activeSourceRef.current = null;
        setIsSynthesizing(false);
        return;
    }
    setIsSynthesizing(true);
    try {
      const base64Audio = await generateSpeech(text);
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => { setIsSynthesizing(false); activeSourceRef.current = null; };
      source.start();
      activeSourceRef.current = source;
    } catch (e) { triggerToast("NARRATION ERROR"); setIsSynthesizing(false); }
  };

  const toggleTheme = () => {
    const sequence: ThemeType[] = ['solana', 'quantum', 'stealth'];
    const next = sequence[(sequence.indexOf(theme) + 1) % sequence.length];
    setTheme(next);
  };

  const handleBriefing = async () => {
    if (briefingText) {
      setShowBriefing(true);
      return;
    }
    setIsThinking(true);
    try {
      const res = await getDailyBriefing(userData, fullAnalysis?.lp?.value || 0);
      setBriefingText(cleanText(res));
      setShowBriefing(true);
      triggerToast("BRIEFING DECRYPTED", 25);
    } catch (e) { triggerToast("BRIEFING ERROR"); }
    finally { setIsThinking(false); }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsThinking(true);
    try {
      const res = await chatWithHandler(chatMessages, userMsg);
      setChatMessages(prev => [...prev, { role: 'handler', content: cleanText(res) }]);
    } catch (e) { triggerToast("CHAT ERROR"); }
    finally { setIsThinking(false); }
  };

  const handleLawLecture = async (law: any) => {
    setIsLoadingLaw(true);
    try {
      const res = await getUniversalLawLecture(law.name, law.category, law.summary);
      setActiveLaw(res);
      triggerToast("LECTURE GENERATED", 40);
    } catch (e) { triggerToast("LECTURE ERROR"); }
    finally { setIsLoadingLaw(false); }
  };

  const handlePrediction = () => {
    const edge = prediction.modelEstimate - prediction.marketPrice;
    const sizing = calculateKellySizing(prediction.modelEstimate, prediction.marketPrice);
    const directive = getOracleDirective(edge);
    
    const newRecord: VaultItem = {
      id: Math.random().toString(),
      type: 'prediction',
      title: `Oracle: ${prediction.domain}`,
      content: `Edge: ${(edge * 100).toFixed(2)}% | Sizing: ${(sizing * 100).toFixed(2)}% | Directive: ${directive.message}`,
      timestamp: Date.now(),
      metadata: { ...prediction, edge, sizing, directive }
    };
    
    setVault(v => [newRecord, ...v]);
    triggerToast("ORACLE DATA ARCHIVED", 30);
  };

  const partnerAnalysis = useMemo(() => {
    if (!partnerData.birthDate) return null;
    const lp = calculateLifePathGG33(partnerData.birthDate);
    const compatibility = fullAnalysis ? getCompatibilityScore(fullAnalysis.lp.value, lp.value) : null;
    return { lp, compatibility };
  }, [partnerData, fullAnalysis]);

  return (
    <div className={`min-h-screen bg-black text-slate-200 selection:bg-white/20 transition-colors duration-1000`}>
      <AnimatePresence mode="wait">
        {currentPage === 'boot' && <TerminalBoot key="boot" onComplete={() => setCurrentPage('landing')} />}
        {currentPage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -100 }} transition={{ duration: 1.2 }} className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
            <StarfieldCanvas theme={theme} />
            <div className="relative z-20 text-center w-full max-w-4xl">
              <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 45 }} className={`mb-8 md:mb-16 flex justify-center`}>
                <div className={`w-24 md:w-40 h-24 md:h-40 border-4 ${t.primary} animate-pulse flex items-center justify-center ${t.glow} ${t.bg} rounded-lg`}>
                  <Sparkles className="w-12 md:w-20 h-12 md:h-20 -rotate-45" />
                </div>
              </motion.div>
              <h1 className={`font-tech text-6xl md:text-[10rem] mb-6 ${t.primary} drop-shadow-[0_0_50px_currentColor] leading-none tracking-tighter`}>
                <ScrambleText text="HOUSE OF RAV" delay={800} />
              </h1>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('intro')} className={`px-12 md:px-24 py-8 border-2 ${t.primary} ${t.primary} uppercase font-tech bg-black/60 backdrop-blur-2xl text-xl tracking-[0.4em] shadow-2xl relative group overflow-hidden`}>
                <span className="relative z-10 flex items-center gap-6"><LockKeyhole size={24} /> Establish Uplink</span>
                <div className={`absolute inset-0 ${t.bg} -translate-x-full group-hover:translate-x-0 transition-transform duration-500`} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentPage === 'intro' && <CinematicIntro key="intro" theme={theme} onComplete={() => setCurrentPage('mission-control')} />}

        {currentPage === 'mission-control' && (
          <motion.div key="mission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
            <StarfieldCanvas theme={theme} />
            
            {/* HUD Status Bar */}
            <div className={`fixed top-0 inset-x-0 z-[110] p-2 flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.3em] bg-black/40 border-b ${t.border} backdrop-blur-md opacity-60`}>
              <div className="flex gap-6 px-4">
                 <span className="flex items-center gap-1"><Wifi size={10} /> Uplink: High</span>
                 <span className="flex items-center gap-1"><Battery size={10} /> Core: Stable</span>
                 <span className="flex items-center gap-1"><Shield size={10} /> LVL {gamification.level}</span>
              </div>
              <div className="flex-1 max-w-xs px-4">
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${t.secondary}`} style={{ width: `${(gamification.xp % 1000) / 10}%` }} />
                 </div>
              </div>
              <div className="flex gap-6 px-4">
                 <span className="flex items-center gap-1"><Clock size={10} /> {new Date().toLocaleTimeString()}</span>
                 <span className="flex items-center gap-1"><Cpu size={10} /> GG33 Node: Active</span>
              </div>
            </div>

            <header className="hidden md:flex fixed top-8 inset-x-0 z-[100] p-8 justify-between items-center backdrop-blur-3xl bg-black/80 border-b ${t.accent}">
              <div className="flex items-center gap-6">
                <div className={`p-4 ${t.bg} rounded-full border ${t.accent}`}>
                  <Shield className={t.primary} size={28} />
                </div>
                <h1 className={`font-tech ${t.primary} tracking-[0.5em] text-2xl uppercase font-black`}>MISSION CONTROL</h1>
              </div>
              <div className="flex gap-4">
                <HUDButton icon={TrendingUp} onClick={() => setShowOracle(true)} label="Oracle" theme={theme} />
                <HUDButton icon={Book} onClick={() => setShowCodex(true)} label="Codex" theme={theme} />
                <HUDButton icon={Activity} onClick={handleBriefing} label="Briefing" theme={theme} />
                <HUDButton icon={Share2} onClick={() => setShowCompatibility(true)} label="Sync" theme={theme} />
                <HUDButton icon={MessageSquare} onClick={() => setShowChat(true)} label="Handler" theme={theme} />
                <HUDButton icon={Palette} onClick={toggleTheme} theme={theme} />
                <HUDButton icon={Database} onClick={() => setShowAstrology(true)} label="Astro" theme={theme} />
                <HUDButton icon={BookOpen} onClick={() => setShowVault(true)} count={vault.length} theme={theme} />
              </div>
            </header>

            <main className="relative z-10 pt-40 pb-40 max-w-7xl mx-auto px-8 flex flex-col items-center gap-20">
              <NoahChassis isThinking={isThinking} isSpeaking={!!reading} isSynthesizing={isSynthesizing} theme={theme} />
              
              <RevealOnScroll>
                <CustomCard 
                  themeConfig={t} 
                  variant="glass" 
                  showEnergyLine 
                  className="w-full max-w-5xl"
                >
                  <div className="space-y-10">
                    <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em] ml-3 font-black">Identifier Signature</label>
                    <input type="text" placeholder="ENTER NAME NODE" className={`w-full bg-black/70 border ${t.border} p-10 rounded-[3rem] text-4xl md:text-6xl font-tech text-white uppercase focus:${t.primary} outline-none transition-all placeholder:opacity-5 tracking-[0.3em] text-center`} value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em] ml-3 font-black">Temporal Origin</label>
                      <input type="date" className={`w-full bg-black/70 border ${t.border} p-8 rounded-[2rem] text-white outline-none font-tech text-xl text-center`} value={userData.birthDate} onChange={e => setUserData({ ...userData, birthDate: e.target.value })} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em] ml-3 font-black">Temporal Moment</label>
                      <input type="time" className={`w-full bg-black/70 border ${t.border} p-8 rounded-[2rem] text-white outline-none font-tech text-xl text-center`} value={userData.birthTime} onChange={e => setUserData({ ...userData, birthTime: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em] ml-3 font-black">Geospatial Origin</label>
                      <input type="text" placeholder="CITY, COUNTRY" className={`w-full bg-black/70 border ${t.border} p-8 rounded-[2rem] text-white outline-none font-tech text-xl text-center uppercase`} value={userData.birthPlace} onChange={e => setUserData({ ...userData, birthPlace: e.target.value })} />
                    </div>
                    <div className="flex items-end">
                      <button onClick={handleEngage} disabled={isThinking || !userData.name.trim()} className={`w-full h-20 ${t.secondary} text-black font-tech rounded-[2rem] uppercase tracking-[0.3em] font-black disabled:opacity-20 flex items-center justify-center gap-6 hover:brightness-125 transition-all shadow-2xl text-xl group relative overflow-hidden`}>
                        <span className="relative z-10 flex items-center gap-6">{isThinking ? <Loader2 className="animate-spin" size={32} /> : <Scan size={36} />} Synchronize Node</span>
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                      </button>
                    </div>
                  </div>
                </CustomCard>
              </RevealOnScroll>

              {fullAnalysis && (
                <div className="w-full flex flex-col gap-20">
                  {/* Life Path Matrix */}
                  <RevealOnScroll>
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <CustomCard themeConfig={t} className="lg:col-span-8">
                        <div className={`flex flex-col md:flex-row items-center gap-10 mb-12 border-b ${t.border} pb-10`}>
                          <div className={`w-32 h-32 md:w-48 rounded-full border-4 ${t.accent} flex items-center justify-center ${t.bg} ${t.glow} group`}>
                            <span className={`font-tech text-6xl md:text-8xl ${t.primary}`}>{fullAnalysis.lp.value}</span>
                          </div>
                          <div className="text-center md:text-left space-y-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="font-tech text-3xl md:text-5xl text-white uppercase tracking-tighter">{fullAnalysis.interpretation?.title || "Node Unknown"}</h2>
                                <div className="flex gap-4 mt-2">
                                  <span className={`px-4 py-2 ${t.bg} border ${t.accent} rounded-full text-[10px] font-tech ${t.primary} uppercase`}>{fullAnalysis.interpretation?.archetype}</span>
                                  <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-tech text-slate-400 uppercase">Life Path Node</span>
                                </div>
                              </div>
                              <HUDActionIcon 
                                icon={Volume2} 
                                activeIcon={AudioLines} 
                                active={isSynthesizing} 
                                onClick={() => narrate(`Life Path Analysis for ${fullAnalysis.interpretation?.title}. Objective: ${fullAnalysis.interpretation?.objective}. Blueprint: ${fullAnalysis.interpretation?.blueprint}. Archetype: ${fullAnalysis.interpretation?.archetype}. Shadow: ${fullAnalysis.interpretation?.shadow}.`)} 
                                theme={theme}
                                small
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <HUDDataField label="Core Objective" content={fullAnalysis.interpretation?.objective} theme={theme} />
                           <HUDDataField label="Strategic Blueprint" content={fullAnalysis.interpretation?.blueprint} theme={theme} />
                        </div>
                      </CustomCard>
                      <div className="lg:col-span-4 flex flex-col gap-10">
                         <CustomCard 
                            themeConfig={t} 
                            variant="compact" 
                            className="border-red-500/20"
                            title={<h4 className="flex items-center gap-3 font-tech text-red-500 uppercase text-[10px] tracking-widest"><Lock size={12} /> Shadow Cycle</h4>}
                         >
                            <p className="text-sm font-serif italic text-slate-400 leading-relaxed">{fullAnalysis.interpretation?.shadow}</p>
                         </CustomCard>
                         <div className={`flex-1 p-10 rounded-[3rem] bg-gradient-to-br from-current to-transparent ${t.primary} border ${t.border} flex flex-col justify-center items-center text-center opacity-80`}>
                            <span className="font-tech text-7xl text-white tracking-tighter">98<span className="text-2xl opacity-50">%</span></span>
                            <p className="text-[10px] font-tech uppercase tracking-widest mt-2">Alignment</p>
                         </div>
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Destiny Matrix */}
                  <RevealOnScroll>
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-4 flex flex-col gap-10">
                        <div className={`flex-1 p-10 rounded-[3.5rem] bg-gradient-to-tr from-cyan-950/40 to-slate-900/40 border border-cyan-500/20 shadow-4xl backdrop-blur-3xl flex flex-col justify-center items-center text-center relative overflow-hidden group`}>
                          <div className="w-20 h-20 rounded-2xl border-2 border-cyan-500/30 flex items-center justify-center bg-cyan-500/5 mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                             <Zap size={32} className="text-cyan-400 animate-pulse" />
                          </div>
                          <h3 className="font-tech text-cyan-400 uppercase tracking-widest text-[9px] mb-2">Destiny Frequency</h3>
                          <div className="text-7xl font-tech text-white mb-2">{fullAnalysis.destiny}</div>
                        </div>
                        <div className={`p-8 rounded-[3rem] bg-black/60 border border-cyan-500/10 shadow-3xl`}>
                          <h4 className="flex items-center gap-3 font-tech text-cyan-500 uppercase text-[9px] tracking-widest mb-4"><Info size={12} /> Identity Shadow</h4>
                          <p className="text-xs font-serif italic text-slate-400 leading-relaxed">{fullAnalysis.destinyInterpretation?.shadow}</p>
                        </div>
                      </div>
                      <div className={`lg:col-span-8 p-12 rounded-[4rem] bg-slate-900/60 border border-cyan-500/20 shadow-4xl backdrop-blur-3xl relative overflow-hidden`}>
                        <div className="mb-10 border-b border-white/10 pb-8 flex justify-between items-start">
                           <div>
                              <h3 className="font-tech text-cyan-400 text-[10px] uppercase tracking-[0.5em] mb-3">Destiny Alignment Breakdown</h3>
                              <h2 className="font-tech text-3xl md:text-5xl text-white uppercase tracking-tighter">{fullAnalysis.destinyInterpretation?.title}</h2>
                           </div>
                           <HUDActionIcon 
                              icon={Volume2} 
                              activeIcon={AudioLines} 
                              active={isSynthesizing} 
                              onClick={() => narrate(`Destiny Frequency ${fullAnalysis.destiny}: ${fullAnalysis.destinyInterpretation?.title}. Core Purpose: ${fullAnalysis.destinyInterpretation?.objective}. Vibrational Blueprint: ${fullAnalysis.destinyInterpretation?.blueprint}. Potential: ${fullAnalysis.destinyInterpretation?.potential}. Shadow: ${fullAnalysis.destinyInterpretation?.shadow}.`)} 
                              theme={theme}
                              small
                           />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <HUDDataField label="Core Purpose" content={fullAnalysis.destinyInterpretation?.objective} theme={theme} colorClass="text-cyan-400" />
                          <HUDDataField label="Identity Blueprint" content={fullAnalysis.destinyInterpretation?.blueprint} theme={theme} colorClass="text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Personality Deep Dive Matrix */}
                  <RevealOnScroll>
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <CustomCard 
                        themeConfig={t} 
                        title="Personality Architecture"
                        description="Deep-dive into core vibrational traits and potential."
                      >
                        <div className="space-y-8">
                          <div className="grid grid-cols-2 gap-6">
                            <HUDDataField label="Archetype" content={fullAnalysis.interpretation?.archetype} theme={theme} />
                            <HUDDataField label="Personal Year" content={fullAnalysis.personalYear.toString()} theme={theme} />
                          </div>
                          <div className="space-y-4">
                            <h4 className={`text-[10px] font-tech ${t.primary} uppercase tracking-widest`}>Potential Matrix</h4>
                            <p className="text-sm font-serif italic text-slate-300 leading-relaxed">{fullAnalysis.interpretation?.potential}</p>
                          </div>
                          <div className="pt-6 border-t border-white/10">
                            <h4 className={`text-[10px] font-tech ${t.primary} uppercase tracking-widest mb-4`}>Vibrational Strengths</h4>
                            <div className="flex flex-wrap gap-3">
                              {fullAnalysis.interpretation?.title.split(' ').map((word, i) => (
                                <span key={i} className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-tech text-slate-400 uppercase`}>{word}</span>
                              ))}
                              <span className={`px-3 py-1 ${t.bg} border ${t.accent} rounded-lg text-[9px] font-tech ${t.primary} uppercase`}>Resonance: {fullAnalysis.lp.value}</span>
                            </div>
                          </div>
                        </div>
                      </CustomCard>

                      <CustomCard 
                        themeConfig={t} 
                        title="Shadow Work Directive"
                        description="Identifying and transmuting lower vibrational frequencies."
                        className="border-red-500/20"
                      >
                        <div className="space-y-8">
                          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                            <p className="text-sm font-serif italic text-red-200/70 leading-relaxed">
                              {fullAnalysis.interpretation?.shadow}
                            </p>
                          </div>
                          <div className="space-y-4">
                            <h4 className={`text-[10px] font-tech text-red-500 uppercase tracking-widest`}>Transmutation Strategy</h4>
                            <p className="text-xs font-serif italic text-slate-400 leading-relaxed">
                              Focus on the {fullAnalysis.lp.value} frequency to overcome {fullAnalysis.interpretation?.archetype.toLowerCase()} tendencies. Use the {fullAnalysis.zodiac?.animal}'s {fullAnalysis.zodiac?.yinYang.toLowerCase()} energy to balance your {fullAnalysis.interpretation?.title.toLowerCase()} nature.
                            </p>
                          </div>
                        </div>
                      </CustomCard>
                    </div>
                  </RevealOnScroll>

                  {/* Temporal Resonance Matrix */}
                  <RevealOnScroll>
                    <div className="w-full max-w-6xl">
                      <CustomCard 
                        themeConfig={t} 
                        title="Temporal Resonance Matrix"
                        description="Vibrational analysis of the current focus year."
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                          <div className="md:col-span-4 space-y-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Focus Year</label>
                              <div className="flex gap-4">
                                <input 
                                  type="number" 
                                  className={`flex-1 bg-black/60 border ${t.border} p-4 rounded-xl text-white outline-none font-tech`}
                                  value={focusYear}
                                  onChange={e => setFocusYear(parseInt(e.target.value) || new Date().getFullYear())}
                                />
                                <button 
                                  onClick={() => setFocusYear(new Date().getFullYear())}
                                  className={`px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-tech text-slate-400 uppercase hover:bg-white/10`}
                                >
                                  Reset
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center py-6 bg-white/5 rounded-[2rem] border border-white/10">
                               <span className={`text-6xl font-tech ${t.primary}`}>{fullAnalysis.personalYear}</span>
                               <span className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] mt-2">Personal Year</span>
                            </div>
                          </div>
                          <div className="md:col-span-8 space-y-8">
                            <div className="space-y-4">
                               <h3 className={`text-2xl font-tech text-white uppercase`}>{fullAnalysis.personalYearInterpretation?.title}</h3>
                               <p className="text-lg font-serif italic text-slate-300 leading-relaxed">
                                 {fullAnalysis.personalYearInterpretation?.theme}
                               </p>
                            </div>
                            <div className={`p-6 bg-white/5 border-l-4 ${t.border} rounded-r-2xl`}>
                               <h4 className={`text-[10px] font-tech ${t.primary} uppercase tracking-widest mb-2`}>Strategic Directive</h4>
                               <p className="text-sm font-serif italic text-slate-400">
                                 {fullAnalysis.personalYearInterpretation?.advice}
                               </p>
                            </div>
                          </div>
                        </div>
                      </CustomCard>
                    </div>
                  </RevealOnScroll>

                  {/* Letterology Matrix */}
                  {fullAnalysis.letterology && (
                    <RevealOnScroll>
                      <CustomCard 
                        themeConfig={t} 
                        className="w-full max-w-6xl border-indigo-500/20"
                        title={
                          <div className="flex justify-between items-start w-full">
                             <div>
                                <h3 className="font-tech text-indigo-400 text-[10px] uppercase tracking-[0.5em] mb-3">Letterology & Gematria</h3>
                                <h2 className="font-tech text-3xl md:text-5xl text-white uppercase tracking-tighter">Onomastic Analysis</h2>
                             </div>
                             <HUDActionIcon 
                                icon={Volume2} 
                                activeIcon={AudioLines} 
                                active={isSynthesizing} 
                                onClick={() => narrate(`Onomastic analysis for ${userData.name}. Pythagorean Expression: ${fullAnalysis.letterology.pythagorean.expression.number}. Chaldean Compound: ${fullAnalysis.letterology.chaldean.compound}. Kabbalah Gematria: ${fullAnalysis.letterology.kabbalah.gematria}. Dominant Element: ${fullAnalysis.letterology.stats.dominantElement.name}.`)} 
                                theme={theme}
                                small
                             />
                          </div>
                        }
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                           <div className="space-y-8">
                              <HUDDataField label="Pythagorean Expression" content={`${fullAnalysis.letterology.pythagorean.expression.number} - ${fullAnalysis.letterology.pythagorean.expression.keyword}`} theme={theme} colorClass="text-indigo-400" />
                              <HUDDataField label="Soul Urge" content={`${fullAnalysis.letterology.pythagorean.soulUrge.number} - ${fullAnalysis.letterology.pythagorean.soulUrge.keyword}`} theme={theme} colorClass="text-indigo-400" />
                           </div>
                           <div className="space-y-8">
                              <HUDDataField label="Chaldean Resonance" content={`${fullAnalysis.letterology.chaldean.compound} - ${fullAnalysis.letterology.chaldean.meaning}`} theme={theme} colorClass="text-indigo-400" />
                              <HUDDataField label="Kabbalah Path" content={fullAnalysis.letterology.kabbalah.treePath.name} theme={theme} colorClass="text-indigo-400" />
                           </div>
                           <div className="space-y-8">
                              <HUDDataField label="Dominant Element" content={fullAnalysis.letterology.stats.dominantElement.interpretation} theme={theme} colorClass="text-indigo-400" />
                              <HUDDataField label="Archetype" content={fullAnalysis.letterology.onomastics.archetype} theme={theme} colorClass="text-indigo-400" />
                           </div>
                        </div>
                      </CustomCard>
                    </RevealOnScroll>
                  )}
                  {fullAnalysis.zodiac && (
                    <RevealOnScroll>
                      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <CustomCard 
                          themeConfig={t} 
                          className="lg:col-span-8"
                          title={
                            <div className="flex justify-between items-start w-full">
                               <div>
                                  <h3 className={`font-tech ${t.primary} text-[10px] uppercase tracking-[0.5em] mb-3`}>Chinese Zodiac Matrix</h3>
                                  <h2 className="font-tech text-3xl md:text-5xl text-white uppercase tracking-tighter">
                                    {fullAnalysis.zodiac.element} {fullAnalysis.zodiac.animal}
                                  </h2>
                                  <div className="mt-4 flex gap-4">
                                     <span className={`px-4 py-1.5 ${t.bg} border ${t.accent} rounded-full text-[9px] font-tech ${t.primary} uppercase`}>{fullAnalysis.zodiac.yinYang} Energy</span>
                                     <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-tech text-slate-400 uppercase">Zodiac Node</span>
                                  </div>
                               </div>
                               <HUDActionIcon 
                                  icon={Volume2} 
                                  activeIcon={AudioLines} 
                                  active={isSynthesizing} 
                                  onClick={() => narrate(`Zodiac Matrix identified as the ${fullAnalysis.zodiac?.element} ${fullAnalysis.zodiac?.animal}. Characterized as ${fullAnalysis.zodiac?.animalDescription} And the elemental signature: ${fullAnalysis.zodiac?.elementDescription}`)} 
                                  theme={theme}
                                  small
                               />
                            </div>
                          }
                        >
                          <div className={`absolute top-0 right-0 p-10 opacity-5 pointer-events-none`}>
                            <Layers size={300} className={t.primary} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                               <h4 className={`flex items-center gap-3 font-tech ${t.primary} opacity-60 uppercase text-[10px] tracking-widest`}><ChevronRight size={12} /> Animal Archetype</h4>
                               <p className="text-lg md:text-xl font-serif italic text-slate-100 leading-relaxed">
                                 {fullAnalysis.zodiac.animalDescription}
                               </p>
                            </div>
                            <div className="space-y-4">
                               <h4 className={`flex items-center gap-3 font-tech ${t.primary} opacity-60 uppercase text-[10px] tracking-widest`}><ChevronRight size={12} /> Elemental Signature</h4>
                               <p className="text-lg md:text-xl font-serif italic text-slate-100 leading-relaxed">
                                 {fullAnalysis.zodiac.elementDescription}
                               </p>
                            </div>
                          </div>
                        </CustomCard>
                        <div className="lg:col-span-4 flex flex-col gap-10">
                          <CustomCard 
                            themeConfig={t} 
                            variant="compact" 
                            className="flex-1 flex flex-col justify-center items-center text-center group"
                          >
                             <div className={`w-20 h-20 rounded-full border-2 ${t.accent} flex items-center justify-center mb-6`}>
                                <Activity size={32} className={`${t.primary} animate-pulse`} />
                             </div>
                             <h3 className={`font-tech ${t.primary} uppercase tracking-widest text-[9px] mb-4`}>Vibrational Resonance</h3>
                             <div className="w-full space-y-4">
                               {['Instinct', 'Logic', 'Intuition'].map((trait, i) => (
                                 <div key={trait} className="space-y-1.5">
                                   <div className="flex justify-between text-[8px] font-tech text-slate-500 uppercase tracking-widest">
                                      <span>{trait}</span>
                                      <span>{75 + (i * 10)}%</span>
                                   </div>
                                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${75 + (i * 10)}%` }} className={`h-full ${t.secondary}`} />
                                   </div>
                                 </div>
                               ))}
                             </div>
                          </CustomCard>
                        </div>
                      </div>
                    </RevealOnScroll>
                  )}
                </div>
              )}

              {reading && (
                <RevealOnScroll>
                  <CustomCard 
                    themeConfig={t} 
                    className="w-full max-w-6xl"
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-6">
                           <div className={`p-6 ${t.bg} rounded-3xl border ${t.accent}`}><Terminal className={t.primary} size={36} /></div>
                           <h3 className={`font-tech ${t.primary} uppercase tracking-[0.5em] text-2xl font-black`}>Strategic Dossier</h3>
                        </div>
                        <div className="flex gap-4">
                          <HUDActionIcon icon={Volume2} activeIcon={AudioLines} active={isSynthesizing} onClick={() => narrate(reading!)} theme={theme} />
                          <HUDActionIcon icon={Save} onClick={() => { setVault(v => [{ id: Math.random().toString(), type: 'mnemonic', title: 'Subject Analysis', content: reading!, timestamp: Date.now() }, ...v]); triggerToast("INTEL ARCHIVED"); }} theme={theme} />
                        </div>
                      </div>
                    }
                  >
                    <div className={`text-xl md:text-4xl text-slate-100 font-serif italic leading-[1.8] text-justify tracking-wide`}>
                      <DecryptText text={reading} />
                    </div>
                  </CustomCard>
                </RevealOnScroll>
              )}
            </main>

            <ProtocolOverlay isOpen={showCompatibility} onClose={() => setShowCompatibility(false)} title="Compatibility Engine" icon={Share2} theme={theme}>
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Partner Signature</label>
                    <input type="text" placeholder="ENTER NAME" className={`w-full bg-black/60 border ${t.border} p-6 rounded-2xl text-white outline-none font-tech uppercase`} value={partnerData.name} onChange={e => setPartnerData({...partnerData, name: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Temporal Origin</label>
                    <input type="date" className={`w-full bg-black/60 border ${t.border} p-6 rounded-2xl text-white outline-none font-tech`} value={partnerData.birthDate} onChange={e => setPartnerData({...partnerData, birthDate: e.target.value})} />
                  </div>
                </div>

                {partnerAnalysis && partnerAnalysis.compatibility && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    <div className="flex flex-col items-center justify-center py-10">
                       <div className={`w-40 h-40 rounded-full border-4 ${t.accent} flex flex-col items-center justify-center ${t.bg} ${t.glow} relative`}>
                          <span className={`font-tech text-6xl ${t.primary}`}>{partnerAnalysis.compatibility.score}</span>
                          <span className="text-[10px] font-tech text-slate-500 uppercase">Match</span>
                          <div className={`absolute -top-4 -right-4 p-3 bg-black border ${t.accent} rounded-xl font-tech ${t.primary} text-xl`}>
                            {partnerAnalysis.lp.value}
                          </div>
                       </div>
                    </div>

                    <CustomCard themeConfig={t} title="Vibrational Resonance Report">
                       <div className="space-y-6">
                          <p className={`text-2xl font-serif italic text-white text-center leading-relaxed`}>
                            "{partnerAnalysis.compatibility.message}"
                          </p>
                          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                             <HUDDataField label="Your Frequency" content={fullAnalysis?.lp.value.toString() || "0"} theme={theme} />
                             <HUDDataField label="Partner Frequency" content={partnerAnalysis.lp.value.toString()} theme={theme} />
                          </div>
                       </div>
                    </CustomCard>

                    <div className="flex justify-center">
                       <button onClick={() => {
                         setVault(v => [{
                           id: Math.random().toString(),
                           type: 'prediction',
                           title: `Sync: ${userData.name} + ${partnerData.name}`,
                           content: `Compatibility Score: ${partnerAnalysis.compatibility?.score} | ${partnerAnalysis.compatibility?.message}`,
                           timestamp: Date.now()
                         }, ...v]);
                         triggerToast("SYNC DATA ARCHIVED", 20);
                       }} className={`px-10 py-4 ${t.secondary} text-black font-tech rounded-xl uppercase tracking-widest font-black hover:brightness-125 transition-all`}>
                         Archive Sync Node
                       </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </ProtocolOverlay>

            <ProtocolOverlay isOpen={showVault} onClose={() => setShowVault(false)} title="Archives" icon={Archive} theme={theme}>
              <div className="grid gap-10">
                {vault.length === 0 ? <div className="py-40 text-center opacity-10 uppercase font-tech tracking-[0.6em] text-4xl">Archive Empty</div> : vault.map(v => (
                  <div key={v.id} className={`p-10 bg-slate-900/60 border ${t.accent} rounded-[3rem] relative group`}>
                    <div className="absolute top-10 right-10 flex gap-4">
                      <button onClick={() => narrate(v.content)} className={`${t.primary} hover:opacity-100 opacity-60`}><Volume2 size={24} /></button>
                      <button onClick={() => { setVault(prev => prev.filter(x => x.id !== v.id)); triggerToast("NODE PURGED"); }} className="text-red-500 opacity-60 hover:opacity-100"><Trash2 size={24} /></button>
                    </div>
                    <h4 className={`font-tech ${t.primary} mb-8 uppercase text-xl tracking-[0.4em]`}>{v.title}</h4>
                    <p className="font-serif text-lg italic text-slate-300 leading-relaxed"><DecryptText text={v.content} /></p>
                    {v.metadata?.sizing && (
                      <div className="mt-6 flex gap-6">
                         <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-tech text-slate-400 uppercase">Sizing: {(v.metadata.sizing * 100).toFixed(2)}%</div>
                         <div className={`px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-tech uppercase ${v.metadata.directive.color}`}>Edge: {(v.metadata.edge * 100).toFixed(2)}%</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ProtocolOverlay>

            <ProtocolOverlay isOpen={showOracle} onClose={() => setShowOracle(false)} title="Oracle Engine" icon={TrendingUp} theme={theme}>
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Domain Sector</label>
                    <select className={`w-full bg-black/60 border ${t.border} p-6 rounded-2xl text-white outline-none font-tech`} value={prediction.domain} onChange={e => setPrediction({...prediction, domain: e.target.value})}>
                      {['Finance', 'Sports', 'Politics', 'Fed Policy'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Market Probability (0-1)</label>
                    <input type="number" step="0.01" min="0" max="1" className={`w-full bg-black/60 border ${t.border} p-6 rounded-2xl text-white outline-none font-tech`} value={prediction.marketPrice} onChange={e => setPrediction({...prediction, marketPrice: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Model Estimate (0-1)</label>
                    <input type="number" step="0.01" min="0" max="1" className={`w-full bg-black/60 border ${t.border} p-6 rounded-2xl text-white outline-none font-tech`} value={prediction.modelEstimate} onChange={e => setPrediction({...prediction, modelEstimate: parseFloat(e.target.value)})} />
                  </div>
                  <div className="flex items-end">
                    <button onClick={handlePrediction} className={`w-full py-6 ${t.secondary} text-black font-tech rounded-2xl uppercase tracking-widest font-black hover:brightness-125 transition-all`}>Calculate Edge</button>
                  </div>
                </div>
                <CustomCard 
                  themeConfig={t} 
                  variant="compact" 
                  title="Systematic Biases Identified"
                >
                   <div className="grid gap-4">
                     {prediction.domain && (prediction.domain === 'Finance' || prediction.domain === 'Sports' || prediction.domain === 'Politics' || prediction.domain === 'Fed Policy') && 
                      getSystematicBiases(prediction.domain).map((b: string, i: number) => (
                       <div key={i} className="flex items-center gap-4 text-sm text-slate-300 font-serif italic">
                         <div className={`w-1.5 h-1.5 rounded-full ${t.secondary}`} />
                         {b}
                       </div>
                     ))}
                   </div>
                </CustomCard>
              </div>
            </ProtocolOverlay>

            <ProtocolOverlay isOpen={showCodex} onClose={() => setShowCodex(false)} title="Universal Codex" icon={Book} theme={theme}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {UNIVERSAL_LAWS.map(law => (
                  <button key={law.id} onClick={() => handleLawLecture(law)} className={`p-8 bg-slate-900/40 border ${t.border} rounded-3xl text-left hover:border-white/20 transition-all group relative overflow-hidden`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${t.secondary} opacity-20 group-hover:opacity-100 transition-opacity`} />
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[9px] font-tech ${t.primary} uppercase tracking-widest`}>{law.resonance}</span>
                      <span className="text-[9px] font-tech text-slate-600 uppercase">{law.category}</span>
                    </div>
                    <h4 className="text-xl font-tech text-white uppercase mb-4 tracking-tight">{law.name}</h4>
                    <p className="text-xs text-slate-400 font-serif italic line-clamp-2">{law.summary}</p>
                  </button>
                ))}
              </div>
              
              <AnimatePresence>
                {activeLaw && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`fixed inset-0 z-[300] bg-black/98 p-12 overflow-y-auto custom-scrollbar`}>
                    <div className="max-w-5xl mx-auto space-y-16 py-20">
                      <div className="flex justify-between items-start border-b border-white/10 pb-12">
                        <div className="space-y-4">
                          <h2 className={`font-tech ${t.primary} text-5xl md:text-7xl uppercase tracking-tighter`}>{activeLaw.title}</h2>
                          <p className="text-xl text-slate-400 font-serif italic">{activeLaw.cliffnotes}</p>
                        </div>
                        <button onClick={() => setActiveLaw(null)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><X size={32} /></button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                          <HUDDataField label="Effort Quantification" content={activeLaw.effortQuantification} theme={theme} />
                          <HUDDataField label="Psychological Insight" content={activeLaw.psychologicalInsight} theme={theme} />
                          <HUDDataField label="Practical Workflow" content={activeLaw.practicalWorkflow} theme={theme} />
                        </div>
                        <div className="space-y-10">
                          <HUDDataField label="Contrast Analogy" content={activeLaw.contrastAnalogy} theme={theme} />
                          <HUDDataField label="Pop Culture Analogy" content={activeLaw.popCultureAnalogy} theme={theme} />
                          <HUDDataField label="Mnemonic" content={activeLaw.mnemonic} theme={theme} />
                        </div>
                      </div>

                      <div className={`p-12 bg-slate-900/60 border ${t.accent} rounded-[4rem] space-y-10`}>
                        <h4 className="font-tech text-white text-xl uppercase tracking-[0.4em]">Implementation Roadmap</h4>
                        <div className="space-y-8">
                          {activeLaw.roadmap.map(step => (
                            <div key={step.step} className="flex gap-8">
                              <div className={`w-12 h-12 rounded-2xl border ${t.accent} flex items-center justify-center font-tech ${t.primary} text-xl flex-shrink-0`}>{step.step}</div>
                              <div className="space-y-2">
                                <h5 className="font-tech text-white uppercase tracking-wider">{step.title}</h5>
                                <p className="text-slate-400 font-serif italic leading-relaxed">{step.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`p-12 ${t.bg} border ${t.accent} rounded-[4rem] text-center`}>
                        <h4 className={`font-tech ${t.primary} text-sm uppercase tracking-[0.5em] mb-6`}>Holy Shit Insight</h4>
                        <p className="text-3xl md:text-5xl font-serif italic text-white leading-tight">"{activeLaw.holyShitInsight}"</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isLoadingLaw && (
                <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center">
                  <Loader2 className={`animate-spin ${t.primary} mb-6`} size={64} />
                  <span className="font-tech text-white uppercase tracking-[0.4em] animate-pulse">Generating Lecture...</span>
                </div>
              )}
            </ProtocolOverlay>

            <ProtocolOverlay isOpen={showBriefing} onClose={() => setShowBriefing(false)} title="Daily Intelligence" icon={Activity} theme={theme}>
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex justify-end gap-4">
                  <HUDActionIcon icon={Volume2} activeIcon={AudioLines} active={isSynthesizing} onClick={() => narrate(briefingText)} theme={theme} />
                  <HUDActionIcon icon={Save} onClick={() => { setVault(v => [{ id: Math.random().toString(), type: 'lecture', title: 'Daily Briefing', content: briefingText, timestamp: Date.now() }, ...v]); triggerToast("BRIEFING ARCHIVED"); }} theme={theme} />
                </div>
                <div className="text-2xl md:text-4xl text-slate-100 font-serif italic leading-[1.8] text-justify tracking-wide">
                  <DecryptText text={briefingText} />
                </div>
              </div>
            </ProtocolOverlay>

            <ProtocolOverlay isOpen={showChat} onClose={() => setShowChat(false)} title="Intelligence Handler" icon={MessageSquare} theme={theme}>
              <div className="max-w-4xl mx-auto h-[70vh] flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                  {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-6">
                      <Terminal size={80} />
                      <p className="font-tech uppercase tracking-[0.4em] text-center">Secure Channel Established. Awaiting Input.</p>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-8 rounded-[2.5rem] ${m.role === 'user' ? `bg-white/5 border border-white/10 text-white` : `bg-slate-900/60 border ${t.accent} ${t.primary}`} font-serif italic text-lg leading-relaxed`}>
                        <DecryptText text={m.content} />
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className={`p-8 rounded-[2.5rem] bg-slate-900/60 border ${t.accent} flex items-center gap-4`}>
                        <Loader2 className={`animate-spin ${t.primary}`} size={24} />
                        <span className="font-tech text-[10px] uppercase tracking-widest animate-pulse">Handler Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-white/10 flex gap-6">
                  <input type="text" placeholder="TRANSMIT QUERY..." className={`flex-1 bg-black/60 border ${t.border} p-6 rounded-2xl text-white outline-none font-tech uppercase tracking-widest focus:${t.primary}`} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
                  <button onClick={handleChat} className={`p-6 ${t.secondary} text-black rounded-2xl hover:brightness-125 transition-all`}><Send size={24} /></button>
                </div>
              </div>
            </ProtocolOverlay>

            <ProtocolOverlay isOpen={showAstrology} onClose={() => setShowAstrology(false)} title="Astrological Matrix" icon={Database} theme={theme}>
              {fullAnalysis?.astrology ? (
                <div className="space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {fullAnalysis.astrology.planets.map(p => (
                      <div key={p.name} className={`p-8 bg-slate-900/40 border ${t.border} rounded-3xl flex items-center gap-6`}>
                        <div className={`w-16 h-16 rounded-2xl border ${t.accent} flex items-center justify-center text-4xl ${t.primary}`}>{p.glyph}</div>
                        <div>
                          <h4 className="font-tech text-white uppercase text-sm tracking-widest">{p.name}</h4>
                          <p className={`text-xs font-serif italic ${t.primary} opacity-60`}>{p.sign} {p.degree.toFixed(1)}°</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className={`p-10 bg-black/40 border ${t.border} rounded-[4rem] space-y-8`}>
                      <h4 className="font-tech text-white text-xl uppercase tracking-[0.4em] border-b border-white/10 pb-6">Vedic Traditions</h4>
                      <div className="grid gap-6">
                        <HUDDataField label="Nakshatra" content={`${fullAnalysis.astrology.traditions?.vedic.nakshatra.name} (Pada ${fullAnalysis.astrology.traditions?.vedic.nakshatra.pada})`} theme={theme} />
                        <HUDDataField label="Nakshatra Theme" content={fullAnalysis.astrology.traditions?.vedic.nakshatra.theme} theme={theme} />
                        <HUDDataField label="Rashi" content={fullAnalysis.astrology.traditions?.vedic.rashi} theme={theme} />
                      </div>
                    </div>
                    <div className={`p-10 bg-black/40 border ${t.border} rounded-[4rem] space-y-8`}>
                      <h4 className="font-tech text-white text-xl uppercase tracking-[0.4em] border-b border-white/10 pb-6">Arabian Parts</h4>
                      <div className="grid gap-6">
                        <HUDDataField label="Part of Fortune" content={`${fullAnalysis.astrology.traditions?.arabian.partOfFortune.sign} - ${fullAnalysis.astrology.traditions?.arabian.partOfFortune.meaning}`} theme={theme} />
                        <HUDDataField label="Part of Spirit" content={`${fullAnalysis.astrology.traditions?.arabian.partOfSpirit.sign} - ${fullAnalysis.astrology.traditions?.arabian.partOfSpirit.meaning}`} theme={theme} />
                        <HUDDataField label="Lunar Mansion" content={fullAnalysis.astrology.traditions?.arabian.lunarMansion.name} theme={theme} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className={`p-10 bg-black/40 border ${t.border} rounded-[4rem] space-y-8`}>
                      <h4 className="font-tech text-white text-xl uppercase tracking-[0.4em] border-b border-white/10 pb-6">Druid Tree Lore</h4>
                      <div className="grid gap-6">
                        <HUDDataField label="Sacred Tree" content={fullAnalysis.astrology.traditions?.druid.tree} theme={theme} />
                        <HUDDataField label="Totem Animal" content={fullAnalysis.astrology.traditions?.druid.totem} theme={theme} />
                        <HUDDataField label="Moon Phase" content={fullAnalysis.astrology.traditions?.druid.moonPhase} theme={theme} />
                      </div>
                    </div>
                    <div className={`p-10 bg-black/40 border ${t.border} rounded-[4rem] space-y-8`}>
                      <h4 className="font-tech text-white text-xl uppercase tracking-[0.4em] border-b border-white/10 pb-6">Mayan Tzolkin</h4>
                      <div className="grid gap-6">
                        <HUDDataField label="Day Sign" content={fullAnalysis.astrology.traditions?.mayan.daySign} theme={theme} />
                        <HUDDataField label="Tone" content={fullAnalysis.astrology.traditions?.mayan.tone} theme={theme} />
                        <HUDDataField label="Long Count" content={fullAnalysis.astrology.traditions?.mayan.longCount} theme={theme} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-40 text-center opacity-10 uppercase font-tech tracking-[0.6em] text-4xl">Data Incomplete</div>
              )}
            </ProtocolOverlay>

            <AnimatePresence>{showSuccessToast && <SuccessToast message={showSuccessToast.message} xp={showSuccessToast.xp} theme={theme} />}</AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const HUDButton = ({ icon: Icon, onClick, count, label, theme }: any) => {
  const t = THEMES[theme as ThemeType];
  return (
    <button onClick={onClick} className={`relative flex-shrink-0 px-6 py-4 rounded-2xl bg-slate-900/60 border ${t.accent} hover:bg-slate-800 transition-all flex items-center gap-4 ${t.primary} shadow-xl backdrop-blur-3xl group active:scale-95`}>
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      {label && <span className="text-[11px] font-tech uppercase tracking-[0.4em] hidden xl:inline">{label}</span>}
      {count > 0 && <span className={`absolute -top-2 -right-2 w-6 h-6 ${t.secondary} text-black rounded-full flex items-center justify-center text-[10px] font-black shadow-lg animate-pulse`}>{count}</span>}
    </button>
  );
};

const HUDActionIcon = ({ icon: Icon, activeIcon: ActiveIcon, active, onClick, theme, small }: any) => {
  const t = THEMES[theme as ThemeType];
  const DisplayIcon = active && ActiveIcon ? ActiveIcon : Icon;
  return (
    <button onClick={onClick} className={`${small ? 'p-4 rounded-2xl' : 'p-6 rounded-3xl'} border transition-all ${active ? `${t.secondary} text-black` : `${t.bg} ${t.primary} ${t.accent} hover:brightness-125`}`}>
      <DisplayIcon size={small ? 20 : 28} className={active ? 'animate-pulse' : ''} />
    </button>
  );
};

const HUDDataField = ({ label, content, theme, colorClass }: any) => {
  const t = THEMES[theme as ThemeType];
  return (
    <div className="space-y-4">
      <h4 className={`flex items-center gap-3 font-tech ${colorClass || t.primary} opacity-60 uppercase text-[10px] tracking-[0.3em]`}><ChevronRight size={12} /> {label}</h4>
      <p className="text-xl md:text-2xl font-serif italic text-slate-100 leading-relaxed">{content || "Node decrypting..."}</p>
    </div>
  );
};

const SuccessToast = ({ message, xp, theme }: any) => {
  const t = THEMES[theme as ThemeType];
  return (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-6 ${t.secondary} text-black rounded-[2rem] font-tech uppercase font-black shadow-4xl flex items-center gap-8 z-[300] border-4 border-white/20`}>
      <CheckCircle2 size={32} /> 
      <span className="text-lg tracking-[0.1em]">{message}</span> 
      {xp && <span className="bg-black/20 px-4 py-2 rounded-xl text-sm">+{xp} XP</span>}
    </motion.div>
  );
};

const ProtocolOverlay = ({ isOpen, onClose, title, icon: Icon, children, theme }: any) => {
  const t = THEMES[theme as ThemeType];
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-6xl bg-slate-950 border ${t.accent} rounded-[4rem] p-16 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-4xl`}>
            <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-10">
              <div className={`flex items-center gap-6 ${t.primary}`}>
                <div className={`p-6 ${t.bg} rounded-3xl border ${t.accent}`}><Icon size={40} /></div>
                <h3 className="text-4xl font-tech uppercase tracking-[0.4em] font-black">{title}</h3>
              </div>
              <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><X size={32} /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import { ThemeType, ThemeConfig } from './types';

export const THEMES: Record<ThemeType, ThemeConfig> = {
  solana: {
    primary: 'text-yellow-500',
    secondary: 'bg-yellow-500',
    accent: 'border-yellow-500/30',
    glow: 'shadow-[0_0_30px_rgba(217,182,92,0.3)]',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-200',
    border: 'border-yellow-500/10'
  },
  quantum: {
    primary: 'text-cyan-400',
    secondary: 'bg-cyan-400',
    accent: 'border-cyan-500/30',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-100',
    border: 'border-cyan-500/10'
  },
  stealth: {
    primary: 'text-slate-100',
    secondary: 'bg-slate-100',
    accent: 'border-slate-500/30',
    glow: 'shadow-[0_0_30px_rgba(255,255,255,0.1)]',
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    border: 'border-slate-100/10'
  }
};


/**
 * Kelly Criterion calculation (Fractional)
 * f* = (bp - q) / b
 * f* is the fraction of the bankroll to bet
 * b is the odds (decimal odds - 1)
 * p is the probability of winning (model estimate)
 * q is the probability of losing (1 - p)
 */
export function calculateKellySizing(modelProb: number, marketProb: number, fraction: number = 0.25): number {
  if (marketProb <= 0 || marketProb >= 1) return 0;
  
  // Convert market probability to decimal odds: b = (1 - marketProb) / marketProb
  const b = (1 - marketProb) / marketProb;
  const p = modelProb;
  const q = 1 - p;
  
  // Basic Kelly formula: f = p - q/b
  const kelly = p - (q / b);
  
  // Return 0 if no edge, else return fractional kelly
  return kelly > 0 ? kelly * fraction : 0;
}

export function getSystematicBiases(domain: string): string[] {
  const biases: Record<string, string[]> = {
    'Sports': [
      'Overreaction to high-scoring individual performances',
      'Underestimation of travel-fatigue metrics',
      'Mispricing of conditional substitution patterns'
    ],
    'Finance': [
      'Predictable Fed-meeting announcement overreaction',
      'Mispricing of small-cap liquidity constraints during earnings',
      'Momentum trap bias in retail-favored sectors'
    ],
    'Politics': [
      'Overweighting of individual poll outliers vs aggregates',
      'Underestimation of incumbency economic fundamentals',
      'Demographic turnout model inaccuracies'
    ],
    'Fed Policy': [
      'Misinterpretation of FOMC member "hawks" vs "doves" nuance',
      'Lagging market reaction to core economic data trends',
      'Market pricing irrationality during black-out periods'
    ]
  };
  return biases[domain] || ['General market irrationality', 'Recency bias'];
}

export function getOracleDirective(edge: number): { type: 'BET' | 'PASS', color: string, message: string } {
  // Edge is defined as (Model - Market)
  if (edge >= 0.1) {
    return { type: 'BET', color: 'text-green-400', message: 'Statistical Edge >10% Confirmed. Systematic entry authorized.' };
  }
  if (edge > 0.05) {
    return { type: 'BET', color: 'text-cyan-400', message: 'Edge detected (5-10%). Enter with strict fractional Kelly discipline.' };
  }
  return { type: 'PASS', color: 'text-amber-500', message: 'Insignificant Edge. The hardest part is not betting. Pass.' };
}

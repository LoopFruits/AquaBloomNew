// ─────────────────────────────────────────────────
// AquaBloom Gamification Configuration
// ─────────────────────────────────────────────────

import type { PlantSpeciesConfig, PlantGrowthStage } from '../types/gamification';

// ── Bloom Points Rules ──────────────────────────

export const BLOOM_POINTS = {
  PER_SIP: 5,
  GOAL_REACHED: 50,
  STREAK_BONUS_PER_SIP: 10,   // Extra per sip when streak ≥ 7
  STREAK_BONUS_THRESHOLD: 7,   // Days of streak needed for bonus
  DAILY_CAP: 150,
};

// ── Plant Growth Thresholds ─────────────────────
// Growth stage is determined by % of daily goal reached

export const GROWTH_THRESHOLDS: Record<PlantGrowthStage, number> = {
  0: 0,      // 0% — empty pot with soil
  1: 0.25,   // 25% — tiny seedling
  2: 0.50,   // 50% — small plant
  3: 0.75,   // 75% — budding plant
  4: 1.0,    // 100% — full bloom!
};

/** Calculate growth stage from current progress (0-1) */
export function getGrowthStage(progress: number): PlantGrowthStage {
  if (progress >= 1.0) return 4;
  if (progress >= 0.75) return 3;
  if (progress >= 0.50) return 2;
  if (progress >= 0.25) return 1;
  return 0;
}

// ── Plant Species Definitions ───────────────────
// Phase 1: single free species ("Sprout")
// Phase 2 will add premium species (Sakura, Monstera, Succulent, etc.)

export const PLANT_COLORS = {
  sprout: {
    pot: '#8B6F47',      // Warm brown clay
    soil: '#4A3728',     // Dark soil
    stem: '#5B8C5A',     // Green stem
    leaf: '#7ec8c8',     // Teal (matches app theme)
    flower: '#c4a7d7',   // Lavender (matches app theme)
  },
};

// SVG viewBox: 0 0 120 160
// Pot sits at bottom, plant grows upward

export const SPROUT_STAGES = {
  // Stage 0: Just the pot with soil
  0: {
    pot: 'M30 130 Q30 155 45 155 L75 155 Q90 155 90 130 L85 105 Q84 100 79 100 L41 100 Q36 100 35 105 Z',
    soil: 'M38 105 Q38 100 43 100 L77 100 Q82 100 82 105 Q60 112 38 105 Z',
    potRim: 'M28 100 Q28 95 35 95 L85 95 Q92 95 92 100 L90 103 Q89 106 84 106 L36 106 Q31 106 30 103 Z',
  },
  // Stage 1: Tiny seedling — single thin stem + 2 small leaves
  1: {
    stem: 'M60 100 Q60 85 60 80',
    leaves: [
      'M60 85 Q50 80 48 85 Q50 88 60 85',   // Left leaf
      'M60 82 Q70 77 72 82 Q70 85 60 82',   // Right leaf
    ],
  },
  // Stage 2: Small plant — taller stem + 4 leaves
  2: {
    stem: 'M60 100 Q59 75 60 65',
    leaves: [
      'M60 90 Q45 82 42 88 Q46 94 60 90',   // Lower left
      'M60 85 Q75 77 78 83 Q74 89 60 85',   // Lower right
      'M60 75 Q48 68 46 74 Q49 79 60 75',   // Upper left
      'M60 70 Q72 63 74 69 Q71 74 60 70',   // Upper right
    ],
  },
  // Stage 3: Budding — tall stem + 5 leaves + bud at top
  3: {
    stem: 'M60 100 Q58 65 60 45',
    leaves: [
      'M60 90 Q42 80 38 87 Q43 95 60 90',   // Lowest left
      'M60 82 Q78 72 82 79 Q77 87 60 82',   // Lowest right
      'M60 72 Q44 62 40 69 Q45 76 60 72',   // Mid left
      'M60 62 Q76 52 80 59 Q75 66 60 62',   // Mid right
      'M60 52 Q48 44 46 50 Q49 55 60 52',   // Top left
    ],
    bud: 'M60 42 Q55 35 58 30 Q60 28 62 30 Q65 35 60 42',
  },
  // Stage 4: Full bloom — tallest stem + leaves + open flower
  4: {
    stem: 'M60 100 Q58 60 60 40',
    leaves: [
      'M60 90 Q40 78 35 86 Q41 96 60 90',
      'M60 80 Q80 68 85 76 Q79 86 60 80',
      'M60 68 Q42 56 37 64 Q43 73 60 68',
      'M60 58 Q78 46 83 54 Q77 63 60 58',
      'M60 48 Q44 38 40 45 Q45 52 60 48',
      'M60 48 Q76 38 80 45 Q75 52 60 48',
    ],
    flower: {
      // 5 petals arranged around center
      petals: [
        'M60 18 Q55 8 60 2 Q65 8 60 18',         // Top petal
        'M60 18 Q48 12 44 18 Q50 24 60 18',       // Upper-left petal
        'M60 18 Q72 12 76 18 Q70 24 60 18',       // Upper-right petal
        'M60 18 Q48 24 46 30 Q52 30 60 18',       // Lower-left petal
        'M60 18 Q72 24 74 30 Q68 30 60 18',       // Lower-right petal
      ],
      center: { cx: 60, cy: 18, r: 5 },
    },
  },
};

// ── Default States ──────────────────────────────

export const DEFAULT_BLOOM_POINTS = {
  total: 0,
  todayEarned: 0,
  todayLog: [],
};

export const DEFAULT_PLANT_STATE = {
  species: 'sprout' as const,
  growthStage: 0 as PlantGrowthStage,
  wateredToday: 0,
};

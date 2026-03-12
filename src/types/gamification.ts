// ─────────────────────────────────────────────────
// AquaBloom Gamification Types
// ─────────────────────────────────────────────────

/** Available plant species — Phase 1 ships with 'sprout' only */
export type PlantSpecies = 'sprout';

/** Plant growth stages: 0 = seed/pot, 1-4 = progressive growth */
export type PlantGrowthStage = 0 | 1 | 2 | 3 | 4;

/** Reasons a user can earn Bloom Points */
export type BloomPointsReason = 'sip' | 'goal_reached' | 'streak_bonus';

/** Single Bloom Points earning event */
export interface BloomPointsEntry {
  points: number;
  reason: BloomPointsReason;
  timestamp: string; // ISO string
}

/** Persisted Bloom Points state */
export interface BloomPointsState {
  total: number;          // Lifetime accumulated points
  todayEarned: number;    // Points earned today (resets daily)
  todayLog: BloomPointsEntry[]; // Today's earning breakdown
}

/** Persisted Plant state */
export interface PlantState {
  species: PlantSpecies;
  growthStage: PlantGrowthStage;
  wateredToday: number;   // Number of sips today (drives growth)
}

/** SVG path definition for one growth stage */
export interface PlantStagePaths {
  pot: string;
  stem?: string;
  leaves?: string[];
  flower?: string;
  soil: string;
}

/** Complete plant species definition */
export interface PlantSpeciesConfig {
  id: PlantSpecies;
  name: string;
  premium: boolean;
  stages: PlantStagePaths[];       // Index 0-4
  colors: {
    pot: string;
    soil: string;
    stem: string;
    leaf: string;
    flower: string;
  };
}

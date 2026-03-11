import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import {
  BLOOM_POINTS,
  getGrowthStage,
  DEFAULT_BLOOM_POINTS,
  DEFAULT_PLANT_STATE,
} from '../config/gamification';
import type {
  PlantGrowthStage,
  BloomPointsReason,
  BloomPointsEntry,
  BloomPointsState,
  PlantState,
} from '../types/gamification';

export function useGamification() {
  const [bloomPoints, setBloomPoints] = useState<BloomPointsState>(DEFAULT_BLOOM_POINTS);
  const [plantState, setPlantState] = useState<PlantState>(DEFAULT_PLANT_STATE);
  const [loading, setLoading] = useState(true);
  const [lastStageUp, setLastStageUp] = useState<PlantGrowthStage | null>(null);

  // ── Load persisted state on mount ────────────
  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const [savedPoints, savedPlant] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BLOOM_POINTS),
        AsyncStorage.getItem(STORAGE_KEYS.PLANT_STATE),
      ]);

      if (savedPoints) {
        setBloomPoints(JSON.parse(savedPoints));
      }
      if (savedPlant) {
        setPlantState(JSON.parse(savedPlant));
      }
    } catch (e) {
      console.warn('Failed to load gamification data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Persist helpers ──────────────────────────
  const persistPoints = async (state: BloomPointsState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BLOOM_POINTS, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save bloom points:', e);
    }
  };

  const persistPlant = async (state: PlantState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLANT_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save plant state:', e);
    }
  };

  // ── Add Bloom Points ─────────────────────────
  const addBloomPoints = useCallback((amount: number, reason: BloomPointsReason, streak: number = 0) => {
    setBloomPoints((prev) => {
      // Check daily cap
      if (prev.todayEarned >= BLOOM_POINTS.DAILY_CAP) return prev;

      let totalEarning = amount;

      // Streak bonus: +10 extra per sip if streak ≥ 7
      if (reason === 'sip' && streak >= BLOOM_POINTS.STREAK_BONUS_THRESHOLD) {
        totalEarning += BLOOM_POINTS.STREAK_BONUS_PER_SIP;
      }

      // Clamp to daily cap
      const remaining = BLOOM_POINTS.DAILY_CAP - prev.todayEarned;
      const earned = Math.min(totalEarning, remaining);

      if (earned <= 0) return prev;

      const entry: BloomPointsEntry = {
        points: earned,
        reason,
        timestamp: new Date().toISOString(),
      };

      const updated: BloomPointsState = {
        total: prev.total + earned,
        todayEarned: prev.todayEarned + earned,
        todayLog: [...prev.todayLog, entry],
      };

      // Defer persistence
      setTimeout(() => persistPoints(updated), 0);
      return updated;
    });
  }, []);

  // ── Update Plant Growth ──────────────────────
  // Called after each water add with the new intake total and goal
  const updatePlantGrowth = useCallback((currentIntake: number, goal: number) => {
    const progress = Math.min(currentIntake / goal, 1);
    const newStage = getGrowthStage(progress);

    setPlantState((prev) => {
      const updated: PlantState = {
        ...prev,
        growthStage: newStage,
        wateredToday: prev.wateredToday + 1,
      };

      // Track stage-up for haptic feedback
      if (newStage > prev.growthStage) {
        setLastStageUp(newStage);
      }

      setTimeout(() => persistPlant(updated), 0);
      return updated;
    });
  }, []);

  // ── Reset Daily (called on day rollover) ─────
  const resetDailyGamification = useCallback(async () => {
    // Plant resets to stage 0 (start fresh each day like Duolingo)
    const resetPlant: PlantState = {
      ...plantState,
      growthStage: 0,
      wateredToday: 0,
    };

    // Points: reset today's earnings but keep total
    const resetPoints: BloomPointsState = {
      total: bloomPoints.total,
      todayEarned: 0,
      todayLog: [],
    };

    setPlantState(resetPlant);
    setBloomPoints(resetPoints);

    await Promise.all([
      persistPlant(resetPlant),
      persistPoints(resetPoints),
    ]);
  }, [plantState, bloomPoints.total]);

  // ── Clear stage-up flag ──────────────────────
  const clearStageUp = useCallback(() => {
    setLastStageUp(null);
  }, []);

  return {
    // State
    bloomPoints,
    plantState,
    loading,
    lastStageUp, // Non-null when plant just grew (for haptic/animation trigger)

    // Actions
    addBloomPoints,
    updatePlantGrowth,
    resetDailyGamification,
    clearStageUp,
  };
}

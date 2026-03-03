import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_GOAL_ML, AFFIRMATIONS } from '../config/constants';

const getTodayKey = () => new Date().toISOString().split('T')[0];

export function useHydration() {
  const [intake, setIntake] = useState(0);
  const [log, setLog] = useState([]);
  const [goal, setGoal] = useState(DEFAULT_GOAL_ML);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [goalReached, setGoalReached] = useState(false);
  const affirmIdx = useRef(Math.floor(Math.random() * AFFIRMATIONS.length));

  // Load data on mount & handle day rollover
  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const savedDate = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_DATE);
      const today = getTodayKey();

      if (savedDate === today) {
        // Same day — restore data
        const savedIntake = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_TODAY);
        const savedLog = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_LOG);
        const savedGoal = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

        if (savedIntake) setIntake(parseInt(savedIntake, 10));
        if (savedLog) setLog(JSON.parse(savedLog));
        if (savedGoal) {
          const settings = JSON.parse(savedGoal);
          if (settings.goal) setGoal(settings.goal);
        }

        // Check if goal was already reached
        if (savedIntake && parseInt(savedIntake, 10) >= goal) {
          setGoalReached(true);
        }
      } else {
        // New day — archive yesterday and reset
        if (savedDate) {
          await archiveDay(savedDate);
        }
        await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_DATE, today);
        await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_TODAY, '0');
        await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_LOG, '[]');
      }

      // Load streak
      const savedStreak = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
    } catch (e) {
      console.warn('Failed to load hydration data:', e);
    } finally {
      setLoading(false);
    }
  };

  const archiveDay = async (dateKey) => {
    try {
      const savedIntake = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_TODAY);
      const savedLog = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_LOG);
      const history = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      const parsed = history ? JSON.parse(history) : [];

      const dayData = {
        date: dateKey,
        intake: parseInt(savedIntake || '0', 10),
        goal,
        log: savedLog ? JSON.parse(savedLog) : [],
        goalReached: parseInt(savedIntake || '0', 10) >= goal,
      };

      // Keep last 90 days of history
      const updated = [dayData, ...parsed].slice(0, 90);
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));

      // Update streak
      if (dayData.goalReached) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        await AsyncStorage.setItem(STORAGE_KEYS.STREAK, newStreak.toString());
      } else {
        setStreak(0);
        await AsyncStorage.setItem(STORAGE_KEYS.STREAK, '0');
      }
    } catch (e) {
      console.warn('Failed to archive day:', e);
    }
  };

  const persist = async (newIntake, newLog) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_TODAY, newIntake.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_LOG, JSON.stringify(newLog));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  };

  const addWater = useCallback((ml) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entry = { ml, time: timeStr, id: Date.now(), timestamp: now.toISOString() };

    setIntake((prev) => {
      const newIntake = prev + ml;
      if (newIntake >= goal && !goalReached) {
        setGoalReached(true);
      }
      return newIntake;
    });

    setLog((prev) => {
      const newLog = [entry, ...prev];
      // Defer persistence
      setTimeout(() => {
        persist(intake + ml, newLog);
      }, 0);
      return newLog;
    });

    affirmIdx.current = (affirmIdx.current + 1) % AFFIRMATIONS.length;

    return entry;
  }, [intake, goal, goalReached]);

  const undoLast = useCallback(() => {
    if (log.length === 0) return;
    const last = log[0];

    setIntake((prev) => {
      const newIntake = Math.max(0, prev - last.ml);
      if (newIntake < goal) setGoalReached(false);
      return newIntake;
    });

    setLog((prev) => {
      const newLog = prev.slice(1);
      setTimeout(() => {
        persist(Math.max(0, intake - last.ml), newLog);
      }, 0);
      return newLog;
    });
  }, [log, intake, goal]);

  const resetDay = useCallback(async () => {
    setIntake(0);
    setLog([]);
    setGoalReached(false);
    await persist(0, []);
  }, []);

  const updateGoal = useCallback(async (newGoal) => {
    setGoal(newGoal);
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      const settings = saved ? JSON.parse(saved) : {};
      settings.goal = newGoal;
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save goal:', e);
    }
  }, []);

  const progress = Math.min(intake / goal, 1);
  const percentage = Math.round(progress * 100);
  const glassesLeft = Math.max(0, Math.ceil((goal - intake) / 250));
  const mlRemaining = Math.max(0, goal - intake);
  const currentAffirmation = AFFIRMATIONS[affirmIdx.current];

  return {
    intake,
    log,
    goal,
    streak,
    loading,
    goalReached,
    progress,
    percentage,
    glassesLeft,
    mlRemaining,
    currentAffirmation,
    addWater,
    undoLast,
    resetDay,
    updateGoal,
  };
}

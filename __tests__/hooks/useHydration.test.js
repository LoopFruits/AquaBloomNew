import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHydration } from '../../src/hooks/useHydration';
import { DEFAULT_GOAL_ML, STORAGE_KEYS } from '../../src/config/constants';

// AsyncStorage is auto-mocked by jest-expo via the mock in
// @react-native-async-storage/async-storage/jest/async-storage-mock

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('useHydration — initial state', () => {
  it('starts with zero intake', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.intake).toBe(0);
  });

  it('starts with default goal', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.goal).toBe(DEFAULT_GOAL_ML);
  });

  it('starts with empty log', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.log).toEqual([]);
  });

  it('starts loading false after mount', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.loading).toBe(false);
  });

  it('starts with goalReached false', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.goalReached).toBe(false);
  });
});

describe('useHydration — derived values', () => {
  it('progress is 0 at start', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.progress).toBe(0);
    expect(result.current.percentage).toBe(0);
  });

  it('mlRemaining equals goal at start', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.mlRemaining).toBe(DEFAULT_GOAL_ML);
  });

  it('glassesLeft matches glasses needed to reach goal', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});
    expect(result.current.glassesLeft).toBe(Math.ceil(DEFAULT_GOAL_ML / 250));
  });
});

describe('useHydration — addWater', () => {
  it('increases intake by the given amount', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(250); });
    expect(result.current.intake).toBe(250);
  });

  it('adds an entry to the log', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(350); });
    expect(result.current.log).toHaveLength(1);
    expect(result.current.log[0].ml).toBe(350);
  });

  it('log entry has required fields', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(150); });
    const entry = result.current.log[0];
    expect(entry).toHaveProperty('ml', 150);
    expect(entry).toHaveProperty('time');
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('timestamp');
  });

  it('returns the log entry', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    let returnedEntry;
    act(() => { returnedEntry = result.current.addWater(250); });
    expect(returnedEntry.ml).toBe(250);
  });

  it('accumulates multiple additions', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(250); });
    act(() => { result.current.addWater(250); });
    act(() => { result.current.addWater(500); });
    expect(result.current.intake).toBe(1000);
  });

  it('sets goalReached when intake meets goal', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(DEFAULT_GOAL_ML); });
    expect(result.current.goalReached).toBe(true);
  });

  it('progress does not exceed 1.0 past goal', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(DEFAULT_GOAL_ML + 500); });
    expect(result.current.progress).toBe(1);
    expect(result.current.percentage).toBe(100);
  });

  it('most recent log entry is first', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(100); });
    act(() => { result.current.addWater(200); });
    expect(result.current.log[0].ml).toBe(200);
    expect(result.current.log[1].ml).toBe(100);
  });
});

describe('useHydration — undoLast', () => {
  it('removes the most recent log entry', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(250); });
    act(() => { result.current.undoLast(); });
    expect(result.current.log).toHaveLength(0);
  });

  it('decreases intake by the undone amount', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(250); });
    act(() => { result.current.addWater(500); });
    act(() => { result.current.undoLast(); });
    expect(result.current.intake).toBe(250);
  });

  it('does nothing when log is empty', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.undoLast(); });
    expect(result.current.intake).toBe(0);
    expect(result.current.log).toHaveLength(0);
  });

  it('intake does not go below 0', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(100); });
    act(() => { result.current.undoLast(); });
    expect(result.current.intake).toBeGreaterThanOrEqual(0);
  });

  it('clears goalReached if undo drops below goal', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(DEFAULT_GOAL_ML); });
    expect(result.current.goalReached).toBe(true);

    act(() => { result.current.undoLast(); });
    expect(result.current.goalReached).toBe(false);
  });
});

describe('useHydration — resetDay', () => {
  it('resets intake to 0', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(500); });
    await act(async () => { await result.current.resetDay(); });
    expect(result.current.intake).toBe(0);
  });

  it('clears the log', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(500); });
    await act(async () => { await result.current.resetDay(); });
    expect(result.current.log).toEqual([]);
  });

  it('resets goalReached', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    act(() => { result.current.addWater(DEFAULT_GOAL_ML); });
    await act(async () => { await result.current.resetDay(); });
    expect(result.current.goalReached).toBe(false);
  });
});

describe('useHydration — updateGoal', () => {
  it('updates the goal value', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    await act(async () => { await result.current.updateGoal(3000); });
    expect(result.current.goal).toBe(3000);
  });

  it('persists the goal to AsyncStorage', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    await act(async () => { await result.current.updateGoal(3000); });

    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    const parsed = JSON.parse(stored);
    expect(parsed.goal).toBe(3000);
  });

  it('recalculates mlRemaining based on new goal', async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    await act(async () => { await result.current.updateGoal(3000); });
    expect(result.current.mlRemaining).toBe(3000);
  });
});

describe('useHydration — persistence & restore', () => {
  it('restores intake from AsyncStorage on same day', async () => {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_DATE, today);
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_TODAY, '750');
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_LOG, '[]');

    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    expect(result.current.intake).toBe(750);
  });

  it('restores goal from saved settings', async () => {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_DATE, today);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ goal: 3500 }));

    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    expect(result.current.goal).toBe(3500);
  });

  it('resets intake when date is a new day', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_DATE, '2020-01-01');
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_TODAY, '1000');
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_LOG, '[]');

    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    expect(result.current.intake).toBe(0);
    expect(result.current.log).toEqual([]);
  });

  it('restores streak from AsyncStorage', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, '5');

    const { result } = renderHook(() => useHydration());
    await act(async () => {});

    expect(result.current.streak).toBe(5);
  });
});

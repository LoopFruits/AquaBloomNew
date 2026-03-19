import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGamification } from '../../src/hooks/useGamification';
import { BLOOM_POINTS, DEFAULT_BLOOM_POINTS, DEFAULT_PLANT_STATE } from '../../src/config/gamification';
import { STORAGE_KEYS } from '../../src/config/constants';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('useGamification — initial state', () => {
  it('starts with default bloom points', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    expect(result.current.bloomPoints.total).toBe(0);
    expect(result.current.bloomPoints.todayEarned).toBe(0);
    expect(result.current.bloomPoints.todayLog).toEqual([]);
  });

  it('starts with default plant state', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    expect(result.current.plantState.growthStage).toBe(0);
    expect(result.current.plantState.wateredToday).toBe(0);
    expect(result.current.plantState.species).toBe('sprout');
  });

  it('loading is false after mount', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});
    expect(result.current.loading).toBe(false);
  });

  it('lastStageUp is null initially', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});
    expect(result.current.lastStageUp).toBeNull();
  });
});

describe('useGamification — addBloomPoints', () => {
  it('adds points to total', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.addBloomPoints(5, 'sip'); });
    expect(result.current.bloomPoints.total).toBe(5);
  });

  it('tracks todayEarned separately', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.addBloomPoints(5, 'sip'); });
    act(() => { result.current.addBloomPoints(50, 'goal_reached'); });
    expect(result.current.bloomPoints.todayEarned).toBe(55);
  });

  it('logs each earning event', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.addBloomPoints(5, 'sip'); });
    expect(result.current.bloomPoints.todayLog).toHaveLength(1);
    expect(result.current.bloomPoints.todayLog[0].points).toBe(5);
    expect(result.current.bloomPoints.todayLog[0].reason).toBe('sip');
  });

  it('applies streak bonus when streak >= threshold', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => {
      result.current.addBloomPoints(
        BLOOM_POINTS.PER_SIP,
        'sip',
        BLOOM_POINTS.STREAK_BONUS_THRESHOLD
      );
    });

    const expected = BLOOM_POINTS.PER_SIP + BLOOM_POINTS.STREAK_BONUS_PER_SIP;
    expect(result.current.bloomPoints.total).toBe(expected);
  });

  it('does NOT apply streak bonus below threshold', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => {
      result.current.addBloomPoints(
        BLOOM_POINTS.PER_SIP,
        'sip',
        BLOOM_POINTS.STREAK_BONUS_THRESHOLD - 1
      );
    });

    expect(result.current.bloomPoints.total).toBe(BLOOM_POINTS.PER_SIP);
  });

  it('respects daily cap', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    // Add way more than the cap in one shot
    act(() => { result.current.addBloomPoints(BLOOM_POINTS.DAILY_CAP + 999, 'goal_reached'); });
    expect(result.current.bloomPoints.todayEarned).toBe(BLOOM_POINTS.DAILY_CAP);
  });

  it('does not earn more after daily cap is reached', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.addBloomPoints(BLOOM_POINTS.DAILY_CAP, 'goal_reached'); });
    act(() => { result.current.addBloomPoints(10, 'sip'); });

    expect(result.current.bloomPoints.todayEarned).toBe(BLOOM_POINTS.DAILY_CAP);
    expect(result.current.bloomPoints.total).toBe(BLOOM_POINTS.DAILY_CAP);
  });
});

describe('useGamification — updatePlantGrowth', () => {
  it('sets stage 0 below 25% progress', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(500, 2500); }); // 20%
    expect(result.current.plantState.growthStage).toBe(0);
  });

  it('advances to stage 1 at 25% progress', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(625, 2500); }); // 25%
    expect(result.current.plantState.growthStage).toBe(1);
  });

  it('advances to stage 4 at 100% progress', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(2500, 2500); }); // 100%
    expect(result.current.plantState.growthStage).toBe(4);
  });

  it('increments wateredToday on each call', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(250, 2500); });
    act(() => { result.current.updatePlantGrowth(500, 2500); });
    expect(result.current.plantState.wateredToday).toBe(2);
  });

  it('sets lastStageUp when stage increases', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(625, 2500); }); // 25% → stage 1
    expect(result.current.lastStageUp).toBe(1);
  });

  it('does not set lastStageUp when stage stays the same', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(625, 2500); }); // stage 1
    act(() => { result.current.clearStageUp(); });
    act(() => { result.current.updatePlantGrowth(700, 2500); }); // still stage 1
    expect(result.current.lastStageUp).toBeNull();
  });
});

describe('useGamification — clearStageUp', () => {
  it('resets lastStageUp to null', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(625, 2500); });
    expect(result.current.lastStageUp).not.toBeNull();

    act(() => { result.current.clearStageUp(); });
    expect(result.current.lastStageUp).toBeNull();
  });
});

describe('useGamification — resetDailyGamification', () => {
  it('resets plant to stage 0', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(2500, 2500); }); // full bloom
    await act(async () => { await result.current.resetDailyGamification(); });

    expect(result.current.plantState.growthStage).toBe(0);
  });

  it('resets wateredToday to 0', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.updatePlantGrowth(250, 2500); });
    await act(async () => { await result.current.resetDailyGamification(); });

    expect(result.current.plantState.wateredToday).toBe(0);
  });

  it('resets todayEarned to 0 but preserves total', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.addBloomPoints(50, 'goal_reached'); });
    expect(result.current.bloomPoints.total).toBe(50);

    await act(async () => { await result.current.resetDailyGamification(); });

    expect(result.current.bloomPoints.todayEarned).toBe(0);
    expect(result.current.bloomPoints.total).toBe(50);
  });

  it('clears todayLog', async () => {
    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    act(() => { result.current.addBloomPoints(5, 'sip'); });
    await act(async () => { await result.current.resetDailyGamification(); });

    expect(result.current.bloomPoints.todayLog).toEqual([]);
  });
});

describe('useGamification — persistence & restore', () => {
  it('restores bloom points from AsyncStorage', async () => {
    const savedPoints = { total: 200, todayEarned: 30, todayLog: [] };
    await AsyncStorage.setItem(STORAGE_KEYS.BLOOM_POINTS, JSON.stringify(savedPoints));

    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    expect(result.current.bloomPoints.total).toBe(200);
    expect(result.current.bloomPoints.todayEarned).toBe(30);
  });

  it('restores plant state from AsyncStorage', async () => {
    const savedPlant = { species: 'sprout', growthStage: 3, wateredToday: 8 };
    await AsyncStorage.setItem(STORAGE_KEYS.PLANT_STATE, JSON.stringify(savedPlant));

    const { result } = renderHook(() => useGamification());
    await act(async () => {});

    expect(result.current.plantState.growthStage).toBe(3);
    expect(result.current.plantState.wateredToday).toBe(8);
  });
});

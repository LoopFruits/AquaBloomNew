/** @jest-environment node */
import { getGrowthStage, BLOOM_POINTS, GROWTH_THRESHOLDS } from '../../src/config/gamification';

describe('getGrowthStage', () => {
  it('returns stage 0 when progress is 0', () => {
    expect(getGrowthStage(0)).toBe(0);
  });

  it('returns stage 0 below 25%', () => {
    expect(getGrowthStage(0.1)).toBe(0);
    expect(getGrowthStage(0.24)).toBe(0);
  });

  it('returns stage 1 at exactly 25%', () => {
    expect(getGrowthStage(0.25)).toBe(1);
  });

  it('returns stage 1 between 25% and 49%', () => {
    expect(getGrowthStage(0.3)).toBe(1);
    expect(getGrowthStage(0.49)).toBe(1);
  });

  it('returns stage 2 at exactly 50%', () => {
    expect(getGrowthStage(0.5)).toBe(2);
  });

  it('returns stage 2 between 50% and 74%', () => {
    expect(getGrowthStage(0.6)).toBe(2);
    expect(getGrowthStage(0.74)).toBe(2);
  });

  it('returns stage 3 at exactly 75%', () => {
    expect(getGrowthStage(0.75)).toBe(3);
  });

  it('returns stage 3 between 75% and 99%', () => {
    expect(getGrowthStage(0.8)).toBe(3);
    expect(getGrowthStage(0.99)).toBe(3);
  });

  it('returns stage 4 at exactly 100%', () => {
    expect(getGrowthStage(1.0)).toBe(4);
  });

  it('returns stage 4 when over 100% (overflow)', () => {
    expect(getGrowthStage(1.5)).toBe(4);
  });
});

describe('BLOOM_POINTS config', () => {
  it('has valid daily cap above per-sip reward', () => {
    expect(BLOOM_POINTS.DAILY_CAP).toBeGreaterThan(BLOOM_POINTS.PER_SIP);
  });

  it('has goal reward greater than per-sip reward', () => {
    expect(BLOOM_POINTS.GOAL_REACHED).toBeGreaterThan(BLOOM_POINTS.PER_SIP);
  });

  it('has a positive streak bonus threshold', () => {
    expect(BLOOM_POINTS.STREAK_BONUS_THRESHOLD).toBeGreaterThan(0);
  });
});

describe('GROWTH_THRESHOLDS', () => {
  it('has thresholds for all 5 stages', () => {
    expect(Object.keys(GROWTH_THRESHOLDS)).toHaveLength(5);
  });

  it('stage 0 threshold is 0 (always starts from nothing)', () => {
    expect(GROWTH_THRESHOLDS[0]).toBe(0);
  });

  it('stage 4 threshold is 1.0 (full bloom requires 100%)', () => {
    expect(GROWTH_THRESHOLDS[4]).toBe(1.0);
  });

  it('thresholds are strictly increasing', () => {
    const stages = [0, 1, 2, 3, 4] as const;
    for (let i = 1; i < stages.length; i++) {
      expect(GROWTH_THRESHOLDS[stages[i]]).toBeGreaterThan(GROWTH_THRESHOLDS[stages[i - 1]]);
    }
  });
});

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { SPROUT_STAGES, PLANT_COLORS } from '../config/gamification';
import type { PlantGrowthStage } from '../types/gamification';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface PlantCompanionProps {
  growthStage: PlantGrowthStage;
  size?: number;
  onStageUp?: () => void;
}

/**
 * Animated SVG plant that grows through 5 stages (0-4).
 * Lives inside the progress ring on the HomeScreen.
 *
 * Stage 0: Empty pot with soil
 * Stage 1: Tiny seedling (2 leaves)
 * Stage 2: Small plant (4 leaves)
 * Stage 3: Budding (5 leaves + bud)
 * Stage 4: Full bloom (6 leaves + flower)
 */
export default function PlantCompanion({
  growthStage,
  size = 120,
  onStageUp,
}: PlantCompanionProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevStage = useRef(growthStage);

  const c = PLANT_COLORS.sprout;
  const scale = size / 160; // SVG viewBox is 0 0 120 160

  // Animate on stage change
  useEffect(() => {
    if (growthStage > prevStage.current) {
      // Stage up! Bounce + haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onStageUp?.();

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade in new growth
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    prevStage.current = growthStage;
  }, [growthStage]);

  const stage0 = SPROUT_STAGES[0];

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Svg
        width={size}
        height={size * (160 / 120)}
        viewBox="0 0 120 160"
        style={{ alignSelf: 'center' }}
      >
        {/* ── Pot (always visible) ── */}
        <Path d={stage0.potRim} fill={c.pot} opacity={0.9} />
        <Path d={stage0.pot} fill={c.pot} opacity={0.7} />
        <Path d={stage0.soil} fill={c.soil} />

        {/* ── Stage 1: Seedling ── */}
        {growthStage >= 1 && (() => {
          const s = SPROUT_STAGES[1];
          return (
            <>
              <Path d={s.stem} stroke={c.stem} strokeWidth={2.5} fill="none" strokeLinecap="round" />
              {s.leaves.map((leaf, i) => (
                <Path key={`s1-leaf-${i}`} d={leaf} fill={c.leaf} opacity={0.85} />
              ))}
            </>
          );
        })()}

        {/* ── Stage 2: Small Plant ── */}
        {growthStage >= 2 && (() => {
          const s = SPROUT_STAGES[2];
          return (
            <>
              <Path d={s.stem} stroke={c.stem} strokeWidth={3} fill="none" strokeLinecap="round" />
              {s.leaves.map((leaf, i) => (
                <Path key={`s2-leaf-${i}`} d={leaf} fill={c.leaf} opacity={0.8} />
              ))}
            </>
          );
        })()}

        {/* ── Stage 3: Budding ── */}
        {growthStage >= 3 && (() => {
          const s = SPROUT_STAGES[3];
          return (
            <>
              <Path d={s.stem} stroke={c.stem} strokeWidth={3.5} fill="none" strokeLinecap="round" />
              {s.leaves.map((leaf, i) => (
                <Path key={`s3-leaf-${i}`} d={leaf} fill={c.leaf} opacity={0.75} />
              ))}
              <Path d={s.bud} fill={c.flower} opacity={0.6} />
            </>
          );
        })()}

        {/* ── Stage 4: Full Bloom ── */}
        {growthStage >= 4 && (() => {
          const s = SPROUT_STAGES[4];
          return (
            <>
              <Path d={s.stem} stroke={c.stem} strokeWidth={4} fill="none" strokeLinecap="round" />
              {s.leaves.map((leaf, i) => (
                <Path key={`s4-leaf-${i}`} d={leaf} fill={c.leaf} opacity={0.7} />
              ))}
              {s.flower.petals.map((petal, i) => (
                <Path key={`petal-${i}`} d={petal} fill={c.flower} opacity={0.85} />
              ))}
              <Circle
                cx={s.flower.center.cx}
                cy={s.flower.center.cy}
                r={s.flower.center.r}
                fill="#f0c674"
              />
            </>
          );
        })()}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

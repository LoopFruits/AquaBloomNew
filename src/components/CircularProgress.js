import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';
import { COLORS } from '../config/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({ progress, size = 220, strokeWidth = 10 }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference - withTiming(progress, { duration: 800 }) * circumference;
    return {
      strokeDashoffset: offset,
    };
  });

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: '-90deg' }] }}
    >
      <Defs>
        <LinearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={COLORS.teal} />
          <Stop offset="50%" stopColor={COLORS.lavender} />
          <Stop offset="100%" stopColor={COLORS.rose} />
        </LinearGradient>
      </Defs>
      {/* Background track */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(126,200,200,0.15)"
        strokeWidth={strokeWidth}
      />
      {/* Animated fill */}
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#progress-gradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        strokeLinecap="round"
      />
    </Svg>
  );
}

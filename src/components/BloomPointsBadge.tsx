import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const TEAL = '#7ec8c8';
const GOLD = '#f0c674';

interface BloomPointsBadgeProps {
  /** Points just earned (triggers pop-in animation when > 0) */
  pointsEarned: number;
  /** Lifetime total bloom points */
  totalPoints: number;
  /** Points earned today */
  todayPoints: number;
}

/**
 * Animated badge that pops in briefly when points are earned,
 * plus a persistent display of today's total and lifetime total.
 */
export default function BloomPointsBadge({
  pointsEarned,
  totalPoints,
  todayPoints,
}: BloomPointsBadgeProps) {
  const popAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (pointsEarned > 0) {
      // Pop-in animation
      popAnim.setValue(1);
      translateY.setValue(0);

      Animated.sequence([
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(popAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [pointsEarned, todayPoints]); // Re-trigger when todayPoints changes

  return (
    <View style={styles.container}>
      {/* Persistent total display */}
      <View style={styles.totalRow}>
        <Text style={styles.flowerEmoji}>🌸</Text>
        <Text style={styles.todayText}>{todayPoints} today</Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.totalText}>{totalPoints.toLocaleString()} total</Text>
      </View>

      {/* Animated pop-in for points just earned */}
      {pointsEarned > 0 && (
        <Animated.View
          style={[
            styles.popup,
            {
              opacity: popAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.popupText}>+{pointsEarned} 🌸</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(126,200,200,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(126,200,200,0.1)',
  },
  flowerEmoji: {
    fontSize: 12,
  },
  todayText: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: TEAL,
  },
  separator: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  totalText: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  popup: {
    position: 'absolute',
    top: -28,
    backgroundColor: 'rgba(240,198,116,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(240,198,116,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  popupText: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: GOLD,
  },
});

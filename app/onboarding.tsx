import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAnalytics } from '../src/hooks/useAnalytics';
import { ONBOARDING_SLIDES, STORAGE_KEYS } from '../src/config/constants';

const { width: SW } = Dimensions.get('window');
const TEAL = '#7ec8c8';
const LAVENDER = '#c4a7d7';

export default function OnboardingScreen() {
  const [idx, setIdx] = useState(0);
  const ref = useRef<FlatList>(null);
  const router = useRouter();
  const { track, EVENTS } = useAnalytics();

  useEffect(() => {
    track(EVENTS.ONBOARDING_STARTED);
  }, []);

  const finish = async () => {
    track(EVENTS.ONBOARDING_COMPLETED, { slides_viewed: idx + 1 });
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    router.replace('/(tabs)');
  };

  const next = () => {
    if (idx < ONBOARDING_SLIDES.length - 1) {
      const nextIdx = idx + 1;
      track(EVENTS.ONBOARDING_SLIDE_VIEWED, { slide_index: nextIdx, slide_title: ONBOARDING_SLIDES[nextIdx].title });
      ref.current?.scrollToIndex({ index: nextIdx });
      setIdx(nextIdx);
    } else finish();
  };

  const isLast = idx === ONBOARDING_SLIDES.length - 1;

  return (
    <LinearGradient colors={['#0d1117', '#151b26', '#1a1525']} style={s.container}>
      {!isLast && (
        <TouchableOpacity onPress={() => { track(EVENTS.ONBOARDING_SKIPPED, { skipped_at_slide: idx }); finish(); }} style={s.skip}>
          <Text style={s.skipTxt}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={ref}
        data={ONBOARDING_SLIDES}
        horizontal pagingEnabled scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={s.slide}>
            <Text style={{ fontSize: 72, marginBottom: 32 }}>{item.emoji}</Text>
            <Text style={s.slideTitle}>{item.title}</Text>
            <Text style={s.slideSub}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={s.bottom}>
        <View style={s.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View key={i} style={[s.dot, i === idx ? s.dotActive : s.dotInactive]} />
          ))}
        </View>
        <TouchableOpacity onPress={next} activeOpacity={0.8}>
          <LinearGradient colors={[TEAL, LAVENDER]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btn}>
            <Text style={s.btnTxt}>{isLast ? 'Get Started' : 'Next'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  skip: { position: 'absolute', top: 60, right: 24, zIndex: 10, padding: 8 },
  skipTxt: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  slide: { width: SW, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  slideTitle: { fontSize: 30, fontWeight: '300', color: '#e8eaed', textAlign: 'center', letterSpacing: 0.5, marginBottom: 16 },
  slideSub: { fontSize: 16, color: '#9ba3af', textAlign: 'center', lineHeight: 24 },
  bottom: { paddingBottom: 50, paddingHorizontal: 40, alignItems: 'center', gap: 32 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: TEAL, opacity: 1 },
  dotInactive: { width: 8, backgroundColor: TEAL, opacity: 0.3 },
  btn: { width: SW - 80, paddingVertical: 16, borderRadius: 24, alignItems: 'center' },
  btnTxt: { fontSize: 16, fontWeight: '600', color: '#fff', letterSpacing: 0.5 },
});

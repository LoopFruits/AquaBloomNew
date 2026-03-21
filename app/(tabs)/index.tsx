import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Pressable, Dimensions, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop, Path, Rect, ClipPath } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useHydration } from '../../src/hooks/useHydration';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { usePremium } from '../../src/hooks/usePremium';
import { useGamification } from '../../src/hooks/useGamification';
import { QUICK_ADD_OPTIONS } from '../../src/config/constants';
import { BLOOM_POINTS } from '../../src/config/gamification';
import AdBanner from '../../src/components/AdBanner';
import PlantCompanion from '../../src/components/PlantCompanion';
import BloomPointsBadge from '../../src/components/BloomPointsBadge';
import { useInterstitialAd } from '../../src/hooks/useInterstitialAd';

const { width: SW } = Dimensions.get('window');
const TEAL = '#7ec8c8';
const LAVENDER = '#c4a7d7';
const ROSE = '#f0a6b9';

// Inline WaterDrop for simplicity
function WaterDrop({ size = 60, fill = 0 }: { size?: number; fill?: number }) {
  const h = size * 1.3;
  const wy = 78 - 70 * fill;
  return (
    <Svg width={size} height={h} viewBox="0 0 60 78" fill="none">
      <Defs>
        <ClipPath id="dc">
          <Path d="M30 4C30 4 4 35 4 52C4 66.4 15.6 74 30 74C44.4 74 56 66.4 56 52C56 35 30 4 30 4Z" />
        </ClipPath>
      </Defs>
      <Path d="M30 4C30 4 4 35 4 52C4 66.4 15.6 74 30 74C44.4 74 56 66.4 56 52C56 35 30 4 30 4Z"
        fill="rgba(126,200,200,0.12)" stroke={TEAL} strokeWidth={2} />
      <Rect clipPath="url(#dc)" x={0} y={wy} width={60} height={78} fill={TEAL} opacity={0.35} />
      <Rect clipPath="url(#dc)" x={-5} y={wy + 4} width={70} height={78} fill={TEAL} opacity={0.2} />
    </Svg>
  );
}

function ProgressRing({ progress, size = 220, stroke = 10 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;
  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Defs>
        <SvgGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={TEAL} />
          <Stop offset="50%" stopColor={LAVENDER} />
          <Stop offset="100%" stopColor={ROSE} />
        </SvgGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(126,200,200,0.15)" strokeWidth={stroke} />
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#pg)"
        strokeWidth={stroke} strokeDasharray={`${circ}`} strokeDashoffset={offset} strokeLinecap="round" />
    </Svg>
  );
}

export default function HomeScreen() {
  const hydration = useHydration();
  const {
    intake, goal, progress, percentage, glassesLeft, mlRemaining,
    log, currentAffirmation, goalReached, streak, addWater, undoLast,
  } = hydration;
  const router = useRouter();
  const { track, setUserProperty, EVENTS, PROPERTIES } = useAnalytics();
  const { isPremium } = usePremium();
  const { showIfReady: showInterstitial } = useInterstitialAd(isPremium);
  const gamification = useGamification();
  const { bloomPoints, plantState, addBloomPoints, updatePlantGrowth } = gamification;
  const [customMl, setCustomMl] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  const handleAdd = useCallback((ml: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addWater(ml);
    track(EVENTS.WATER_ADDED, { ml, source: 'quick_add', total_intake: intake + ml });

    // ── Gamification: earn Bloom Points ──
    const basePoints = BLOOM_POINTS.PER_SIP;
    addBloomPoints(basePoints, 'sip', streak);
    updatePlantGrowth(intake + ml, goal);
    setLastPointsEarned(basePoints + (streak >= BLOOM_POINTS.STREAK_BONUS_THRESHOLD ? BLOOM_POINTS.STREAK_BONUS_PER_SIP : 0));

    if (intake + ml >= goal && !goalReached) {
      track(EVENTS.DAILY_GOAL_REACHED, { goal, total_intake: intake + ml, sips: log.length + 1 });
      addBloomPoints(BLOOM_POINTS.GOAL_REACHED, 'goal_reached', streak);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    // Maybe show an interstitial ad (respects frequency & cooldown)
    showInterstitial();
  }, [intake, goal, goalReached, streak, addWater, log.length, track, showInterstitial, addBloomPoints, updatePlantGrowth]);

  const handleCustom = useCallback(() => {
    const val = parseInt(customMl, 10);
    if (val > 0 && val <= 2000) {
      track(EVENTS.CUSTOM_AMOUNT_ADDED, { ml: val });
      handleAdd(val);
      setCustomMl('');
    }
  }, [customMl, handleAdd, track]);

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>AquaBloom</Text>
            <Text style={s.subtitle}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <WaterDrop size={32} fill={progress} />
        </View>

        {/* Bloom Points Badge */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <BloomPointsBadge
            pointsEarned={lastPointsEarned}
            totalPoints={bloomPoints.total}
            todayPoints={bloomPoints.todayEarned}
          />
        </View>

        {/* Progress Ring with Plant Inside */}
        <View style={s.ringWrap}>
          <ProgressRing progress={progress} />
          <View style={s.ringCenter}>
            <PlantCompanion growthStage={plantState.growthStage} size={100} />
          </View>
        </View>

        {/* Stats below ring */}
        <View style={s.ringStats}>
          <Text style={s.pct}>{percentage}%</Text>
          <Text style={s.ml}>{intake} ml <Text style={s.goalTxt}>of {goal} ml</Text></Text>
        </View>

        <Text style={s.affirmation}>{currentAffirmation}</Text>

        {/* Status */}
        <View style={s.statusCard}>
          <View style={s.statusItem}><Text style={s.statusVal}>{glassesLeft}</Text><Text style={s.statusLbl}>glasses left</Text></View>
          <View style={s.divider} />
          <View style={s.statusItem}><Text style={s.statusVal}>{log.length}</Text><Text style={s.statusLbl}>sips today</Text></View>
          <View style={s.divider} />
          <View style={s.statusItem}><Text style={s.statusVal}>{mlRemaining}</Text><Text style={s.statusLbl}>ml to go</Text></View>
        </View>

        {/* Quick Add */}
        <Text style={s.section}>QUICK ADD</Text>
        <View style={s.grid}>
          {QUICK_ADD_OPTIONS.map((item) => (
            <Pressable key={item.ml} onPress={() => handleAdd(item.ml)}
              style={({ pressed }) => [s.qBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}>
              <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
              <Text style={s.qLabel}>{item.label}</Text>
              <Text style={s.qMl}>{item.ml} ml</Text>
            </Pressable>
          ))}
        </View>

        {/* Custom */}
        <View style={s.customRow}>
          <TextInput style={s.input} placeholder="Custom ml..." placeholderTextColor="#6b7280"
            keyboardType="number-pad" value={customMl} onChangeText={setCustomMl} maxLength={4} />
          <TouchableOpacity onPress={handleCustom} style={s.addBtn}>
            <Text style={s.addBtnTxt}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {log.length > 0 && (
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); track(EVENTS.WATER_UNDONE, { ml: (log[0] as any).ml }); undoLast(); }} style={s.undo}>
            <Text style={s.undoTxt}>↩ Undo last ({(log[0] as any).ml} ml)</Text>
          </TouchableOpacity>
        )}

        {/* Premium upsell — only show for free users */}
        {!isPremium && <TouchableOpacity onPress={() => { track(EVENTS.UPGRADE_BANNER_TAPPED, { source: 'home' }); router.push('/paywall'); }} style={s.premBanner}>
          <LinearGradient colors={['rgba(240,198,116,0.08)', 'rgba(196,167,215,0.08)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.premGrad}>
            <Text style={{ fontSize: 24 }}>✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.premTitle}>Unlock AquaBloom Premium</Text>
              <Text style={s.premSub}>Plant collection, analytics, streak freeze & more</Text>
            </View>
            <Text style={{ fontSize: 18, color: '#f0c674' }}>→</Text>
          </LinearGradient>
        </TouchableOpacity>}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Banner ad — hidden for premium users */}
      <AdBanner isPremium={isPremium} />

      {/* Celebration */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={s.celOverlay}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 64 }}>🎉</Text>
            <Text style={s.celTitle}>Goal Reached!</Text>
            <Text style={s.celSub}>+{BLOOM_POINTS.GOAL_REACHED} Bloom Points earned! 🌸</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  scroll: { paddingHorizontal: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 12 },
  title: { fontSize: 28, fontFamily: 'Cormorant-Light', color: TEAL, letterSpacing: 1 },
  subtitle: { fontSize: 12, fontFamily: 'Nunito-Regular', color: '#6b7280', marginTop: 2 },
  ringWrap: { alignItems: 'center', paddingVertical: 12, position: 'relative' },
  ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ringStats: { alignItems: 'center', marginTop: -4, marginBottom: 4 },
  pct: { fontSize: 36, fontFamily: 'Cormorant-Light', color: '#e8eaed' },
  ml: { fontSize: 13, fontFamily: 'Nunito-SemiBold', color: TEAL, marginTop: 2 },
  goalTxt: { fontSize: 11, fontFamily: 'Nunito-Regular', color: '#6b7280' },
  affirmation: { textAlign: 'center', fontSize: 14, fontFamily: 'Nunito-Light', color: LAVENDER, fontStyle: 'italic', marginVertical: 12, lineHeight: 22 },
  statusCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(126,200,200,0.04)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16, paddingVertical: 14, marginBottom: 24 },
  statusItem: { alignItems: 'center', gap: 2 },
  statusVal: { fontSize: 24, fontFamily: 'Cormorant-Light', color: '#e8eaed' },
  statusLbl: { fontSize: 10, fontFamily: 'Nunito-Regular', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.8 },
  divider: { width: 1, height: 32, backgroundColor: 'rgba(126,200,200,0.1)' },
  section: { fontSize: 11, fontFamily: 'Nunito-SemiBold', color: '#9ba3af', letterSpacing: 1.5, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  qBtn: { width: (SW - 48 - 10) / 2, alignItems: 'center', gap: 4, paddingVertical: 14, backgroundColor: 'rgba(126,200,200,0.05)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16 },
  qLabel: { fontSize: 13, fontFamily: 'Nunito-Medium', color: '#e8eaed' },
  qMl: { fontSize: 11, fontFamily: 'Nunito-SemiBold', color: TEAL },
  customRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'rgba(126,200,200,0.05)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 12, color: '#e8eaed', fontSize: 14, fontFamily: 'Nunito-Regular' },
  addBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(126,200,200,0.12)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.15)', borderRadius: 12, justifyContent: 'center' },
  addBtnTxt: { fontSize: 14, fontFamily: 'Nunito-SemiBold', color: TEAL },
  undo: { alignItems: 'center', paddingVertical: 10 },
  undoTxt: { fontSize: 12, fontFamily: 'Nunito-Regular', color: '#6b7280' },
  premBanner: { marginTop: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(240,198,116,0.15)' },
  premGrad: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  premTitle: { fontSize: 14, fontFamily: 'Nunito-SemiBold', color: '#f0c674' },
  premSub: { fontSize: 12, fontFamily: 'Nunito-Regular', color: '#6b7280', marginTop: 2 },
  celOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  celTitle: { fontSize: 32, fontFamily: 'Cormorant-Light', color: '#fff', marginTop: 12 },
  celSub: { fontSize: 14, fontFamily: 'Nunito-Regular', color: 'rgba(255,255,255,0.8)', marginTop: 8 },
});

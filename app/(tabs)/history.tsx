import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useHydration } from '../../src/hooks/useHydration';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { usePremium } from '../../src/hooks/usePremium';

const TEAL = '#7ec8c8';
const GOLD = '#f0c674';

export default function HistoryScreen() {
  const { intake, log, goal, percentage, streak, resetDay } = useHydration();
  const router = useRouter();
  const { track, EVENTS } = useAnalytics();
  const { isPremium } = usePremium();

  const handleReset = () => {
    track(EVENTS.DAY_RESET, { intake_before_reset: intake, sips_before_reset: log.length });
    resetDay();
  };

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.title}>History</Text>
            <Text style={s.subtitle}>Your hydration journey</Text>
          </View>
          {log.length > 0 && (
            <TouchableOpacity onPress={handleReset} style={s.resetBtn}>
              <Text style={s.resetTxt}>Reset Day</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Streak */}
        <View style={s.streakCard}>
          <Text style={{ fontSize: 28 }}>🔥</Text>
          <View>
            <Text style={s.streakVal}>{streak} Day Streak</Text>
            <Text style={s.streakLbl}>{streak === 0 ? 'Hit your goal today to start a streak!' : 'Keep it going, beautiful!'}</Text>
          </View>
        </View>

        <Text style={s.section}>TODAY'S LOG</Text>

        {log.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 40 }}>🌱</Text>
            <Text style={s.emptyTxt}>No sips yet today. Start hydrating!</Text>
          </View>
        ) : (
          <View>
            {log.map((entry: any, i: number) => (
              <View key={entry.id} style={s.logItem}>
                <View style={s.dot} />
                {i < log.length - 1 && <View style={s.line} />}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={s.logMl}>{entry.ml} ml</Text>
                    <Text style={s.logTime}>{entry.time}</Text>
                  </View>
                  <View style={s.bar}><View style={[s.barFill, { width: `${Math.min((entry.ml / 500) * 100, 100)}%` }]} /></View>
                </View>
              </View>
            ))}
          </View>
        )}

        {log.length > 0 && (
          <View style={s.summary}>
            <Text style={s.summaryTitle}>DAILY SUMMARY</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
              <View style={{ alignItems: 'center' }}><Text style={s.sumVal}>{intake} ml</Text><Text style={s.sumLbl}>Total</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={s.sumVal}>{Math.round(intake / log.length)}</Text><Text style={s.sumLbl}>Avg per sip</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={s.sumVal}>{percentage}%</Text><Text style={s.sumLbl}>of Goal</Text></View>
            </View>
          </View>
        )}

        {/* Premium upsell — only show for free users */}
        {!isPremium && <TouchableOpacity onPress={() => router.push('/paywall')} style={s.premCard}>
          <Text style={{ fontSize: 24 }}>📊</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.premTitle}>Weekly & Monthly Trends</Text>
            <Text style={s.premSub}>Upgrade to Premium for charts, patterns, and insights</Text>
          </View>
          <Text style={{ fontSize: 18, color: GOLD }}>→</Text>
        </TouchableOpacity>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  scroll: { paddingHorizontal: 24, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '300', color: TEAL, letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  resetBtn: { borderWidth: 1, borderColor: 'rgba(240,166,185,0.2)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, marginTop: 4 },
  resetTxt: { fontSize: 11, color: '#f0a6b9' },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(126,200,200,0.04)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16, padding: 16, marginBottom: 24 },
  streakVal: { fontSize: 20, fontWeight: '300', color: '#e8eaed' },
  streakLbl: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  section: { fontSize: 13, fontWeight: '600', color: '#9ba3af', letterSpacing: 1.2, marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTxt: { color: '#9ba3af', marginTop: 12, fontSize: 14 },
  logItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 10, position: 'relative' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: TEAL, marginTop: 5, zIndex: 1 },
  line: { position: 'absolute', left: 4, top: 18, bottom: -10, width: 2, backgroundColor: 'rgba(126,200,200,0.08)' },
  logMl: { fontSize: 15, fontWeight: '600', color: '#e8eaed' },
  logTime: { fontSize: 12, color: '#6b7280' },
  bar: { height: 4, backgroundColor: 'rgba(126,200,200,0.08)', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: TEAL, borderRadius: 2 },
  summary: { backgroundColor: 'rgba(126,200,200,0.04)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16, padding: 18, marginTop: 20 },
  summaryTitle: { fontSize: 12, fontWeight: '600', color: '#9ba3af', letterSpacing: 1, textAlign: 'center' },
  sumVal: { fontSize: 22, fontWeight: '300', color: '#e8eaed' },
  sumLbl: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  premCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(240,198,116,0.06)', borderWidth: 1, borderColor: 'rgba(240,198,116,0.15)', borderRadius: 16, padding: 16, marginTop: 20 },
  premTitle: { fontSize: 14, fontWeight: '600', color: GOLD },
  premSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
});

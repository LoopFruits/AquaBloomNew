import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useHydration } from '../../src/hooks/useHydration';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { usePremium } from '../../src/hooks/usePremium';

const TEAL = '#7ec8c8';
const GOLD = '#f0c674';

export default function SettingsScreen() {
  const { goal, updateGoal, streak } = useHydration();
  const router = useRouter();
  const { track, setUserProperty, EVENTS, PROPERTIES } = useAnalytics();
  const { isPremium, restorePurchases, presentCustomerCenter } = usePremium();
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(goal.toString());

  const saveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (val >= 500 && val <= 5000) {
      track(EVENTS.GOAL_UPDATED, { old_goal: goal, new_goal: val });
      setUserProperty({ [PROPERTIES.DAILY_GOAL]: val });
      updateGoal(val);
      setEditing(false);
    }
    else Alert.alert('Invalid Goal', 'Please enter a value between 500 and 5000 ml');
  };

  // Build sections dynamically based on premium status
  const subscriptionItems = isPremium
    ? [
        {
          emoji: '👑',
          label: 'AquaBloom Pro',
          value: 'Active',
          action: () => presentCustomerCenter(),
          highlight: true,
          isPro: true,
        },
        {
          emoji: '⚙️',
          label: 'Manage Subscription',
          value: 'Change plan, cancel, or get help',
          action: () => presentCustomerCenter(),
        },
      ]
    : [
        {
          emoji: '✨',
          label: 'Upgrade to Premium',
          value: 'Unlock all features',
          action: () => router.push('/paywall'),
          highlight: true,
        },
        {
          emoji: '🔄',
          label: 'Restore Purchases',
          value: '',
          action: () => restorePurchases(),
        },
      ];

  const sections = [
    {
      title: 'HYDRATION', items: [
        { emoji: '🎯', label: 'Daily Goal', value: `${goal} ml`, action: () => setEditing(true) },
        { emoji: '📏', label: 'Unit', value: 'Milliliters (ml)', badge: isPremium ? undefined : 'PRO' },
      ]
    },
    {
      title: 'SUBSCRIPTION',
      items: subscriptionItems,
    },
    {
      title: 'ABOUT', items: [
        { emoji: '⭐', label: 'Rate AquaBloom', value: 'We appreciate your support!', action: () => {} },
        { emoji: '🔒', label: 'Privacy Policy', value: '', action: () => Linking.openURL('https://aquabloom.app/privacy') },
        { emoji: '📄', label: 'Terms of Service', value: '', action: () => Linking.openURL('https://aquabloom.app/terms') },
        { emoji: '📱', label: 'Version', value: '1.0.0' },
      ]
    },
  ];

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Settings</Text>
          <Text style={s.subtitle}>Personalize your experience</Text>
        </View>

        {/* Premium badge at top if subscribed */}
        {isPremium && (
          <View style={s.proBanner}>
            <Text style={{ fontSize: 20 }}>👑</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.proBannerTitle}>AquaBloom Pro</Text>
              <Text style={s.proBannerSub}>Thank you for your support!</Text>
            </View>
          </View>
        )}

        {editing && (
          <View style={s.editor}>
            <Text style={s.editorTitle}>Set Daily Goal (ml)</Text>
            <TextInput style={s.goalInput} keyboardType="number-pad" value={goalInput}
              onChangeText={setGoalInput} maxLength={4} autoFocus />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
              {[1500, 2000, 2500, 3000].map(p => (
                <TouchableOpacity key={p} onPress={() => setGoalInput(p.toString())}
                  style={[s.preset, goalInput === p.toString() && s.presetActive]}>
                  <Text style={[s.presetTxt, goalInput === p.toString() && { color: TEAL }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
              <TouchableOpacity onPress={() => { setEditing(false); setGoalInput(goal.toString()); }}>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveGoal} style={s.saveBtn}>
                <Text style={{ color: TEAL, fontWeight: '600', fontSize: 14 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {sections.map(sec => (
          <View key={sec.title} style={{ marginBottom: 24 }}>
            <Text style={s.secTitle}>{sec.title}</Text>
            <View style={s.card}>
              {sec.items.map((item: any, i: number) => (
                <TouchableOpacity key={item.label} onPress={item.action} disabled={!item.action}
                  style={[s.row, i < sec.items.length - 1 && s.rowBorder, item.highlight && s.rowHL]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                    <View>
                      <Text style={[s.rowLabel, item.highlight && { color: item.isPro ? TEAL : GOLD }]}>{item.label}</Text>
                      {item.value ? <Text style={s.rowVal}>{item.value}</Text> : null}
                    </View>
                  </View>
                  {item.action && <Text style={{ fontSize: 22, color: '#6b7280' }}>›</Text>}
                  {item.badge && (
                    <View style={s.badge}><Text style={s.badgeTxt}>{item.badge}</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={s.footer}>Made with 💕 for women who glow{'\n'}AquaBloom © 2026</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  scroll: { paddingHorizontal: 24, paddingBottom: 100 },
  header: { paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '300', color: '#7ec8c8', letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  proBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(126,200,200,0.06)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.15)', borderRadius: 16, padding: 16, marginBottom: 20 },
  proBannerTitle: { fontSize: 16, fontWeight: '600', color: TEAL },
  proBannerSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  editor: { backgroundColor: 'rgba(126,200,200,0.04)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16, padding: 20, marginBottom: 20 },
  editorTitle: { fontSize: 14, fontWeight: '600', color: '#e8eaed', marginBottom: 12 },
  goalInput: { backgroundColor: 'rgba(126,200,200,0.08)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.15)', borderRadius: 12, padding: 12, fontSize: 24, fontWeight: '600', color: TEAL, textAlign: 'center' },
  preset: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)' },
  presetActive: { borderColor: TEAL, backgroundColor: 'rgba(126,200,200,0.1)' },
  presetTxt: { fontSize: 13, color: '#6b7280' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(126,200,200,0.15)', borderRadius: 8 },
  secTitle: { fontSize: 12, fontWeight: '600', color: '#9ba3af', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: 'rgba(126,200,200,0.04)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(126,200,200,0.08)' },
  rowHL: { backgroundColor: 'rgba(240,198,116,0.06)' },
  rowLabel: { fontSize: 14, fontWeight: '500', color: '#e8eaed' },
  rowVal: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  badge: { backgroundColor: 'rgba(240,198,116,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeTxt: { fontSize: 9, fontWeight: '700', color: GOLD, letterSpacing: 1 },
  footer: { fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 20, marginTop: 16 },
});

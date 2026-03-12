import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNotifications } from '../../src/hooks/useNotifications';
import { useAnalytics } from '../../src/hooks/useAnalytics';

const TEAL = '#7ec8c8';
const ROSE = '#f0a6b9';

export default function RemindersScreen() {
  const { reminders, toggleReminder, hasPermission, requestPermission } = useNotifications();
  const { track, EVENTS } = useAnalytics();

  const handleToggle = (index: number) => {
    const reminder = reminders[index];
    track(EVENTS.REMINDER_TOGGLED, {
      reminder_label: reminder.label,
      reminder_time: reminder.time,
      new_state: !reminder.active,
    });
    toggleReminder(index);
  };

  const handleRequestPermission = async () => {
    track(EVENTS.NOTIFICATIONS_PERMISSION_REQUESTED);
    await requestPermission();
    track(EVENTS.NOTIFICATIONS_PERMISSION_GRANTED);
  };

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Reminders</Text>
          <Text style={s.subtitle}>Gentle nudges throughout your day</Text>
        </View>

        {!hasPermission && (
          <TouchableOpacity onPress={handleRequestPermission} style={s.permBanner}>
            <Text style={{ fontSize: 24 }}>🔔</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.permTitle}>Enable Notifications</Text>
              <Text style={s.permText}>Tap here to allow AquaBloom to send you hydration reminders</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={{ gap: 2 }}>
          {reminders.map((r, i) => (
            <View key={r.id} style={s.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 20 }}>{r.emoji}</Text>
                <View>
                  <Text style={s.label}>{r.label}</Text>
                  <Text style={s.time}>{r.time}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleToggle(i)} activeOpacity={0.8}>
                <View style={[s.track, { backgroundColor: r.active ? TEAL : 'rgba(200,200,200,0.3)' }]}>
                  <View style={[s.thumb, { transform: [{ translateX: r.active ? 20 : 2 }] }]} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={s.note}>
          <Text style={{ fontSize: 16 }}>💡</Text>
          <Text style={s.noteText}>
            Reminders are sent as push notifications even when the app is closed. Toggle them to match your daily rhythm.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  scroll: { paddingHorizontal: 24, paddingBottom: 100 },
  header: { paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '300', color: TEAL, letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  permBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(240,166,185,0.08)', borderWidth: 1, borderColor: 'rgba(240,166,185,0.15)', borderRadius: 16, padding: 16, marginBottom: 20 },
  permTitle: { fontSize: 14, fontWeight: '600', color: ROSE },
  permText: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#e8eaed' },
  time: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  track: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center' },
  thumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(126,200,200,0.04)', borderRadius: 12, padding: 14, marginTop: 20 },
  noteText: { flex: 1, fontSize: 12, color: '#9ba3af', lineHeight: 18 },
});

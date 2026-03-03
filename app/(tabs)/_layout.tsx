import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAnalytics } from '../../src/hooks/useAnalytics';

const TEAL = '#7ec8c8';
const MUTED = '#9ba3af';

export default function TabLayout() {
  const { track, EVENTS } = useAnalytics();

  return (
    <Tabs
      screenListeners={{
        tabPress: (e) => {
          track(EVENTS.TAB_SWITCHED, { tab: e.target?.split('-')[0] || 'unknown' });
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: TEAL,
        tabBarInactiveTintColor: MUTED,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hydrate',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>💧</Text>
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>🔔</Text>
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>📊</Text>
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>⚙️</Text>
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(18,22,30,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(126,200,200,0.06)',
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
  },
  tabLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  iconWrap: {
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: TEAL,
  },
});

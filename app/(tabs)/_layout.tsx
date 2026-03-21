import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnalytics } from '../../src/hooks/useAnalytics';

const TEAL = '#7ec8c8';
const MUTED = '#6b7280';

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
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'water' : 'water-outline'} size={22} color={color} />
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color={color} />
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={22} color={color} />
              {focused && <View style={styles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} color={color} />
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
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: TEAL,
  },
});

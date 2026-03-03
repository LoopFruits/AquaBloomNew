import { useState, useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_REMINDERS, NOTIFICATION_MESSAGES } from '../config/constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [hasPermission, setHasPermission] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    loadReminders();
    registerForPushNotifications();

    // Listen for notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Handle foreground notification
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // Handle notification tap — navigate to app
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setHasPermission(finalStatus === 'granted');

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('hydration-reminders', {
          name: 'Hydration Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#7ec8c8',
          sound: 'default',
        });
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
    }
  };

  const loadReminders = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (saved) {
        setReminders(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load reminders:', e);
    }
  };

  const scheduleAllReminders = useCallback(async (reminderList) => {
    try {
      // Cancel all existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const activeReminders = reminderList.filter((r) => r.active);

      for (const reminder of activeReminders) {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const randomMsg =
          NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];

        await Notifications.scheduleNotificationAsync({
          content: {
            title: randomMsg.title,
            body: randomMsg.body,
            data: { reminderId: reminder.id },
            ...(Platform.OS === 'android' && { channelId: 'hydration-reminders' }),
          },
          trigger: {
            type: 'daily',
            hour: hours,
            minute: minutes,
            repeats: true,
          },
        });
      }
    } catch (e) {
      console.warn('Failed to schedule reminders:', e);
    }
  }, []);

  const toggleReminder = useCallback(
    async (index) => {
      const updated = reminders.map((r, i) =>
        i === index ? { ...r, active: !r.active } : r
      );
      setReminders(updated);

      try {
        await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
        await scheduleAllReminders(updated);
      } catch (e) {
        console.warn('Failed to save reminder toggle:', e);
      }
    },
    [reminders, scheduleAllReminders]
  );

  const updateReminderTime = useCallback(
    async (index, newTime) => {
      const updated = reminders.map((r, i) =>
        i === index ? { ...r, time: newTime } : r
      );
      setReminders(updated);

      try {
        await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
        await scheduleAllReminders(updated);
      } catch (e) {
        console.warn('Failed to update reminder time:', e);
      }
    },
    [reminders, scheduleAllReminders]
  );

  return {
    reminders,
    hasPermission,
    toggleReminder,
    updateReminderTime,
    scheduleAllReminders,
    requestPermission: registerForPushNotifications,
  };
}

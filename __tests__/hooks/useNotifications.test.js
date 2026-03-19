import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useNotifications } from '../../src/hooks/useNotifications';
import { STORAGE_KEYS, DEFAULT_REMINDERS } from '../../src/config/constants';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  addNotificationReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addNotificationResponseReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('mock-id'),
  AndroidImportance: { HIGH: 4 },
}));

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  // Re-apply default mock implementations after clearAllMocks
  Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
  Notifications.addNotificationReceivedListener.mockReturnValue({ remove: jest.fn() });
  Notifications.addNotificationResponseReceivedListener.mockReturnValue({ remove: jest.fn() });
  Notifications.cancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);
  Notifications.scheduleNotificationAsync.mockResolvedValue('mock-id');
});

describe('useNotifications — initial state', () => {
  it('loads DEFAULT_REMINDERS when none saved', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expect(result.current.reminders).toEqual(DEFAULT_REMINDERS);
  });

  it('sets hasPermission true when permission already granted', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expect(result.current.hasPermission).toBe(true);
  });

  it('sets hasPermission false when permission denied', async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' });
    Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expect(result.current.hasPermission).toBe(false);
  });
});

describe('useNotifications — toggleReminder', () => {
  it('toggles a reminder from active to inactive', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    const firstActive = result.current.reminders[0].active;
    await act(async () => { await result.current.toggleReminder(0); });

    expect(result.current.reminders[0].active).toBe(!firstActive);
  });

  it('persists toggle state to AsyncStorage', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => { await result.current.toggleReminder(0); });

    const stored = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    const parsed = JSON.parse(stored);
    expect(parsed[0].active).toBe(!DEFAULT_REMINDERS[0].active);
  });

  it('reschedules notifications after toggle', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => { await result.current.toggleReminder(0); });

    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });
});

describe('useNotifications — updateReminderTime', () => {
  it('updates the time of a specific reminder', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => { await result.current.updateReminderTime(0, '08:30'); });
    expect(result.current.reminders[0].time).toBe('08:30');
  });

  it('persists new time to AsyncStorage', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => { await result.current.updateReminderTime(1, '10:15'); });

    const stored = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    const parsed = JSON.parse(stored);
    expect(parsed[1].time).toBe('10:15');
  });

  it('does not affect other reminders', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => { await result.current.updateReminderTime(0, '08:30'); });

    expect(result.current.reminders[1].time).toBe(DEFAULT_REMINDERS[1].time);
  });

  it('reschedules notifications after time update', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => { await result.current.updateReminderTime(0, '06:00'); });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });
});

describe('useNotifications — scheduleAllReminders', () => {
  it('only schedules active reminders', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    const activeCount = DEFAULT_REMINDERS.filter((r) => r.active).length;
    await act(async () => {
      await result.current.scheduleAllReminders(DEFAULT_REMINDERS);
    });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(activeCount);
  });

  it('cancels all existing notifications first', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    await act(async () => {
      await result.current.scheduleAllReminders(DEFAULT_REMINDERS);
    });

    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });

  it('does not schedule any notifications when all reminders are inactive', async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    const allInactive = DEFAULT_REMINDERS.map((r) => ({ ...r, active: false }));
    Notifications.scheduleNotificationAsync.mockClear();

    await act(async () => {
      await result.current.scheduleAllReminders(allInactive);
    });

    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('useNotifications — restore from storage', () => {
  it('restores saved reminders from AsyncStorage', async () => {
    const custom = DEFAULT_REMINDERS.map((r) => ({ ...r, active: false }));
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(custom));

    const { result } = renderHook(() => useNotifications());
    await act(async () => {});

    expect(result.current.reminders.every((r) => !r.active)).toBe(true);
  });
});

describe('useNotifications — cleanup', () => {
  it('removes notification listeners on unmount', async () => {
    const removeMock = jest.fn();
    Notifications.addNotificationReceivedListener.mockReturnValue({ remove: removeMock });
    Notifications.addNotificationResponseReceivedListener.mockReturnValue({ remove: removeMock });

    const { result, unmount } = renderHook(() => useNotifications());
    await act(async () => {});

    unmount();
    expect(removeMock).toHaveBeenCalledTimes(2);
  });
});

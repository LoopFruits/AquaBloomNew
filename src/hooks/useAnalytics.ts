// ─────────────────────────────────────────────────
// useAnalytics — Simple hook for tracking events
// ─────────────────────────────────────────────────
//
// Usage:
//   const { track, identify, setUserProperty } = useAnalytics();
//   track(ANALYTICS_EVENTS.WATER_ADDED, { ml: 250 });
//

import { useCallback } from 'react';
import { usePostHogClient } from '../providers/AnalyticsProvider';
import { ANALYTICS_EVENTS, USER_PROPERTIES } from '../config/analytics';

export function useAnalytics() {
  const posthog = usePostHogClient();

  /**
   * Track an event with optional properties
   */
  const track = useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.capture(event, properties);
      } else {
        // In dev without PostHog configured, log to console
        if (__DEV__) {
          console.log(`[Analytics] ${event}`, properties || '');
        }
      }
    },
    [posthog]
  );

  /**
   * Identify a user (e.g., after they subscribe or you generate an anonymous ID)
   */
  const identify = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.identify(userId, properties);
      }
    },
    [posthog]
  );

  /**
   * Set a persistent user property (great for segmentation)
   */
  const setUserProperty = useCallback(
    (properties: Record<string, any>) => {
      if (posthog) {
        posthog.capture('$set', { $set: properties });
      }
    },
    [posthog]
  );

  /**
   * Track screen view manually (backup — PostHog auto-tracks with expo-router)
   */
  const trackScreen = useCallback(
    (screenName: string, properties?: Record<string, any>) => {
      track(ANALYTICS_EVENTS.SCREEN_VIEWED, {
        screen_name: screenName,
        ...properties,
      });
    },
    [track]
  );

  /**
   * Reset analytics (e.g., on logout or when you want a clean slate)
   */
  const reset = useCallback(() => {
    if (posthog) {
      posthog.reset();
    }
  }, [posthog]);

  return {
    track,
    identify,
    setUserProperty,
    trackScreen,
    reset,
    EVENTS: ANALYTICS_EVENTS,
    PROPERTIES: USER_PROPERTIES,
  };
}

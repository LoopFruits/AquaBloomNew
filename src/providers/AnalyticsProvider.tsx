// ─────────────────────────────────────────────────
// PostHog Analytics Provider
// Wraps the app and initializes PostHog on startup
// ─────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useRef } from 'react';
import PostHog, { PostHogProvider as PHProvider } from 'posthog-react-native';
import { POSTHOG_API_KEY, POSTHOG_HOST, ANALYTICS_EVENTS } from '../config/analytics';

// Create our own context for the PostHog client
const AnalyticsContext = createContext<PostHog | null>(null);

export function usePostHogClient(): PostHog | null {
  return useContext(AnalyticsContext);
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const clientRef = useRef<PostHog | null>(null);

  useEffect(() => {
    // Don't initialize if using placeholder key
    if (POSTHOG_API_KEY.includes('REPLACE')) {
      console.log('[Analytics] PostHog not initialized — replace POSTHOG_API_KEY in src/config/analytics.ts');
      return;
    }

    const client = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      // Flush events every 30 seconds or when 20 events queue up
      flushAt: 20,
      flushInterval: 30000,
      // Capture app lifecycle events automatically
      captureNativeAppLifecycleEvents: true,
      // Enable screen auto-tracking (works with react-navigation / expo-router)
      captureScreens: true,
    });

    clientRef.current = client;

    // Track app open
    client.capture(ANALYTICS_EVENTS.APP_OPENED);

    return () => {
      client.flush();
    };
  }, []);

  // If PostHog isn't configured yet, still render children (app works without analytics)
  if (POSTHOG_API_KEY.includes('REPLACE') || !clientRef.current) {
    return (
      <AnalyticsContext.Provider value={null}>
        {children}
      </AnalyticsContext.Provider>
    );
  }

  return (
    <PHProvider client={clientRef.current}>
      <AnalyticsContext.Provider value={clientRef.current}>
        {children}
      </AnalyticsContext.Provider>
    </PHProvider>
  );
}

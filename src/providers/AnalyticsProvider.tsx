// ─────────────────────────────────────────────────
// PostHog Analytics Provider
// Wraps the app and initializes PostHog on startup
// ─────────────────────────────────────────────────

import React, { createContext, useContext } from 'react';
import PostHog, { PostHogProvider as PHProvider } from 'posthog-react-native';
import { POSTHOG_API_KEY, POSTHOG_HOST } from '../config/analytics';

const isConfigured = Boolean(POSTHOG_API_KEY);

// Singleton PostHog client — created once at module load time so it is
// available synchronously during the first render (matches the Expo example pattern).
const posthogClient = new PostHog(POSTHOG_API_KEY || 'placeholder_key', {
  host: POSTHOG_HOST,
  // Disable analytics entirely when no key is present (dev without .env)
  disabled: !isConfigured,
  // Capture Application Installed / Opened / Backgrounded / etc. automatically
  captureNativeAppLifecycleEvents: true,
  // Screen tracking is done manually via posthog.screen() in the layout
  // Batching for battery efficiency
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  // Feature flags
  preloadFeatureFlags: true,
  // Enable verbose logging in dev
  ...((__DEV__ && isConfigured) ? { debug: true } as any : {}),
});

// Expose the raw client for components that need it (e.g. screen tracking)
export { posthogClient };

// Create our own context so useAnalytics can access the client safely
const AnalyticsContext = createContext<PostHog | null>(isConfigured ? posthogClient : null);

export function usePostHogClient(): PostHog | null {
  return useContext(AnalyticsContext);
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  if (!isConfigured) {
    if (__DEV__) {
      console.log('[Analytics] PostHog not initialized — set POSTHOG_API_KEY in .env');
    }
    return (
      <AnalyticsContext.Provider value={null}>
        {children}
      </AnalyticsContext.Provider>
    );
  }

  return (
    <PHProvider
      client={posthogClient}
      autocapture={{
        captureScreens: false, // Manual screen tracking via posthog.screen()
        captureTouches: true,
        propsToCapture: ['testID'],
      }}
    >
      <AnalyticsContext.Provider value={posthogClient}>
        {children}
      </AnalyticsContext.Provider>
    </PHProvider>
  );
}

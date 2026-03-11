// ─────────────────────────────────────────────────
// AquaBloom AdMob Configuration
// ─────────────────────────────────────────────────
//
// SETUP STEPS:
// 1. Create a Google AdMob account at https://admob.google.com
// 2. Create an App for iOS & Android
// 3. Create ad units:
//    - Banner (for bottom of Home & History screens)
//    - Interstitial (shown every 5 water logs for free users)
// 4. Copy your App IDs → app.json plugins config
// 5. Copy your ad Unit IDs → replace placeholders below
//
// IMPORTANT:
// - Test IDs are used automatically in __DEV__ mode
// - You MUST replace the App IDs in app.json before building
// - Never show real ads during development
// ─────────────────────────────────────────────────

import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// ─────────────────────────────────────────────────
// Ad Unit IDs
// ─────────────────────────────────────────────────

// Replace these with your real AdMob ad unit IDs before publishing
const PRODUCTION_AD_UNITS = {
  BANNER_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  BANNER_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  INTERSTITIAL_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  INTERSTITIAL_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
} as const;

/**
 * Returns the correct ad unit ID for the current platform.
 * In dev mode → Google's official test IDs (safe to tap).
 * In production → your real ad unit IDs.
 */
export function getBannerAdUnitId(): string {
  if (__DEV__) return TestIds.BANNER;
  return Platform.select({
    ios: PRODUCTION_AD_UNITS.BANNER_IOS,
    android: PRODUCTION_AD_UNITS.BANNER_ANDROID,
  }) ?? TestIds.BANNER;
}

export function getInterstitialAdUnitId(): string {
  if (__DEV__) return TestIds.INTERSTITIAL;
  return Platform.select({
    ios: PRODUCTION_AD_UNITS.INTERSTITIAL_IOS,
    android: PRODUCTION_AD_UNITS.INTERSTITIAL_ANDROID,
  }) ?? TestIds.INTERSTITIAL;
}

// ─────────────────────────────────────────────────
// Ad Behavior Settings
// ─────────────────────────────────────────────────

/** Show an interstitial ad after every N water logs (free users only) */
export const INTERSTITIAL_FREQUENCY = 5;

/** Minimum seconds between interstitial ads to avoid annoying users */
export const INTERSTITIAL_COOLDOWN_SECONDS = 120;

// ─────────────────────────────────────────────────
// Interstitial Ad Hook
// ─────────────────────────────────────────────────
//
// Preloads an interstitial ad and exposes a `showIfReady()` function.
// Automatically respects:
//   - Premium status (never shows ads to premium users)
//   - Frequency cap (every N water logs)
//   - Cooldown timer (no more than 1 ad per 2 minutes)
//
// Usage:
//   const { showIfReady } = useInterstitialAd();
//   handleAdd = (ml) => { addWater(ml); showIfReady(); };
// ─────────────────────────────────────────────────

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {
  getInterstitialAdUnitId,
  INTERSTITIAL_FREQUENCY,
  INTERSTITIAL_COOLDOWN_SECONDS,
} from '../config/admob';
import { useAnalytics } from './useAnalytics';

export function useInterstitialAd(isPremium: boolean) {
  const { track, EVENTS } = useAnalytics();
  const adRef = useRef<InterstitialAd | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const actionCountRef = useRef(0);
  const lastShownRef = useRef(0);

  // Create and preload an interstitial ad
  const loadAd = useCallback(() => {
    if (isPremium) return; // Never load ads for premium users

    const ad = InterstitialAd.createForAdRequest(getInterstitialAdUnitId(), {
      requestNonPersonalizedAdsOnly: true,
    });

    const onLoaded = () => setIsAdLoaded(true);
    const onClosed = () => {
      setIsAdLoaded(false);
      // Preload the next ad after this one closes
      loadAd();
    };

    ad.addAdEventListener(AdEventType.LOADED, onLoaded);
    ad.addAdEventListener(AdEventType.CLOSED, onClosed);
    ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('[AdMob] Interstitial failed to load:', error.message);
      setIsAdLoaded(false);
    });

    ad.load();
    adRef.current = ad;

    return () => {
      ad.removeAllListeners();
    };
  }, [isPremium]);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
  }, [loadAd]);

  /**
   * Call this after each trackable user action (e.g. adding water).
   * The ad only shows if:
   *  1. User is NOT premium
   *  2. Action count hits the frequency threshold
   *  3. Enough time has passed since the last interstitial
   *  4. An ad is actually loaded
   */
  const showIfReady = useCallback(() => {
    if (isPremium) return;

    actionCountRef.current += 1;

    // Haven't hit the frequency threshold yet
    if (actionCountRef.current % INTERSTITIAL_FREQUENCY !== 0) return;

    // Cooldown check
    const now = Date.now() / 1000;
    if (now - lastShownRef.current < INTERSTITIAL_COOLDOWN_SECONDS) return;

    // Show the ad if loaded
    if (isAdLoaded && adRef.current) {
      track(EVENTS.AD_IMPRESSION, { ad_type: 'interstitial', action_count: actionCountRef.current });
      adRef.current.show();
      lastShownRef.current = now;
    }
  }, [isPremium, isAdLoaded, track]);

  return { showIfReady };
}

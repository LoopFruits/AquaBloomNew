// ─────────────────────────────────────────────────
// Smart Ad Banner
// ─────────────────────────────────────────────────
// Renders an anchored adaptive banner ad at the bottom of screens.
// Automatically hidden for premium users.
// Uses test ad IDs in __DEV__ mode.
// ─────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getBannerAdUnitId } from '../config/admob';
import { useAnalytics } from '../hooks/useAnalytics';

interface AdBannerProps {
  isPremium?: boolean;
}

export default function AdBanner({ isPremium = false }: AdBannerProps) {
  const { track, EVENTS } = useAnalytics();
  const [hasError, setHasError] = useState(false);

  // Don't render for premium users or if the ad previously errored
  if (isPremium || hasError) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={getBannerAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          track(EVENTS.AD_IMPRESSION, { ad_type: 'banner' });
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdMob] Banner failed to load:', error.message);
          setHasError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
});

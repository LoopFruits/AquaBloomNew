import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../config/constants';

// ─────────────────────────────────────────────────
// Smart Ad Banner
// Only shown to non-premium users
// Uses test IDs in __DEV__ mode automatically
// ─────────────────────────────────────────────────

export default function AdBanner({ isPremium = false }) {
  if (isPremium) return null;

  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: AD_CONFIG.banner.ios,
        android: AD_CONFIG.banner.android,
      });

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.warn('Ad failed to load:', error);
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

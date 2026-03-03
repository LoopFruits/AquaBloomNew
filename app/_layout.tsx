import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AnalyticsProvider from '../src/providers/AnalyticsProvider';
import RevenueCatProvider from '../src/providers/RevenueCatProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts — wrapped in try/catch so app still works without custom fonts
        try {
          await Font.loadAsync({
            'Cormorant-Light': require('../assets/fonts/Cormorant-Light.ttf'),
            'Cormorant-Regular': require('../assets/fonts/Cormorant-Regular.ttf'),
            'Cormorant-Medium': require('../assets/fonts/Cormorant-Medium.ttf'),
            'Cormorant-SemiBold': require('../assets/fonts/Cormorant-SemiBold.ttf'),
            'Nunito-Light': require('../assets/fonts/Nunito-Light.ttf'),
            'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
            'Nunito-Medium': require('../assets/fonts/Nunito-Medium.ttf'),
            'Nunito-SemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
            'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
          });
        } catch (fontError) {
          console.warn('Custom fonts not found — using system fonts. Run ./scripts/download_fonts.sh to install them.');
        }
      } catch (e) {
        console.warn('App preparation error:', e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appReady) return null;

  return (
    <AnalyticsProvider>
      <RevenueCatProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0d1117' },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="onboarding"
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
          <Stack.Screen
            name="paywall"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </RevenueCatProvider>
    </AnalyticsProvider>
  );
}

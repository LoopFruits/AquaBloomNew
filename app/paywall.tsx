import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { usePremium } from '../src/hooks/usePremium';
import { useAnalytics } from '../src/hooks/useAnalytics';
import { PREMIUM_FEATURES, SUBSCRIPTION_TIERS } from '../src/config/constants';

const { width: SW } = Dimensions.get('window');
const TEAL = '#7ec8c8';
const LAVENDER = '#c4a7d7';
const ROSE = '#f0a6b9';
const GOLD = '#f0c674';

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const router = useRouter();
  const { track, EVENTS } = useAnalytics();
  const {
    isReady,
    isPremium,
    purchasing,
    currentOffering,
    purchaseMonthly,
    purchaseYearly,
    purchaseLifetime,
    restorePurchases,
    presentPaywall,
  } = usePremium();

  useEffect(() => {
    track(EVENTS.PAYWALL_VIEWED);
  }, []);

  // If user is already premium, show a thank you and go back
  useEffect(() => {
    if (isPremium) {
      Alert.alert('You\'re Premium!', 'You already have AquaBloom Pro. Enjoy!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }, [isPremium]);

  const handlePlanSelect = (plan: 'monthly' | 'yearly' | 'lifetime') => {
    setSelectedPlan(plan);
    track(EVENTS.PLAN_SELECTED, { plan });
  };

  const handlePurchase = useCallback(async () => {
    // First, try to present RevenueCat's hosted paywall
    // (this shows the paywall you designed in the RevenueCat Dashboard)
    // If it fails (e.g., no paywall configured), fall back to manual purchase
    try {
      const result = await presentPaywall();
      if (result) {
        router.back();
        return;
      }
    } catch {
      // RevenueCat Paywall UI not available — fall back to manual purchase
    }

    // Fallback: manual purchase by selected plan
    let success = false;
    switch (selectedPlan) {
      case 'monthly':
        success = await purchaseMonthly();
        break;
      case 'yearly':
        success = await purchaseYearly();
        break;
      case 'lifetime':
        success = await purchaseLifetime();
        break;
    }

    if (success) {
      router.back();
    }
  }, [selectedPlan, presentPaywall, purchaseMonthly, purchaseYearly, purchaseLifetime, router]);

  const handleRestore = useCallback(async () => {
    const restored = await restorePurchases();
    if (restored) {
      router.back();
    }
  }, [restorePurchases, router]);

  // Get real prices from RevenueCat offerings (fall back to constants)
  const monthlyPrice = currentOffering?.monthly?.product?.priceString ?? SUBSCRIPTION_TIERS.monthly.price;
  const yearlyPrice = currentOffering?.annual?.product?.priceString ?? SUBSCRIPTION_TIERS.yearly.price;
  const lifetimePrice = currentOffering?.lifetime?.product?.priceString ?? '$79.99';

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => { track(EVENTS.PAYWALL_DISMISSED); router.back(); }} style={s.close}>
          <Text style={s.closeTxt}>✕</Text>
        </TouchableOpacity>

        <View style={s.hero}>
          <Text style={{ fontSize: 56 }}>✨</Text>
          <Text style={s.heroTitle}>AquaBloom Premium</Text>
          <Text style={s.heroSub}>Unlock your full hydration potential</Text>
        </View>

        {/* Features */}
        <View style={{ gap: 16, marginBottom: 24 }}>
          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={s.featureRow}>
              <Text style={{ fontSize: 22, marginTop: 2 }}>{f.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureDesc}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* No ads */}
        <View style={s.noAds}>
          <Text style={{ fontSize: 20 }}>🚫</Text>
          <Text style={s.noAdsTxt}>Plus: Remove all ads for a clean, distraction-free experience</Text>
        </View>

        {/* Plan selector — 3 options */}
        <View style={s.plans}>
          {/* Yearly */}
          <TouchableOpacity onPress={() => handlePlanSelect('yearly')}
            style={[s.planCard, selectedPlan === 'yearly' && s.planSelected]}>
            <View style={s.bestBadge}><Text style={s.bestTxt}>BEST VALUE</Text></View>
            <Text style={s.planName}>Yearly</Text>
            <Text style={s.planPrice}>{yearlyPrice}</Text>
            <Text style={s.planPeriod}>per year</Text>
            <Text style={s.planSave}>Save {SUBSCRIPTION_TIERS.yearly.savings}</Text>
            <Text style={s.planTrial}>{SUBSCRIPTION_TIERS.yearly.trialDays}-day free trial</Text>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity onPress={() => handlePlanSelect('monthly')}
            style={[s.planCard, selectedPlan === 'monthly' && s.planSelected]}>
            <Text style={s.planName}>Monthly</Text>
            <Text style={s.planPrice}>{monthlyPrice}</Text>
            <Text style={s.planPeriod}>per month</Text>
            <Text style={s.planTrial}>{SUBSCRIPTION_TIERS.monthly.trialDays}-day free trial</Text>
          </TouchableOpacity>
        </View>

        {/* Lifetime option */}
        <TouchableOpacity onPress={() => handlePlanSelect('lifetime')}
          style={[s.lifetimeCard, selectedPlan === 'lifetime' && s.lifetimeSelected]}>
          <Text style={{ fontSize: 20 }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.planName, { color: selectedPlan === 'lifetime' ? GOLD : '#6b7280' }]}>Lifetime</Text>
            <Text style={s.lifetimeDesc}>One-time payment, forever yours</Text>
          </View>
          <Text style={[s.planPrice, { fontSize: 22 }]}>{lifetimePrice}</Text>
        </TouchableOpacity>

        {/* CTA */}
        <TouchableOpacity onPress={handlePurchase} activeOpacity={0.8} disabled={purchasing}>
          <LinearGradient colors={[TEAL, LAVENDER, ROSE]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.ctaTxt}>
                {selectedPlan === 'lifetime' ? 'Buy Now' : 'Start Free Trial'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={s.fine}>
          Cancel anytime. No charge during your free trial.{'\n'}
          Subscription auto-renews unless canceled 24 hours before the end of the current period.
        </Text>

        <TouchableOpacity onPress={handleRestore} style={s.restore} disabled={purchasing}>
          <Text style={s.restoreTxt}>Restore Purchases</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  scroll: { paddingHorizontal: 24, paddingTop: 20 },
  close: { alignSelf: 'flex-end', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  closeTxt: { fontSize: 16, color: '#6b7280' },
  hero: { alignItems: 'center', paddingVertical: 32 },
  heroTitle: { fontSize: 36, fontFamily: 'Cormorant-Light', color: '#e8eaed', marginTop: 16, letterSpacing: 0.5 },
  heroSub: { fontSize: 15, fontFamily: 'Nunito-Regular', color: '#9ba3af', marginTop: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureTitle: { fontSize: 14, fontFamily: 'Nunito-SemiBold', color: '#e8eaed' },
  featureDesc: { fontSize: 12, fontFamily: 'Nunito-Regular', color: '#6b7280', marginTop: 2, lineHeight: 18 },
  noAds: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(126,200,200,0.06)', borderWidth: 1, borderColor: 'rgba(126,200,200,0.1)', borderRadius: 16, padding: 16, marginBottom: 24 },
  noAdsTxt: { flex: 1, fontSize: 13, fontFamily: 'Nunito-Medium', color: TEAL, lineHeight: 19 },
  plans: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  planCard: { flex: 1, alignItems: 'center', paddingVertical: 20, paddingHorizontal: 12, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(126,200,200,0.1)', backgroundColor: 'rgba(126,200,200,0.04)', position: 'relative' },
  planSelected: { borderColor: TEAL, backgroundColor: 'rgba(126,200,200,0.06)' },
  bestBadge: { position: 'absolute', top: -10, backgroundColor: TEAL, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  bestTxt: { fontSize: 9, fontFamily: 'Nunito-Bold', color: '#fff', letterSpacing: 1 },
  planName: { fontSize: 14, fontFamily: 'Nunito-SemiBold', color: '#9ba3af', marginBottom: 4 },
  planPrice: { fontSize: 30, fontFamily: 'Cormorant-Light', color: '#e8eaed' },
  planPeriod: { fontSize: 12, fontFamily: 'Nunito-Regular', color: '#6b7280', marginTop: 2 },
  planSave: { fontSize: 12, fontFamily: 'Nunito-SemiBold', color: TEAL, marginTop: 6 },
  planTrial: { fontSize: 11, fontFamily: 'Nunito-Regular', color: LAVENDER, marginTop: 4 },
  lifetimeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(240,198,116,0.1)', backgroundColor: 'rgba(240,198,116,0.04)', marginBottom: 24 },
  lifetimeSelected: { borderColor: GOLD, backgroundColor: 'rgba(240,198,116,0.08)' },
  lifetimeDesc: { fontSize: 11, fontFamily: 'Nunito-Regular', color: '#6b7280', marginTop: 1 },
  cta: { paddingVertical: 16, borderRadius: 24, alignItems: 'center', marginBottom: 16 },
  ctaTxt: { fontSize: 16, fontFamily: 'Nunito-Bold', color: '#fff', letterSpacing: 0.5 },
  fine: { fontSize: 11, fontFamily: 'Nunito-Regular', color: '#6b7280', textAlign: 'center', lineHeight: 17 },
  restore: { alignItems: 'center', paddingVertical: 16 },
  restoreTxt: { fontSize: 13, fontFamily: 'Nunito-Medium', color: '#6b7280', textDecorationLine: 'underline' },
});

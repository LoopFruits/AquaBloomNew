// ─────────────────────────────────────────────────
// usePremium — RevenueCat subscription hook
// ─────────────────────────────────────────────────
//
// This hook provides the subscription state and purchase
// actions for the entire app. It reads from the RevenueCat
// provider context (which initializes the SDK at app start)
// and adds purchase/restore convenience methods.
//

import { useCallback, useState } from 'react';
import Purchases, { PurchasesPackage, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Alert } from 'react-native';
import { useRevenueCat } from '../providers/RevenueCatProvider';
import { ENTITLEMENT_ID } from '../config/revenuecat';
import { useAnalytics } from './useAnalytics';

export function usePremium() {
  const { isReady, isPremium, customerInfo, currentOffering, refreshCustomerInfo } = useRevenueCat();
  const { track, EVENTS } = useAnalytics();
  const [purchasing, setPurchasing] = useState(false);

  /**
   * Purchase a specific package (monthly, annual, or lifetime)
   */
  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    if (purchasing) return false;
    setPurchasing(true);

    try {
      track(EVENTS.PURCHASE_STARTED, {
        package_id: pkg.identifier,
        product_id: pkg.product.identifier,
        price: pkg.product.priceString,
      });

      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      const nowPremium = info.entitlements.active[ENTITLEMENT_ID]?.isActive === true;

      if (nowPremium) {
        track(EVENTS.PURCHASE_COMPLETED, {
          package_id: pkg.identifier,
          product_id: pkg.product.identifier,
        });
      }

      await refreshCustomerInfo();
      return nowPremium;
    } catch (error: any) {
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        // User cancelled — not an error
        return false;
      }
      track(EVENTS.PURCHASE_FAILED, {
        error_code: error.code,
        error_message: error.message,
      });
      Alert.alert('Purchase Failed', error.message || 'Something went wrong. Please try again.');
      return false;
    } finally {
      setPurchasing(false);
    }
  }, [purchasing, refreshCustomerInfo, track]);

  /**
   * Purchase by package type shorthand
   */
  const purchaseMonthly = useCallback(async (): Promise<boolean> => {
    const pkg = currentOffering?.monthly;
    if (!pkg) {
      Alert.alert('Not Available', 'Monthly subscription is not available right now.');
      return false;
    }
    return purchasePackage(pkg);
  }, [currentOffering, purchasePackage]);

  const purchaseYearly = useCallback(async (): Promise<boolean> => {
    const pkg = currentOffering?.annual;
    if (!pkg) {
      Alert.alert('Not Available', 'Yearly subscription is not available right now.');
      return false;
    }
    return purchasePackage(pkg);
  }, [currentOffering, purchasePackage]);

  const purchaseLifetime = useCallback(async (): Promise<boolean> => {
    const pkg = currentOffering?.lifetime;
    if (!pkg) {
      Alert.alert('Not Available', 'Lifetime purchase is not available right now.');
      return false;
    }
    return purchasePackage(pkg);
  }, [currentOffering, purchasePackage]);

  /**
   * Restore previous purchases
   */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      track(EVENTS.PURCHASE_RESTORED);
      const info = await Purchases.restorePurchases();
      const nowPremium = info.entitlements.active[ENTITLEMENT_ID]?.isActive === true;
      await refreshCustomerInfo();

      if (nowPremium) {
        Alert.alert('Restored!', 'Your premium access has been restored.');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }

      return nowPremium;
    } catch (error: any) {
      Alert.alert('Restore Failed', error.message || 'Something went wrong. Please try again.');
      return false;
    }
  }, [refreshCustomerInfo, track]);

  /**
   * Present the RevenueCat-hosted Paywall
   * (designed in the RevenueCat Dashboard under Tools > Paywalls)
   */
  const presentPaywall = useCallback(async (): Promise<boolean> => {
    try {
      track(EVENTS.PAYWALL_VIEWED, { source: 'revenuecat_ui' });

      const result = await RevenueCatUI.presentPaywall({
        displayCloseButton: true,
      });

      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        track(EVENTS.PURCHASE_COMPLETED, { source: 'revenuecat_paywall' });
        await refreshCustomerInfo();
        return true;
      }

      if (result === PAYWALL_RESULT.CANCELLED) {
        track(EVENTS.PAYWALL_DISMISSED);
      }

      return false;
    } catch (error: any) {
      console.warn('[Paywall] Error presenting paywall:', error);
      return false;
    }
  }, [refreshCustomerInfo, track]);

  /**
   * Present paywall only if user doesn't already have the entitlement
   * Great for gating premium features
   */
  const presentPaywallIfNeeded = useCallback(async (): Promise<boolean> => {
    try {
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: ENTITLEMENT_ID,
        displayCloseButton: true,
      });

      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        await refreshCustomerInfo();
        return true;
      }

      // NOT_PRESENTED means user already has the entitlement
      if (result === PAYWALL_RESULT.NOT_PRESENTED) {
        return true; // Already premium
      }

      return false;
    } catch (error: any) {
      console.warn('[Paywall] Error:', error);
      return false;
    }
  }, [refreshCustomerInfo]);

  /**
   * Present RevenueCat Customer Center
   * (manage subscription, request refund, get support)
   */
  const presentCustomerCenter = useCallback(async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (error: any) {
      console.warn('[CustomerCenter] Error:', error);
      Alert.alert('Error', 'Could not open subscription management. Please try again.');
    }
  }, []);

  return {
    // State
    isReady,
    isPremium,
    purchasing,
    customerInfo,
    currentOffering,

    // Purchase actions
    purchasePackage,
    purchaseMonthly,
    purchaseYearly,
    purchaseLifetime,
    restorePurchases,

    // UI actions
    presentPaywall,
    presentPaywallIfNeeded,
    presentCustomerCenter,

    // Refresh
    refreshCustomerInfo,
  };
}

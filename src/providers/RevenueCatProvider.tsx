// ─────────────────────────────────────────────────
// RevenueCat Provider
// Initializes RevenueCat SDK and provides subscription state
// ─────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
} from 'react-native-purchases';
import { REVENUECAT_API_KEY, ENTITLEMENT_ID } from '../config/revenuecat';

interface RevenueCatContextType {
  /** Whether RevenueCat has been initialized */
  isReady: boolean;
  /** Whether the user has an active "AquaBloom Pro" entitlement */
  isPremium: boolean;
  /** The current customer info object from RevenueCat */
  customerInfo: CustomerInfo | null;
  /** The default offering (contains your packages/products) */
  currentOffering: PurchasesOffering | null;
  /** Manually refresh customer info (e.g., after a purchase) */
  refreshCustomerInfo: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType>({
  isReady: false,
  isPremium: false,
  customerInfo: null,
  currentOffering: null,
  refreshCustomerInfo: async () => {},
});

export function useRevenueCat(): RevenueCatContextType {
  return useContext(RevenueCatContext);
}

interface RevenueCatProviderProps {
  children: React.ReactNode;
}

export default function RevenueCatProvider({ children }: RevenueCatProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  // Derive premium status from customer info
  const isPremium = customerInfo?.entitlements.active[ENTITLEMENT_ID]?.isActive === true;

  // Initialize RevenueCat
  useEffect(() => {
    async function init() {
      try {
        // Enable debug logs in development
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        // Configure with your API key
        Purchases.configure({
          apiKey: REVENUECAT_API_KEY,
        });

        // Fetch initial customer info
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);

        // Fetch offerings (contains your products/packages)
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setCurrentOffering(offerings.current);
        }

        setIsReady(true);

        if (__DEV__) {
          console.log('[RevenueCat] Initialized successfully');
          console.log('[RevenueCat] Customer ID:', info.originalAppUserId);
          console.log('[RevenueCat] Premium:', info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false);
          console.log('[RevenueCat] Offerings:', offerings.current?.identifier ?? 'none');
        }
      } catch (error) {
        console.warn('[RevenueCat] Initialization error:', error);
        // Still mark as ready so the app works without RevenueCat
        setIsReady(true);
      }
    }

    init();
  }, []);

  // Listen for customer info changes (e.g., subscription renewal, expiration)
  useEffect(() => {
    const listener = (info: CustomerInfo) => {
      setCustomerInfo(info);
      if (__DEV__) {
        console.log('[RevenueCat] Customer info updated:', info.entitlements.active);
      }
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  // Refresh customer info when app comes to foreground
  // (catches subscription changes made outside the app)
  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        try {
          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);
        } catch (error) {
          // Silently fail — not critical
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Manual refresh function
  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.warn('[RevenueCat] Failed to refresh customer info:', error);
    }
  }, []);

  return (
    <RevenueCatContext.Provider
      value={{
        isReady,
        isPremium,
        customerInfo,
        currentOffering,
        refreshCustomerInfo,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

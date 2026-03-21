// ─────────────────────────────────────────────────
// AquaBloom RevenueCat Configuration
// ─────────────────────────────────────────────────
//
// SETUP STEPS:
// 1. Create a RevenueCat account at https://app.revenuecat.com
// 2. Create a new project called "AquaBloom"
// 3. Connect your App Store Connect & Google Play Console
// 4. Create Products in the stores:
//    - Monthly:  com.aquabloom.pro.monthly   ($3.99/month)
//    - Yearly:   com.aquabloom.pro.yearly    ($29.99/year)
//    - Lifetime: com.aquabloom.pro.lifetime  ($79.99 one-time)
// 5. In RevenueCat Dashboard:
//    a. Create an Entitlement called "AquaBloom Pro"
//    b. Attach all 3 products to that entitlement
//    c. Create an Offering called "default" with all 3 packages
//    d. Copy your API keys below
// 6. Set up a Paywall in the RevenueCat Dashboard
//    (Tools > Paywalls > Create New)
// ─────────────────────────────────────────────────

import Constants from "expo-constants";
import { Platform } from "react-native";

export const REVENUECAT_API_KEY =
  Platform.select({
    ios: Constants.expoConfig?.extra?.revenueCatKeyIos as string | undefined,
    android: Constants.expoConfig?.extra?.revenueCatKeyAndroid as string | undefined,
  }) ?? "";

// The entitlement identifier you set up in RevenueCat Dashboard
export const ENTITLEMENT_ID = 'AquaBloom Pro';

// Product identifiers (must match what you create in App Store Connect / Google Play Console)
export const PRODUCT_IDS = {
  MONTHLY: 'com.aquabloom.pro.monthly',
  YEARLY: 'com.aquabloom.pro.yearly',
  LIFETIME: 'com.aquabloom.pro.lifetime',
} as const;

// Offering identifier
export const DEFAULT_OFFERING_ID = 'default';

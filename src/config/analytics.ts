// ─────────────────────────────────────────────────
// AquaBloom Analytics Configuration (PostHog)
// ─────────────────────────────────────────────────
//
// API key and host are loaded from app.config.js extras via expo-constants.
// Set POSTHOG_API_KEY and POSTHOG_HOST in your .env file.
// @see https://posthog.com/docs/libraries/react-native
// ─────────────────────────────────────────────────

import Constants from 'expo-constants';

export const POSTHOG_API_KEY =
  (Constants.expoConfig?.extra?.posthogApiKey as string | undefined) ?? '';
export const POSTHOG_HOST =
  (Constants.expoConfig?.extra?.posthogHost as string | undefined) ||
  'https://us.i.posthog.com';

// ─────────────────────────────────────────────────
// Event Names — centralized so you never have typos
// ─────────────────────────────────────────────────
export const ANALYTICS_EVENTS = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_SLIDE_VIEWED: 'onboarding_slide_viewed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Hydration
  WATER_ADDED: 'water_added',
  WATER_UNDONE: 'water_undone',
  CUSTOM_AMOUNT_ADDED: 'custom_amount_added',
  DAILY_GOAL_REACHED: 'daily_goal_reached',
  DAY_RESET: 'day_reset',

  // Goal
  GOAL_UPDATED: 'goal_updated',

  // Reminders
  REMINDER_TOGGLED: 'reminder_toggled',
  NOTIFICATIONS_PERMISSION_REQUESTED: 'notifications_permission_requested',
  NOTIFICATIONS_PERMISSION_GRANTED: 'notifications_permission_granted',
  NOTIFICATIONS_PERMISSION_DENIED: 'notifications_permission_denied',

  // Premium / Monetization
  UPGRADE_BANNER_TAPPED: 'upgrade_banner_tapped',
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_DISMISSED: 'paywall_dismissed',
  PLAN_SELECTED: 'plan_selected',
  PURCHASE_STARTED: 'purchase_started',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  PURCHASE_RESTORED: 'purchase_restored',
  TRIAL_STARTED: 'trial_started',

  // Navigation
  TAB_SWITCHED: 'tab_switched',
  SCREEN_VIEWED: 'screen_viewed',

  // Ads
  AD_IMPRESSION: 'ad_impression',
  AD_CLICKED: 'ad_clicked',

  // Gamification
  BLOOM_POINTS_EARNED: 'bloom_points_earned',
  PLANT_STAGE_REACHED: 'plant_stage_reached',
  PLANT_GROWTH_RESET: 'plant_growth_reset',

  // App Lifecycle
  APP_OPENED: 'app_opened',
  APP_BACKGROUNDED: 'app_backgrounded',
} as const;

// ─────────────────────────────────────────────────
// User Properties — for segmentation in PostHog
// ─────────────────────────────────────────────────
export const USER_PROPERTIES = {
  DAILY_GOAL: 'daily_goal_ml',
  IS_PREMIUM: 'is_premium',
  REMINDERS_ACTIVE_COUNT: 'reminders_active_count',
  STREAK_DAYS: 'streak_days',
  TOTAL_LIFETIME_ML: 'total_lifetime_ml',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  APP_VERSION: 'app_version',
  INSTALL_DATE: 'install_date',
  BLOOM_POINTS_TOTAL: 'bloom_points_total',
  PLANT_SPECIES: 'plant_species',
} as const;

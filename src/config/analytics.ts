// ─────────────────────────────────────────────────
// AquaBloom Analytics Configuration (PostHog)
// ─────────────────────────────────────────────────
//
// PostHog gives you product analytics, session replay,
// feature flags, and A/B testing — all in one platform.
//
// FREE TIER: 1 million events/month (very generous for a new app)
//
// SETUP:
// 1. Sign up at https://posthog.com (free)
// 2. Create a project → copy your API key
// 3. Replace POSTHOG_API_KEY below with your real key
// 4. (Optional) If self-hosting, update POSTHOG_HOST
// ─────────────────────────────────────────────────

export const POSTHOG_API_KEY = 'phc_REPLACE_WITH_YOUR_POSTHOG_API_KEY';
export const POSTHOG_HOST = 'https://us.i.posthog.com'; // or https://eu.i.posthog.com for EU

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
} as const;

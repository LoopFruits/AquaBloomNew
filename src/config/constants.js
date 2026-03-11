// ─────────────────────────────────────────────────
// AquaBloom Constants & Configuration
// ─────────────────────────────────────────────────

// Hydration defaults
export const DEFAULT_GOAL_ML = 2500;
export const GLASS_ML = 250;
export const MIN_CUSTOM_ML = 10;
export const MAX_CUSTOM_ML = 2000;

// Quick-add presets
export const QUICK_ADD_OPTIONS = [
  { ml: 150, label: 'Small', icon: 'cup-water', emoji: '🥤' },
  { ml: 250, label: 'Glass', icon: 'water', emoji: '💧' },
  { ml: 350, label: 'Bottle', icon: 'bottle-water', emoji: '🫧' },
  { ml: 500, label: 'Large', icon: 'water-outline', emoji: '💦' },
];

// Default reminder schedule
export const DEFAULT_REMINDERS = [
  { id: 'r1', time: '07:00', label: 'Morning Rise', emoji: '🌅', active: true },
  { id: 'r2', time: '09:30', label: 'Mid-Morning', emoji: '☀️', active: true },
  { id: 'r3', time: '11:30', label: 'Before Lunch', emoji: '🍃', active: true },
  { id: 'r4', time: '13:00', label: 'After Lunch', emoji: '🌸', active: true },
  { id: 'r5', time: '15:00', label: 'Afternoon Boost', emoji: '✨', active: true },
  { id: 'r6', time: '17:00', label: 'Pre-Dinner', emoji: '🌷', active: true },
  { id: 'r7', time: '19:00', label: 'Evening Wind Down', emoji: '🌙', active: true },
  { id: 'r8', time: '21:00', label: 'Before Bed', emoji: '💤', active: false },
];

// Affirmations (universal motivational messaging)
export const AFFIRMATIONS = [
  "Every sip fuels your day 💧",
  "Hydration is your superpower 💪",
  "Your body thanks you 🌿",
  "Keep the streak alive! 🔥",
  "Sip by sip, you're thriving 🌱",
  "Water is progress in motion ✨",
  "Stay consistent, stay strong 💫",
  "Your plant is growing! 🌸",
  "One more glass, you've got this 🥤",
  "Nourishing yourself is never wasted 🌻",
  "Hydration = energy + focus 🧠",
  "You're building a great habit 🏆",
];

// Notification messages (for push notifications)
export const NOTIFICATION_MESSAGES = [
  { title: 'Time to hydrate! 💧', body: "Your plant needs watering — take a sip!" },
  { title: 'Water break! 🌿', body: "A quick sip now keeps your streak alive." },
  { title: "Don't forget to drink! ✨", body: "Your plant is getting thirsty." },
  { title: 'Hydration check! 🌱', body: "Feeling tired? Water might be just what you need." },
  { title: 'Keep it going! 💪', body: "You're building something great, sip by sip." },
  { title: 'Almost there! 🏆', body: "A few more glasses to hit today's goal." },
];

// Premium features list (for paywall)
export const PREMIUM_FEATURES = [
  {
    icon: '🌙',
    title: 'Smart Reminders',
    description: 'AI-powered reminders that adapt to your daily routine',
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Weekly & monthly hydration trends with insights',
  },
  {
    icon: '🌿',
    title: 'Plant Collection',
    description: 'Unlock premium plants: Sakura, Monstera, Succulent & more',
  },
  {
    icon: '🏆',
    title: 'Streak Rewards',
    description: 'Earn Bloom Points, unlock badges, and protect your streak with Streak Freeze',
  },
  {
    icon: '🤝',
    title: 'Hydration Circles',
    description: 'Stay motivated with friends and family challenges',
  },
  {
    icon: '💊',
    title: 'Wellness Integration',
    description: 'Connect with Apple Health & Google Fit',
  },
];

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  monthly: {
    id: 'aquabloom_premium_monthly',
    price: '$3.99',
    period: 'month',
    trialDays: 7,
  },
  yearly: {
    id: 'aquabloom_premium_yearly',
    price: '$29.99',
    period: 'year',
    trialDays: 7,
    savings: '37%',
  },
};

// Ad configuration
export const AD_CONFIG = {
  banner: {
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    // Test IDs (use during development)
    testIos: 'ca-app-pub-3940256099942544/2934735716',
    testAndroid: 'ca-app-pub-3940256099942544/6300978111',
  },
  interstitial: {
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    testIos: 'ca-app-pub-3940256099942544/4411468910',
    testAndroid: 'ca-app-pub-3940256099942544/1033173712',
  },
  // Show interstitial after every N water logs (non-premium users)
  interstitialFrequency: 5,
};

// Storage keys
export const STORAGE_KEYS = {
  INTAKE_TODAY: '@aquabloom_intake_today',
  INTAKE_LOG: '@aquabloom_intake_log',
  INTAKE_DATE: '@aquabloom_intake_date',
  REMINDERS: '@aquabloom_reminders',
  SETTINGS: '@aquabloom_settings',
  ONBOARDING_COMPLETE: '@aquabloom_onboarding',
  STREAK: '@aquabloom_streak',
  HISTORY: '@aquabloom_history',
  IS_PREMIUM: '@aquabloom_is_premium',
  BLOOM_POINTS: '@aquabloom_bloom_points',
  PLANT_STATE: '@aquabloom_plant_state',
};

// Onboarding slides
export const ONBOARDING_SLIDES = [
  {
    key: 'welcome',
    title: 'Welcome to AquaBloom',
    subtitle: 'Your personal hydration companion — grow plants, earn points, stay hydrated',
    emoji: '🌸',
  },
  {
    key: 'track',
    title: 'Track Every Sip',
    subtitle: 'Log your water intake with a single tap. Watch your progress bloom throughout the day',
    emoji: '💧',
  },
  {
    key: 'grow',
    title: 'Grow Your Plant',
    subtitle: 'Every sip helps your plant bloom. Hit your daily goal to watch it reach full flower 🌱',
    emoji: '🪴',
  },
  {
    key: 'remind',
    title: 'Gentle Reminders',
    subtitle: 'Never forget to hydrate with customizable notifications throughout your day',
    emoji: '🔔',
  },
  {
    key: 'streak',
    title: 'Build Your Streak',
    subtitle: 'Stay consistent, earn Bloom Points, and level up your hydration game',
    emoji: '🔥',
  },
];

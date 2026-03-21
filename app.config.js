// app.config.js — Dynamic Expo config
// Extends app.json and injects env vars into `extra` so they are
// accessible at runtime via Constants.expoConfig?.extra

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    posthogApiKey: process.env.POSTHOG_API_KEY,
    posthogHost: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
    revenueCatKeyIos: process.env.REVENUECAT_API_KEY_IOS,
    revenueCatKeyAndroid: process.env.REVENUECAT_API_KEY_ANDROID,
  },
});

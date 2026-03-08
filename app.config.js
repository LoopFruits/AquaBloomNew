// app.config.js — Dynamic Expo config
// Extends app.json and injects PostHog env vars into `extra` so they are
// accessible at runtime via Constants.expoConfig?.extra
// @see https://docs.expo.dev/workflow/configuration/

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    posthogApiKey: process.env.POSTHOG_API_KEY,
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  },
})

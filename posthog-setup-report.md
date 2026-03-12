<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into AquaBloom. The existing `posthog-react-native` SDK was already present but pointed at a placeholder API key. The integration is now fully wired end-to-end with environment variables, proper Expo configuration, screen tracking, and one new event.

## Changes made

### New files
| File | Purpose |
|------|---------|
| `app.config.js` | Dynamic Expo config that reads `POSTHOG_API_KEY` / `POSTHOG_HOST` from `.env` and injects them into `Constants.expoConfig.extra` |
| `.env` | Local secrets file (git-ignored) with `POSTHOG_API_KEY` and `POSTHOG_HOST` |

### Modified files
| File | Change |
|------|--------|
| `src/config/analytics.ts` | Replaced hardcoded placeholder key with `Constants.expoConfig?.extra?.posthogApiKey` lookup |
| `src/providers/AnalyticsProvider.tsx` | Refactored to singleton client pattern (matches Expo example); uses `disabled` flag instead of placeholder check; enables `captureAppLifecycleEvents`; exposes `posthogClient` for screen tracking |
| `app/_layout.tsx` | Added `ScreenTracker` component that calls `posthog.screen()` on every pathname change for accurate screen analytics with Expo Router |
| `app/(tabs)/index.tsx` | Added `upgrade_banner_tapped` event when free users tap the premium upsell banner |

### Peer dependencies installed
`expo-file-system`, `expo-application`, `expo-device`, `expo-localization` — required by `posthog-react-native` for Expo apps.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `onboarding_started` | User begins onboarding flow | `app/onboarding.tsx` |
| `onboarding_slide_viewed` | User views a specific slide | `app/onboarding.tsx` |
| `onboarding_skipped` | User skips onboarding early | `app/onboarding.tsx` |
| `onboarding_completed` | User finishes onboarding | `app/onboarding.tsx` |
| `water_added` | Water logged via quick-add | `app/(tabs)/index.tsx` |
| `water_undone` | Last water entry undone | `app/(tabs)/index.tsx` |
| `custom_amount_added` | Custom ml amount logged | `app/(tabs)/index.tsx` |
| `daily_goal_reached` | User hits daily hydration goal | `app/(tabs)/index.tsx` |
| `upgrade_banner_tapped` ✨ new | Free user taps premium upsell banner | `app/(tabs)/index.tsx` |
| `day_reset` | Daily log reset | `app/(tabs)/history.tsx` |
| `goal_updated` | Daily goal changed | `app/(tabs)/settings.tsx` |
| `reminder_toggled` | Hydration reminder toggled on/off | `app/(tabs)/reminders.tsx` |
| `notifications_permission_requested` | App requests notification permission | `app/(tabs)/reminders.tsx` |
| `notifications_permission_granted` | Permission granted | `app/(tabs)/reminders.tsx` |
| `notifications_permission_denied` | Permission denied | `app/(tabs)/reminders.tsx` |
| `paywall_viewed` | Paywall screen opened | `app/paywall.tsx` |
| `paywall_dismissed` | Paywall closed without purchase | `app/paywall.tsx` |
| `plan_selected` | Subscription plan selected | `app/paywall.tsx` |
| `purchase_started` | Purchase flow initiated | `src/hooks/usePremium.ts` |
| `purchase_completed` | Purchase succeeded | `src/hooks/usePremium.ts` |
| `purchase_failed` | Purchase failed | `src/hooks/usePremium.ts` |
| `purchase_restored` | Purchases restored | `src/hooks/usePremium.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/335042/dashboard/1340654
- **Conversion Funnel: Onboarding → Purchase**: https://us.posthog.com/project/335042/insights/WxD870ev
- **Daily Active Users: Tracking & Goal Completion**: https://us.posthog.com/project/335042/insights/Z98BSWpV
- **Paywall Conversion: Views vs Purchases**: https://us.posthog.com/project/335042/insights/1PTlyDwy
- **Reminder Engagement**: https://us.posthog.com/project/335042/insights/C4TKcZGU
- **Onboarding Completion vs Skip Rate**: https://us.posthog.com/project/335042/insights/kLtEgBl4

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

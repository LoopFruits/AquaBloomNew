# AquaBloom - Complete Setup & Launch Guide

## Your First iOS & Android App: From Code to Passive Income

---

## Table of Contents

1. Project Overview
2. Getting Started (Setup)
3. Monetization Architecture
4. App Store Submission
5. Marketing Copy (Women-Focused)
6. Revenue Projections
7. Post-Launch Checklist

---

## 1. Project Overview

**AquaBloom** is a hydration tracking app designed with women-focused branding and marketing. It uses a hybrid monetization model: ads for free users + a premium subscription that removes ads and unlocks features.

### Tech Stack

- **Framework**: Expo (React Native) — one codebase for iOS + Android
- **Subscriptions**: RevenueCat — handles App Store & Google Play billing
- **Ads**: Google AdMob — banner + interstitial ads
- **Notifications**: Expo Notifications — push notification reminders
- **Storage**: AsyncStorage — local data persistence
- **Animations**: React Native Reanimated — smooth 60fps animations

### Project Structure

```
AquaBloom/
├── App.js                          # Entry point
├── app.json                        # Expo configuration
├── eas.json                        # EAS Build configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
├── assets/
│   ├── fonts/                      # Cormorant Garamond + Nunito fonts
│   └── images/                     # App icon, splash screen
└── src/
    ├── config/
    │   ├── theme.js                # Design system (colors, fonts, spacing)
    │   └── constants.js            # App constants, feature flags, ad IDs
    ├── hooks/
    │   ├── useHydration.js         # Core hydration tracking logic
    │   ├── usePremium.js           # RevenueCat subscription management
    │   └── useNotifications.js     # Push notification scheduling
    ├── components/
    │   ├── WaterDrop.js            # Animated water drop SVG
    │   ├── CircularProgress.js     # Animated progress ring
    │   └── AdBanner.js             # Smart ad banner (hidden for premium)
    ├── screens/
    │   ├── HomeScreen.js           # Main hydration tracking screen
    │   ├── RemindersScreen.js      # Notification schedule management
    │   ├── HistoryScreen.js        # Daily log & stats
    │   ├── SettingsScreen.js       # Goal, subscription, preferences
    │   ├── OnboardingScreen.js     # First-launch welcome flow
    │   └── PaywallScreen.js        # Premium subscription purchase
    └── navigation/
        └── AppNavigator.js         # Bottom tab navigation
```

---

## 2. Getting Started

### Prerequisites

1. **Node.js** (v18+): https://nodejs.org
2. **Expo CLI**: `npm install -g expo-cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. **Expo Go app** on your phone (for testing)

### Step-by-Step Setup

```bash
# 1. Navigate to the project
cd AquaBloom

# 2. Install dependencies
npm install

# 3. Download fonts (free from Google Fonts)
#    - Cormorant Garamond: Light, Regular, Medium, SemiBold
#    - Nunito: Light, Regular, Medium, SemiBold, Bold
#    Place .ttf files in assets/fonts/

# 4. Start development
npx expo start

# 5. Scan QR code with Expo Go on your phone
```

### Font Setup

Download these free fonts from Google Fonts and place them in `assets/fonts/`:

- `Cormorant-Light.ttf`
- `Cormorant-Regular.ttf`
- `Cormorant-Medium.ttf`
- `Cormorant-SemiBold.ttf`
- `Nunito-Light.ttf`
- `Nunito-Regular.ttf`
- `Nunito-Medium.ttf`
- `Nunito-SemiBold.ttf`
- `Nunito-Bold.ttf`

### App Icon & Splash Screen

Create these images and place them in `assets/images/`:

- `icon.png` — 1024x1024px (App Store icon)
- `adaptive-icon.png` — 1024x1024px (Android adaptive icon)
- `splash.png` — 1284x2778px (splash screen, dark background #0d1117)

Tip: Use Canva (free) to create these. Search "app icon" templates.

---

## 3. Monetization Architecture

### Revenue Streams

The app uses a **hybrid model** with two revenue streams:

#### Stream 1: Google AdMob (Free Users)

- **Banner ads**: Persistent at bottom of Home, Reminders, and History screens
- **Interstitial ads**: Full-screen ad shown every 5th water log
- Expected revenue: $1-5 per 1,000 daily active users (eCPM varies by region)

#### Stream 2: RevenueCat Subscriptions (Premium)

- **Monthly**: $3.99/month (7-day free trial)
- **Yearly**: $29.99/year (7-day free trial, 37% savings)
- Premium removes all ads + unlocks features
- Expected conversion: 2-5% of active users

### Setup: Google AdMob

1. Create account at https://admob.google.com
2. Create an app (iOS + Android separately)
3. Create ad units: one Banner, one Interstitial
4. Replace placeholder IDs in `src/config/constants.js`:
   - `AD_CONFIG.banner.ios` / `AD_CONFIG.banner.android`
   - `AD_CONFIG.interstitial.ios` / `AD_CONFIG.interstitial.android`
5. Replace app IDs in `app.json`:
   - `ios.config.googleMobileAdsAppId`
   - `android.googleMobileAdsAppId`

### Setup: RevenueCat

1. Create account at https://revenuecat.com (free up to $2.5k/mo revenue)
2. Create a project and add iOS + Android apps
3. Set up products:
   - In App Store Connect: create subscription group with monthly + yearly
   - In Google Play Console: create subscription with both base plans
4. Configure offerings in RevenueCat dashboard
5. Replace API keys in `app.json`:
   - `extra.revenueCatApiKeyIOS`
   - `extra.revenueCatApiKeyAndroid`

### Paywall Strategy

The paywall is shown when users:

- Tap the premium banner on the Home screen
- Tap "Upgrade to Premium" in Settings
- Try to access premium features (custom reminder times, analytics, themes)

The paywall highlights: 7-day free trial, yearly savings, ad removal, and feature list.

---

## 4. App Store Submission

### Building for Production

```bash
# Login to Expo
eas login

# Configure your project
eas build:configure

# Build for iOS (requires Apple Developer account - $99/year)
eas build --platform ios --profile production

# Build for Android (requires Google Play Console - $25 one-time)
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

### Apple Developer Account

1. Enroll at https://developer.apple.com ($99/year)
2. Create App ID with bundle identifier `com.aquabloom.app`
3. Create app in App Store Connect
4. Set up in-app purchase subscriptions
5. Update `eas.json` with your Apple ID and Team ID

### Google Play Console

1. Register at https://play.google.com/console ($25 one-time)
2. Create app listing
3. Set up subscription products
4. Generate service account key for automated submissions
5. Place `google-service-account.json` in project root

---

## 5. Marketing Copy (Women-Focused)

### App Store Title

**AquaBloom — Water Tracker**

### App Store Subtitle (30 chars)

**Hydrate & Glow Every Day**

### App Store Description

Discover AquaBloom, the water tracking app designed for women who want to feel their best from the inside out. Whether you're focused on clearer skin, more energy, or simply building better habits, AquaBloom makes staying hydrated feel like an act of self-care.

**Why women love AquaBloom:**

Track your daily water intake with a single, satisfying tap. Our beautiful progress ring fills up as you hydrate, paired with uplifting affirmations that keep you motivated throughout the day.

Set gentle, customizable reminders that fit your schedule — from your morning wake-up to your evening wind-down. AquaBloom adapts to your rhythm, not the other way around.

**Free features include:**
- One-tap water logging with quick-add presets
- Beautiful progress visualization
- Customizable daily hydration goals
- 8 preset daily reminder times
- Daily intake history and stats
- Motivational wellness affirmations

**AquaBloom Premium unlocks:**
- Smart AI-powered reminders
- Weekly and monthly trend analytics
- Beautiful custom themes (Rose Garden, Ocean Breeze, Lavender Fields)
- Streak rewards and milestone badges
- Hydration circles with friends
- Apple Health and Google Fit integration
- Ad-free experience

Start your free 7-day Premium trial today. Your skin, energy, and body will thank you.

### App Store Keywords

water tracker, hydration app, water reminder, drink water, self-care, wellness, women health, skin glow, daily water, hydration goals

### App Store Promotional Text (170 chars)

New: Smart reminders that learn your routine! Stay hydrated effortlessly with AquaBloom — the self-care hydration app designed for women.

### Screenshots Strategy (for App Store)

Create 6 screenshots showing:

1. **Home screen** with progress ring at ~65% — headline: "Track Your Glow"
2. **Quick-add buttons** in action — headline: "One Tap to Hydrate"
3. **Reminders screen** — headline: "Gentle Daily Reminders"
4. **History & stats** — headline: "Watch Your Progress Bloom"
5. **Premium paywall** — headline: "Unlock Your Full Potential"
6. **Goal celebration** — headline: "Celebrate Every Milestone"

Use pastel gradients (teal → lavender → rose) as backgrounds. Feature diverse women's hands holding phones.

---

## 6. Revenue Projections

### Conservative Estimate (First 6 Months)

| Month | Downloads | DAU  | Ad Revenue | Sub Revenue | Total   |
|-------|-----------|------|------------|-------------|---------|
| 1     | 500       | 150  | $15        | $12         | $27     |
| 2     | 800       | 300  | $45        | $36         | $81     |
| 3     | 1,200     | 500  | $100       | $80         | $180    |
| 4     | 2,000     | 800  | $200       | $160        | $360    |
| 5     | 3,000     | 1,200| $360       | $290        | $650    |
| 6     | 5,000     | 2,000| $600       | $480        | $1,080  |

### Growth Levers

1. **ASO (App Store Optimization)**: Target keywords like "water tracker for women", "hydration app"
2. **TikTok/Instagram Reels**: Short "day in my life" hydration content
3. **Pinterest**: Infographic pins about hydration benefits for skin/health
4. **Referral system**: "Hydration Circles" feature encourages friend invites
5. **Seasonal promotions**: New Year health resolutions, summer hydration push

### Cost Breakdown

| Expense | Cost | Frequency |
|---------|------|-----------|
| Apple Developer Account | $99 | Yearly |
| Google Play Console | $25 | One-time |
| RevenueCat | Free | Up to $2.5k/mo revenue |
| AdMob | Free | Revenue share (Google takes ~32%) |
| Expo EAS Build | Free | 30 builds/month on free tier |
| **Total startup cost** | **$124** | |

---

## 7. Post-Launch Checklist

### Week 1

- [ ] Monitor crash reports (Expo dashboard)
- [ ] Respond to all App Store reviews
- [ ] Check ad fill rates in AdMob dashboard
- [ ] Verify subscription flow works end-to-end

### Month 1

- [ ] Analyze retention metrics (Day 1, Day 7, Day 30)
- [ ] A/B test paywall copy and pricing
- [ ] Add App Store screenshots in additional languages
- [ ] Create social media accounts (@AquaBloomApp)

### Ongoing

- [ ] Release updates every 2-4 weeks (keeps App Store ranking fresh)
- [ ] Add seasonal themes (spring flowers, winter snowflakes)
- [ ] Implement premium features one at a time
- [ ] Build email list via in-app opt-in
- [ ] Track and optimize ARPU (Average Revenue Per User)

---

## Need Help?

### Common Issues

**"Module not found" errors**: Run `npx expo install` to resolve version mismatches.

**AdMob not showing ads**: Ads take 1-24 hours to start serving after account approval. Use test IDs during development.

**RevenueCat "no offerings"**: Ensure your products are approved in App Store Connect / Google Play Console and configured in the RevenueCat dashboard.

**Build fails**: Check `eas build` logs. Most issues are from missing native modules — run `npx expo doctor` to diagnose.

### Resources

- Expo Docs: https://docs.expo.dev
- RevenueCat Docs: https://docs.revenuecat.com
- AdMob Docs: https://developers.google.com/admob
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines
- Google Play Policies: https://play.google.com/console/about/guides

---

*Built with love for women who glow. AquaBloom © 2026*

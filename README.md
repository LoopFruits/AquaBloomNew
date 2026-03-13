# 💧 AquaBloom - Hydrate & Glow

> A beautiful hydration tracking app that makes drinking water the best part of your day. Track every sip, grow a virtual plant companion, earn Bloom Points, and build lasting hydration habits.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![AquaBloom App Preview](./mockup/hero-image.png)

---

## 🌸 Why AquaBloom?

Most water tracking apps are boring. AquaBloom transforms hydration into a **self-care ritual**:

- 🪴 **Plant Companion** — Watch your virtual plant grow from pot to full bloom as you hit your daily goal
- 🌸 **Bloom Points** — Earn points for every sip, unlock achievements, build streaks
- 💧 **One-Tap Logging** — Quick-add buttons (250ml, 500ml, custom) make tracking effortless
- ⏰ **Smart Reminders** — 8 customizable notifications that fit your schedule
- 📊 **Beautiful Analytics** — Track progress with gorgeous charts and insights

**Target audience:** Women 18-45 focused on wellness, glowing skin, and healthy habits.

---

## ✨ Features

### Free Tier
- Daily water tracking with quick-add buttons
- Plant companion (Sprout)
- Bloom Points & streak tracking
- 8 reminder slots
- Daily history log
- Beautiful UI with pastel gradients

### Premium ($3.99/month or $29.99/year)
- 7-day free trial
- AI-powered smart reminders
- Premium plant collection (Sakura, Monstera, Succulent)
- Advanced analytics (weekly/monthly trends)
- Streak Freeze protection
- Apple Health & Google Fit sync
- Ad-free experience

---

## 📱 Screenshots

*Coming soon - App Store screenshots will be added here*

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LoopFruits/AquaBloomNew.git
   cd AquaBloomNew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app

---

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Navigation:** Expo Router (file-based)
- **Subscriptions:** RevenueCat
- **Ads:** Google AdMob (free tier)
- **Analytics:** PostHog (privacy-focused)
- **Health Integrations:** Apple Health, Google Fit
- **Notifications:** Expo Notifications API

---

## 📂 Project Structure

```
aquabloom/
├── app/                  # Expo Router pages
│   ├── (tabs)/          # Main tab screens
│   │   ├── index.tsx    # Home (water tracking)
│   │   ├── history.tsx  # History/stats
│   │   ├── reminders.tsx
│   │   └── settings.tsx
│   └── _layout.tsx
├── src/
│   ├── components/      # Reusable components
│   ├── config/          # App configuration
│   ├── hooks/           # Custom hooks
│   ├── providers/       # Context providers
│   └── types/           # TypeScript types
├── assets/              # Images, fonts, icons
└── docs/                # Landing page (GitHub Pages)
```

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🚢 Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed build instructions and App Store submission process.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Website:** https://loopfruits.github.io/AquaBloomNew/
- **Issues:** https://github.com/LoopFruits/AquaBloomNew/issues

---

## 🙏 Acknowledgments

- Built with ❤️ for wellness-focused individuals
- Inspired by the need to make hydration delightful

---

## 📊 Project Status

- ✅ Core features complete
- ✅ Premium subscription integrated (RevenueCat)
- ✅ AdMob integrated (free tier)
- 🚧 App Store submission in progress
- 📅 Target launch: March 2026

---

**Made with 💕 for healthy hydration · AquaBloom © 2026**

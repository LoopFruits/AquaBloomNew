# AquaBloom Landing Page - Visual Layout Guide

**Quick visual reference for Figma implementation**

---

## 🖼️ Hero Section Layout (1440px Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HERO SECTION (100vh)                          Background: #0d1117  │
│                                                                      │
│   💧 [Droplet 1]              🎭 [Badge: #1 Wellness App]          │
│   (144px, 15%)                (center-top)                          │
│                                                                      │
│   ┌────────────────────┐                    ┌──────────────────┐   │
│   │  HERO TEXT         │                    │  FLOATING PHONE  │   │
│   │  (Left Column)     │                    │  (Right Column)  │   │
│   │                    │                    │                  │   │
│   │  [Title]           │                    │  [Keep existing  │   │
│   │  "Hydrate & Glow"  │                    │   mockup - don't │   │
│   │  (48px bold)       │                    │   modify]        │   │
│   │                    │                    │                  │   │
│   │  [Subtitle]        │                    │                  │   │
│   │  (18px, muted)     │                    │                  │   │
│   │                    │                    │                  │   │
│   │  [CTA Buttons]     │                    │                  │   │
│   │  ┌──────────────┐  │                    │                  │   │
│   │  │Get Started   │  │                    │                  │   │
│   │  │Free (Primary)│  │                    │                  │   │
│   │  └──────────────┘  │                    │                  │   │
│   │  [Learn More]      │                    │                  │   │
│   └────────────────────┘                    └──────────────────┘   │
│                                                                      │
│                                    💧 [Droplet 2]                   │
│                                    (1296px, 60%)                    │
│                                                                      │
│         💧 [Droplet 3]                                              │
│         (360px, 80%)                                                │
│                                                                      │
│  [Background Orbs: 3 blurred circles with radial gradients]        │
└─────────────────────────────────────────────────────────────────────┘
```

### Measurements
- **Container max-width:** 1280px
- **Left column width:** 50%
- **Right column width:** 50%
- **Vertical padding:** 120px top/bottom
- **Gap between columns:** 80px

---

## 🎴 Feature Cards Section

```
┌─────────────────────────────────────────────────────────────────────┐
│  FEATURES SECTION                                                    │
│                                                                      │
│  [Section Title: "Everything You Need to Bloom" (center)]          │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ ╭──────────╮ │  │ ╭──────────╮ │  │ ╭──────────╮ │             │
│  │ │ 🪴 Icon  │ │  │ │ 🌸 Icon  │ │  │ │ 💧 Icon  │ │             │
│  │ ╰──────────╯ │  │ ╰──────────╯ │  │ ╰──────────╯ │             │
│  │              │  │              │  │              │             │
│  │ Plant Growth │  │ Bloom Points │  │ Quick Add    │             │
│  │ (Title 24px) │  │ (Title 24px) │  │ (Title 24px) │             │
│  │              │  │              │  │              │             │
│  │ Watch your   │  │ Earn points  │  │ Log water in │             │
│  │ companion... │  │ for every... │  │ seconds...   │             │
│  │ (Body 16px)  │  │ (Body 16px)  │  │ (Body 16px)  │             │
│  │              │  │              │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│   [Wave shape]     [Petal shape]     [Wave shape]                  │
│   Default state    ⭐ Featured        Default state                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Card Specs
- **Card dimensions:** 380×420px
- **Grid:** 3 columns
- **Gap:** 32px
- **Padding:** 32px all sides
- **Border radius:** Organic (see FIGMA-DESIGN-SPEC.md)

---

## 📊 Social Proof Section

```
┌─────────────────────────────────────────────────────────────────────┐
│  SOCIAL PROOF (Dark background with subtle gradient)                │
│                                                                      │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐│
│  │    2.5M+   │   │    94%     │   │    150K+   │   │    4.8★    ││
│  │  (48px)    │   │  (48px)    │   │  (48px)    │   │  (48px)    ││
│  │ [Gradient] │   │ [Gradient] │   │ [Gradient] │   │ [Gradient] ││
│  │            │   │            │   │            │   │            ││
│  │  GLASSES   │   │  RETENTION │   │  PLANTS    │   │   RATING   ││
│  │  TRACKED   │   │  RATE      │   │  GROWN     │   │  APP STORE ││
│  │ (14px cap) │   │ (14px cap) │   │ (14px cap) │   │ (14px cap) ││
│  │            │   │            │   │            │   │            ││
│  │ ━━━━━━━━━ │   │ ━━━━━━━━━ │   │ ━━━━━━━━━ │   │ ━━━━━━━━━ ││
│  │ [Progress] │   │ [Progress] │   │ [Progress] │   │ [Progress] ││
│  └────────────┘   └────────────┘   └────────────┘   └────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Counter Specs
- **Number size:** 48px Bold
- **Number fill:** Linear gradient (teal → lavender)
- **Label size:** 14px Medium, uppercase, 2px tracking
- **Progress bar height:** 3px
- **Animation:** Width grows from 0% to 100% over 2s

---

## 💬 Testimonials Section

```
┌─────────────────────────────────────────────────────────────────────┐
│  TESTIMONIALS                                                        │
│                                                                      │
│  ╔════════════════╗  ╔════════════════╗  ╔════════════════╗        │
│  ║ "              ║  ║ "              ║  ║ "              ║        │
│  ║  [Quote Mark]  ║  ║  [Quote Mark]  ║  ║  [Quote Mark]  ║        │
│  ║                ║  ║                ║  ║                ║        │
│  ║  AquaBloom     ║  ║  Finally, an   ║  ║  The plant     ║        │
│  ║  transformed   ║  ║  app that      ║  ║  companion is  ║        │
│  ║  my hydration  ║  ║  makes water   ║  ║  genius! I'm   ║        │
│  ║  habits...     ║  ║  tracking...   ║  ║  so motivated  ║        │
│  ║                ║  ║                ║  ║  to keep it... ║        │
│  ║                ║  ║                ║  ║                ║        │
│  ║  ◉ Sarah Chen  ║  ║  ◉ Maya Patel  ║  ║  ◉ Emma Wilson ║        │
│  ║  @sarahwellnes ║  ║  @mayafitness  ║  ║  @emmabloom    ║        │
│  ╚════════════════╝  ╚════════════════╝  ╚════════════════╝        │
│   [Rotate: -1°]      [Rotate: 0.5°]      [Rotate: -0.8°]           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Testimonial Card Specs
- **Card dimensions:** 360×280px
- **Padding:** 32px
- **Quote mark:** 64px Georgia, 20% opacity, positioned -10px/-20px
- **Avatar:** 48×48px circle
- **Rotation:** Slight tilt (see angles above)

---

## 🌱 Plant Growth Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│  HOW IT WORKS                                                        │
│                                                                      │
│  ┌──────┐        ┌──────┐        ┌──────┐        ┌──────┐          │
│  │      │        │      │        │      │        │      │          │
│  │  🪴  │   →    │  🌱  │   →    │  🌸  │   →    │  🌺  │          │
│  │      │        │      │        │      │        │      │          │
│  └──────┘        └──────┘        └──────┘        └──────┘          │
│   80×80px         80×80px         80×80px         80×80px          │
│                                                                      │
│    Day 1          Day 3           Day 7          Day 14            │
│  Empty Pot       Sprout         Blooming        Full Bloom         │
│  [Grayscale]    [Grayscale]    [Grayscale]     [Grayscale]        │
│                                                                      │
│  Hover effect: Scale 1.3 + translateY(-8px) + Remove grayscale     │
│                + Add sparkle ✨ at top-right corner                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Plant Icon Specs
- **Container:** 80×80px circle
- **Background:** `rgba(126,200,200,0.05)`
- **Icon size:** 48×48px
- **Default filter:** Grayscale 30%
- **Hover transform:** Scale 1.3, translateY(-8px)

---

## 💰 Pricing Cards

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRICING                                                             │
│                                                                      │
│  ┌──────────────┐              ┌──────────────┐                    │
│  │╔════════════╗│              │╔════════════╗│                    │
│  │║   FREE     ║│              │║  PREMIUM   ║│  ⭐ Highlighted    │
│  │║            ║│              │║            ║│                    │
│  │║   $0       ║│              │║  $3.99/mo  ║│                    │
│  │║   (48px)   ║│              │║  (48px)    ║│                    │
│  │║            ║│              │║            ║│                    │
│  │║ ✓ Feature  ║│              │║ ✓ All Free ║│                    │
│  │║ ✓ Feature  ║│              │║ ✓ Plus...  ║│                    │
│  │║ ✓ Feature  ║│              │║ ✓ Premium  ║│                    │
│  │║            ║│              │║            ║│                    │
│  │║ [Button]   ║│              │║ [Button]   ║│                    │
│  │╚════════════╝│              │╚════════════╝│                    │
│  └──────────────┘              └──────────────┘                    │
│   Default state                 [Gradient glow border]             │
│                                 Blur: 8px, Opacity: 40%             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Pricing Card Specs
- **Card dimensions:** 340×520px
- **Outer frame:** 344×524px (4px padding for border)
- **Border gradient:** Teal → Lavender → Rose (135°)
- **Border blur:** 8px
- **Premium card:** Border always visible at 40% opacity

---

## 🎨 Color Swatches (Copy-Paste Ready)

```
PRIMARY COLORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
● Teal       #7ec8c8   rgb(126, 200, 200)
● Lavender   #c4a7d7   rgb(196, 167, 215)
● Rose       #f0a6b9   rgb(240, 166, 185)
● Gold       #f0c674   rgb(240, 198, 116)

NEUTRALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
● BG Dark    #0d1117   rgb(13, 17, 23)
● Card BG    #161b22   rgb(22, 27, 34)
● Text Light #e8eaed   rgb(232, 234, 237)
● Text Muted #6b7280   rgb(107, 114, 128)

GRADIENTS (CSS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bloom:  linear-gradient(135deg, #7ec8c8 0%, #c4a7d7 50%, #f0a6b9 100%)
Button: linear-gradient(135deg, #7ec8c8 0%, #c4a7d7 100%)
Glow:   radial-gradient(circle at top right, rgba(126,200,200,0.15) 0%, transparent 60%)
```

---

## 📏 Spacing System

```
PADDING/MARGIN SCALE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4px   = XXS (tight gaps)
8px   = XS  (button padding vertical)
12px  = S   (small gaps)
16px  = M   (default gap)
24px  = L   (button padding horizontal, card gaps)
32px  = XL  (card padding, grid gaps)
48px  = 2XL (section spacing)
80px  = 3XL (large section spacing)
120px = 4XL (section padding top/bottom)
```

---

## 🎯 Interactive States Summary

### Buttons
- **Default:** Gradient background, 28px radius
- **Hover:** Scale 1.05, add glow shadow
- **Active:** Ripple effect animation

### Feature Cards
- **Default:** Wave border radius
- **Hover:** Morph to blob shape, lift up 8px, rotate 1°
- **Featured:** Petal shape, glow shadow

### Plant Icons
- **Default:** Grayscale 30%
- **Hover:** Remove grayscale, scale 1.3, lift 8px, add sparkle

### Testimonials
- **Default:** Slight rotation (-1° to 0.5°)
- **Hover:** Reset rotation to 0°, scale 1.05, lift 8px

### Pricing Cards
- **Default:** Solid border
- **Hover:** Animated gradient border with blur
- **Premium:** Border always visible with glow

---

## 🚀 Quick Start Checklist

Before opening Figma:
- [ ] Read FIGMA-DESIGN-SPEC.md for detailed component specs
- [ ] Copy color hex codes above
- [ ] Understand the layout grids
- [ ] Review animation requirements

In Figma:
- [ ] Set up canvas (1440px desktop artboard)
- [ ] Create color variables
- [ ] Create text styles
- [ ] Create effect styles (shadows)
- [ ] Build components in order of FIGMA-DESIGN-SPEC.md

**Time estimate:** 1h 50min total

---

**Visual guide complete!** Use this alongside FIGMA-DESIGN-SPEC.md for pixel-perfect implementation.

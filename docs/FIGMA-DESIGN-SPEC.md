# AquaBloom Landing Page - Figma Design Specification

**Purpose:** Translate the landing page redesign into implementable Figma designs  
**Timeline:** Implementation ready in 1h 50min  
**Constraint:** 🔒 Floating phone mockup stays unchanged

---

## 🎨 Figma File Setup

### Canvas Size & Artboards
- **Desktop:** 1440px width (standard)
- **Tablet:** 768px width
- **Mobile:** 375px width
- **Background:** `#0d1117` (dark)

### Design System Setup

Create a **Local Variables** library in Figma:

#### Color Variables
```
Colors/
├── Primary/
│   ├── teal: #7ec8c8
│   ├── lavender: #c4a7d7
│   ├── rose: #f0a6b9
│   └── gold: #f0c674
├── Neutrals/
│   ├── bg-dark: #0d1117
│   ├── card-bg: #161b22
│   ├── text-primary: #e8eaed
│   └── text-muted: #6b7280
└── Effects/
    ├── glow-teal: rgba(126,200,200,0.3)
    └── overlay-gradient: rgba(126,200,200,0.05)
```

#### Typography Styles
Create **Text Styles**:
- **Hero Title:** 48px, Bold, -2% letter-spacing
- **Section Title:** 32px, SemiBold
- **Body:** 16px, Regular, 150% line-height
- **Caption:** 14px, Medium, 2px letter-spacing (uppercase)

#### Effect Styles
Create **Effect Styles**:
- **Soft Shadow:** 0px 4px 20px rgba(0,0,0,0.15)
- **Lifted Shadow:** 0px 8px 32px rgba(126,200,200,0.2)
- **Glow Shadow:** 0px 0px 40px rgba(126,200,200,0.3)

---

## 🎯 Components to Design in Figma

### 1. Hero Section Floating Elements

**Component Name:** `hero/water-droplets`

#### Droplet Shape
1. Create a **60×70px circle**
2. Use **Pen tool** to adjust bottom-right anchor point:
   - Pull down to create teardrop shape
3. **Fill:** Linear gradient
   - Start: `rgba(126,200,200,0.15)`
   - End: `rgba(196,167,215,0.15)`
   - Angle: 135°
4. **Effects:**
   - Background Blur: 10px
   - Opacity: 30%
5. **Rotation:** -45°

**Variants (3 sizes):**
- Large: 60×70px
- Medium: 50×60px
- Small: 40×50px

**Placement (on 1440px canvas):**
- Drop 1: X: 144px, Y: 15% from top
- Drop 2: X: 1296px (right edge - 8%), Y: 60% from top
- Drop 3: X: 360px (25% from left), Y: 80% from top

---

### 2. CTA Buttons with Effects

**Component Name:** `buttons/primary-cta`

#### Design Specs
1. **Frame:** 180×56px, Auto-layout (horizontal, padding 24px)
2. **Background:** Linear gradient
   - Color 1: `#7ec8c8` (0%)
   - Color 2: `#c4a7d7` (100%)
   - Angle: 135°
3. **Border Radius:** 28px
4. **Text:** "Get Started Free" (16px, SemiBold, white)
5. **Shadow:** Lifted Shadow effect

#### Shimmer Overlay
1. Create **Rectangle** same size as button
2. **Fill:** Linear gradient
   - Stop 1 (0%): Transparent
   - Stop 2 (50%): `rgba(255,255,255,0.1)`
   - Stop 3 (100%): Transparent
   - Angle: 45°
3. **Blend Mode:** Overlay
4. **Mask:** Clip to button bounds

**Hover State Variant:**
- Transform: Scale 1.05
- Shadow: Glow Shadow effect

---

### 3. Feature Cards with Organic Shapes

**Component Name:** `cards/feature-card`

#### Base Card
1. **Frame:** 380×420px (desktop), Auto-layout vertical
2. **Padding:** 32px all sides
3. **Background:** `#161b22`
4. **Border Radius:** Use **Corner Smoothing** plugin
   - Top-left: 40px
   - Top-right: 60px
   - Bottom-right: 40px
   - Bottom-left: 60px
   - Smoothing: 60%

#### Content Structure
```
Feature Card (Auto-layout, Vertical, Gap: 24px)
├── Icon Container (80×80px)
│   ├── Background: Gradient circle (teal → lavender)
│   └── Icon: 40×40px emoji or SVG
├── Title (Text, 24px SemiBold)
└── Description (Text, 16px Regular, text-muted)
```

**Hover State:**
- Border Radius morphs to: 50px/30px/70px/30px
- Transform: translateY(-8px)
- Shadow: Lifted Shadow

**Variants:**
- Default (wave shape)
- Featured (petal shape - use Corner Radius: 0px on bottom-left)

---

### 4. Social Proof Counters with Progress Bars

**Component Name:** `stats/proof-item`

#### Design
1. **Frame:** Auto-layout vertical, gap: 12px
2. **Number:** 48px Bold, gradient text
   - Create text
   - Fill: Linear gradient (teal → lavender, 90°)
3. **Label:** 14px Medium, text-muted, uppercase, 2px tracking
4. **Progress Bar:**
   - Container: 100% width × 3px, `rgba(126,200,200,0.1)`
   - Fill: Linear gradient (teal → rose), 0% → 100% width

**Animation Note (for developer):**
Add prototype: After delay 0.3s → Fill width 0% to 100% (Smart Animate, 2s ease-out)

---

### 5. Testimonial Cards (Tilted)

**Component Name:** `testimonials/card`

#### Card Design
1. **Frame:** 360×280px
2. **Background:** `#161b22`
3. **Border Radius:** 20px
4. **Padding:** 32px
5. **Rotation:** 
   - Card 1: -1°
   - Card 2: 0.5°
   - Card 3: -0.8°

#### Quote Mark Decoration
1. **Text:** """ (straight quote)
2. **Font:** Georgia or serif fallback, 64px
3. **Fill:** `#7ec8c8` at 20% opacity
4. **Position:** Absolute, X: -10px, Y: -20px (outside frame, clip off)

**Content Structure:**
```
Testimonial Card (Auto-layout, Vertical, Gap: 20px)
├── Quote Text (16px Regular, line-height 150%)
├── Spacer (Auto)
└── Author Info (Horizontal, Gap: 12px)
    ├── Avatar (48×48px circle)
    └── Details (Vertical)
        ├── Name (16px SemiBold)
        └── Handle (14px Medium, text-muted)
```

**Hover State:**
- Rotation resets to 0°
- Transform: scale(1.05) translateY(-8px)
- Shadow: Lifted Shadow

---

### 6. Plant Stage Icons (Interactive Growth)

**Component Name:** `plants/stage-icon`

#### Default State
1. **Container:** 80×80px circle
2. **Background:** `rgba(126,200,200,0.05)`
3. **Icon:** 48×48px emoji
4. **Filter:** Grayscale 30% (use plugin or note for dev)

#### Hover State
1. **Transform:** Scale 1.3, translateY(-8px)
2. **Filter:** Grayscale 0%
3. **Sparkle Decoration:**
   - Add "✨" emoji at top-right corner
   - 24px size
   - Rotate 15°
   - Fade in animation note

**4 Variants:**
- Pot 🪴
- Sprout 🌱
- Bloom 🌸
- Full Bloom 🌺

---

### 7. Pricing Cards with Gradient Border

**Component Name:** `pricing/card`

#### Card Structure
1. **Outer Frame:** 340×520px
2. **Border Setup:**
   - Create rectangle 344×524px (4px larger)
   - Fill: Linear gradient (teal → lavender → rose, 135°)
   - Border Radius: 26px
3. **Inner Card:**
   - 340×520px
   - Background: `#161b22`
   - Border Radius: 24px
   - Position: Center in outer frame

#### Glow Effect (Hover)
- Add **Layer Blur:** 8px to outer frame
- Opacity: 0% (default) → 60% (hover)

**Highlighted Variant (Premium):**
- Outer frame opacity: 40% always
- Add additional Glow Shadow effect

---

### 8. Background Gradient Orbs

**Component Name:** `backgrounds/orb`

#### Orb Design
1. **Circle:** 400×400px
2. **Fill:** Radial gradient
   - Center: `rgba(126,200,200,0.08)`
   - Edge: Transparent
3. **Effects:** Gaussian Blur: 60px

**3 Sizes:**
- Large: 400×400px
- Medium: 300×300px
- Small: 200×200px

**Placement (1440px canvas):**
- Orb 1: Top-left (-100px, -100px) - Large
- Orb 2: Center-right (1200px, 40%) - Medium
- Orb 3: Bottom-left (200px, 80%) - Small

**Animation Note:**
Slow drift motion: Prototype with After Delay loops

---

## 🎬 Animation Specifications for Figma Prototype

### Prototype Connections

#### Button Hover
- Trigger: Mouse Enter
- Action: Change to → Hover variant
- Animation: Smart Animate, 0.3s ease-out

#### Feature Card Hover
- Trigger: Mouse Enter
- Action: Change to → Hover variant
- Animation: Smart Animate, 0.5s ease-in-out (spring curve)

#### Plant Icon Hover
- Trigger: Mouse Enter
- Action: Change to → Hover variant
- Animation: Smart Animate, 0.4s ease-out
- Note: Add bounce effect (overshoots scale to 1.4 then settles to 1.3)

#### Counter Animation
- Trigger: After Delay (0.5s when section scrolls into view)
- Action: Progress bar width 0% → 100%
- Animation: Smart Animate, 2s ease-out

---

## 📐 Layout Grid Setup

### Desktop (1440px)
- **Columns:** 12 columns
- **Gutter:** 24px
- **Margin:** 80px left/right
- **Type:** Center alignment

### Tablet (768px)
- **Columns:** 8 columns
- **Gutter:** 20px
- **Margin:** 40px left/right

### Mobile (375px)
- **Columns:** 4 columns
- **Gutter:** 16px
- **Margin:** 24px left/right

---

## 🎨 New Section Designs

### Parallax Separator

**Component Name:** `dividers/parallax-separator`

1. **Container:** Full width × 200px height
2. **Content:** 3 large emoji centered
   - 💧 (64px)
   - 🌿 (64px)
   - 🌸 (64px)
   - Spacing: 80px gap
3. **Opacity:** 10% each
4. **Arrangement:** Horizontal center alignment

**Layers (for parallax effect - note for dev):**
- Layer 1 (back): 💧 - slowest motion
- Layer 2 (mid): 🌿 - medium motion
- Layer 3 (front): 🌸 - fastest motion

---

### "As Seen In" Section

**Component Name:** `press/mentions`

1. **Container:** Full width × 180px
2. **Background:** `rgba(126,200,200,0.02)`
3. **Title:** "AS FEATURED IN" - Caption style
4. **Logos:** Horizontal auto-layout, gap: 48px
   - Placeholder text logos (24px Bold)
   - Grayscale filter: 100%
   - Opacity: 40%

**Logo Placeholders:**
- TechCrunch
- Product Hunt
- The Verge

---

## 📦 Figma Deliverables Checklist

### File Organization
- [ ] Create main page: "Landing Page - Desktop"
- [ ] Create page: "Landing Page - Mobile"
- [ ] Create page: "Components Library"
- [ ] Create page: "Design Tokens"

### Components Library Page
- [ ] Water droplets (3 sizes)
- [ ] CTA buttons (default + hover)
- [ ] Feature cards (default + hover + featured)
- [ ] Social proof counters
- [ ] Testimonial cards (3 rotations + hover)
- [ ] Plant icons (4 stages × 2 states)
- [ ] Pricing cards (default + hover + highlighted)
- [ ] Background orbs (3 sizes)
- [ ] Parallax separator
- [ ] Press mentions section

### Prototyping
- [ ] Link all hover states
- [ ] Add scroll trigger animations
- [ ] Test interactive flow

### Developer Handoff
- [ ] Inspect panel shows correct variable names
- [ ] Export all icons as SVG
- [ ] Document animation timings in description
- [ ] Add CSS code snippets in component descriptions

---

## 🎯 Priority Implementation Order (1h 50min)

### Phase 1: Quick Wins (30 min)
1. ✅ Set up design system (colors, typography, effects)
2. ✅ Design water droplets
3. ✅ Design CTA buttons with shimmer
4. ✅ Create social proof counters

### Phase 2: Core Components (50 min)
5. ✅ Design feature cards with organic shapes
6. ✅ Create testimonial cards
7. ✅ Design pricing cards with glow borders
8. ✅ Create plant stage icons

### Phase 3: Finishing Touches (30 min)
9. ✅ Add background orbs
10. ✅ Design parallax separator
11. ✅ Set up prototyping connections
12. ✅ Add hover states and animations

---

## 💡 Pro Tips for Figma Implementation

### Use Plugins
- **Corner Smoothing:** For organic border radius
- **Blobs:** Generate random organic shapes quickly
- **Noise & Texture:** Add subtle grain to gradients

### Auto-Layout Best Practices
- Use **Hug Contents** for buttons
- Use **Fill Container** for cards
- Set **Min/Max width** constraints for responsive behavior

### Component Variants
- Create **Property:** State (Default, Hover, Active)
- Create **Property:** Size (Small, Medium, Large) where applicable
- Use **Boolean:** Featured (On/Off) for special styling

### Export Settings
- SVG for icons (outline strokes, flatten transforms)
- PNG @2x for images
- Copy CSS for gradients and shadows

---

## 📋 Developer Handoff Notes

When ready to hand off to developers:

1. **Share Figma link** with "Can View" access
2. **Enable Dev Mode** in Figma file
3. **Add notes** to components explaining:
   - CSS animations (keyframes not in Figma)
   - Scroll triggers
   - Performance optimizations
4. **Export assets** to `aquabloom/docs/assets/`

---

**Ready to implement?** Follow this spec in Figma, and all designs will match the technical implementation in `LANDING-PAGE-REDESIGN.md`.

**Estimated Figma time:** 1h 50min (matches your deadline)

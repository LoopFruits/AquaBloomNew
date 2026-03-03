// AquaBloom Design System
// Women-focused, elegant color palette with soft gradients

export const COLORS = {
  // Primary palette
  teal: '#7ec8c8',
  lavender: '#c4a7d7',
  rose: '#f0a6b9',
  blush: '#f5c6d0',

  // Backgrounds
  bgPrimary: '#0d1117',
  bgSecondary: '#151b26',
  bgTertiary: '#1a1525',
  bgCard: 'rgba(18, 22, 30, 0.95)',
  bgCardSubtle: 'rgba(126, 200, 200, 0.04)',
  bgCardHover: 'rgba(126, 200, 200, 0.06)',

  // Text
  textPrimary: '#e8eaed',
  textSecondary: '#9ba3af',
  textMuted: '#6b7280',
  textAccent: '#7ec8c8',

  // Borders
  borderLight: 'rgba(126, 200, 200, 0.1)',
  borderMedium: 'rgba(126, 200, 200, 0.15)',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#7ec8c8', '#c4a7d7', '#f0a6b9'],
  gradientSubtle: ['rgba(126,200,200,0.15)', 'rgba(196,167,215,0.15)'],
  gradientBg: ['#0d1117', '#151b26', '#1a1525'],

  // Monetization
  premiumGold: '#f0c674',
  premiumGoldLight: 'rgba(240, 198, 116, 0.1)',

  // Status
  success: '#7ec8c8',
  warning: '#f0c674',
  error: '#f0a6b9',

  // Transparency helpers
  white05: 'rgba(255,255,255,0.05)',
  white10: 'rgba(255,255,255,0.1)',
  black50: 'rgba(0,0,0,0.5)',
};

export const FONTS = {
  // Display/Heading font
  display: {
    light: 'Cormorant-Light',
    regular: 'Cormorant-Regular',
    medium: 'Cormorant-Medium',
    semiBold: 'Cormorant-SemiBold',
  },
  // Body font
  body: {
    light: 'Nunito-Light',
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: '#7ec8c8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
};

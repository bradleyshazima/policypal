export const LIGHT_COLORS = {
  blue: '#2772fa',
  accent: 'rgba(206, 231, 255, 1)',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  white: '#ffffff',
  black: '#171717',
  gray: '#6e6e6e',
  lightGray: '#fefefe',
  primary: '#e9e9e9ff',
  background: '#ffffff',
  text: '#171717',
  cardBg: '#ffffff',
};

export const DARK_COLORS = {
  blue: '#3b82f6',
  accent: 'rgba(59, 130, 246, 0.2)',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  white: '#1f2937',
  black: '#f3f4f6',
  gray: '#9ca3af',
  lightGray: '#111827',
  primary: '#1f2937',
  background: '#111827',
  text: '#f3f4f6',
  cardBg: '#1f2937',
};

// Default to light colors
export let COLORS = { ...LIGHT_COLORS };

export const setColorScheme = (isDark) => {
  Object.keys(COLORS).forEach(key => {
    COLORS[key] = isDark ? DARK_COLORS[key] : LIGHT_COLORS[key];
  });
};

export const SIZES = {
  xsmall: 10,
  small: 12,
  base: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
};
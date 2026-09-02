import type { Config } from 'tailwindcss';
import { tokens } from '@devocional/ui-kit/tokens';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        neutral: tokens.colors.neutral,
        scripture: tokens.colors.scripture,
        prayer: tokens.colors.prayer,
        error: tokens.colors.error,
        success: tokens.colors.success,
      },
      spacing: tokens.spacing,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows,
      screens: tokens.breakpoints,
    },
  },
  plugins: [],
};

export default config;
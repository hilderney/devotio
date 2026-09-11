import type { Config } from "tailwindcss";
import { tokens } from "../../packages/ui-kit/tokens";

const config: Config = {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: tokens.colors.background.canvas,
        surface: tokens.colors.background.surface,
        mutedBg: tokens.colors.background.muted,
        subtleBg: tokens.colors.background.subtle,

        textPrimary: tokens.colors.text.primary,
        textSecondary: tokens.colors.text.secondary,
        textMuted: tokens.colors.text.muted,
        textInverse: tokens.colors.text.inverse,

        monthlyBg: tokens.colors.monthlyVerse.bg,
        monthlyText: tokens.colors.monthlyVerse.text,
        monthlyRef: tokens.colors.monthlyVerse.reference,
        monthlyBorder: tokens.colors.monthlyVerse.border,

        weeklyBg: tokens.colors.weeklyVerse.bg,
        weeklyText: tokens.colors.weeklyVerse.text,
        weeklyRef: tokens.colors.weeklyVerse.reference,
        weeklyBorder: tokens.colors.weeklyVerse.border,

        prayerBg: tokens.colors.prayer.bg,
        prayerBorder: tokens.colors.prayer.border,
        prayerAccent: tokens.colors.prayer.accent,
        prayerText: tokens.colors.prayer.text,
        prayerTitle: tokens.colors.prayer.title,

        audioBg: tokens.colors.audio.bg,
        audioBar: tokens.colors.audio.bar,
        audioProgress: tokens.colors.audio.progress,
        audioErrorBg: tokens.colors.audio.errorBg,
        audioErrorText: tokens.colors.audio.errorText,
        audioErrorBorder: tokens.colors.audio.errorBorder,

        uiBorder: tokens.colors.ui.border,
        skeleton: tokens.colors.ui.skeleton,
        skeletonHighlight: tokens.colors.ui.skeletonHighlight,
      },
      fontFamily: {
        serif: [tokens.typography.fontFamily.serif],
        sans: [tokens.typography.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;

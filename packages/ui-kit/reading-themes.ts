import { tokens } from "./tokens";
const colors = tokens.colors;
const day = {
  paper: colors.background.canvas, surface: colors.background.surface, wash: colors.background.muted,
  line: colors.ui.border, ink: colors.text.primary, muted: colors.text.secondary, quiet: colors.text.muted,
  dark: colors.primary.DEFAULT, inverse: colors.primary.foreground, gold: colors.prayer.title,
  error: colors.audio.errorText, "error-bg": colors.audio.errorBg,
  theme: colors.monthlyVerse.bg, "theme-ink": colors.monthlyVerse.text,
  prayer: colors.prayer.bg, "prayer-line": colors.prayer.border,
};
export const readingThemes: Record<"day" | "night" | "papyrus" | "contrast", Record<string, string>> = {
  day,
  night: { paper: "#171612", surface: "#222019", wash: "#2c2920", line: "#685e47", ink: "#e9dfc1", muted: "#c6b998", quiet: "#b6a88a", dark: "#e9dfc1", inverse: "#171612", gold: "#dbc18a", theme: "#242016", "theme-ink": "#eadbb2", prayer: "#302819", "prayer-line": "#b9a276" },
  papyrus: { paper: "#eee6d5", surface: "#f7f0e1", wash: "#e4dac7", line: "#b8a990", ink: "#33291f", muted: "#605345", quiet: "#6b5d4d", dark: "#44372a", inverse: "#fbf3e3", gold: "#715229", theme: "#504536", "theme-ink": "#f7ecd8", prayer: "#e8dcc2", "prayer-line": "#a68c62" },
  contrast: { paper: "#000000", surface: "#000000", wash: "#181818", line: "#ffffff", ink: "#ffffff", muted: "#ffffff", quiet: "#ffffff", dark: "#ffffff", inverse: "#000000", gold: "#ffff00", theme: "#000000", "theme-ink": "#ffffff", prayer: "#242424", "prayer-line": "#ffff00" },
};
readingThemes.night.error = "#ffb4a5"; readingThemes.night["error-bg"] = "#3c211b";
readingThemes.papyrus.error = "#8a2520"; readingThemes.papyrus["error-bg"] = "#f5dfd1";
readingThemes.contrast.error = "#ffff00"; readingThemes.contrast["error-bg"] = "#000000";

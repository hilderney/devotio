import type { ReadingPreferences } from "./validators/preferences";
export { readingFontSizes, readingPreferencesSchema, type ReadingPreferences } from "./validators/preferences";
export const defaultReadingPreferences: ReadingPreferences = { theme: "day", fontSize: 20, mode: "paged" };
export function resolveReadingTheme(theme: ReadingPreferences["theme"], now: Date) {
  return theme === "clock" ? (now.getHours() >= 6 && now.getHours() < 18 ? "day" : "night") : theme;
}
export function nextThemeTransition(now: Date): number {
  const next = new Date(now);
  next.setHours(now.getHours() < 6 ? 6 : now.getHours() < 18 ? 18 : 30, 0, 0, 0);
  return next.getTime() - now.getTime();
}
export function chapterWindow(chapter: number, total: number): number[] {
  return [chapter - 1, chapter, chapter + 1].filter(value => value >= 1 && value <= total);
}

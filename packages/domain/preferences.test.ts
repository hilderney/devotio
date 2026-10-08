import { describe, expect, it } from "vitest";
import { readingPreferencesSchema, resolveReadingTheme, nextThemeTransition, chapterWindow } from "./preferences";

describe("preferências de leitura", () => {
  it("valida escolhas e rejeita tamanho/tema/modo desconhecido", () => {
    expect(readingPreferencesSchema.safeParse({ theme: "clock", fontSize: 32, mode: "continuous" }).success).toBe(true);
    for (const patch of [{ fontSize: 15 }, { theme: "unknown" }, { mode: "automatic" }]) expect(readingPreferencesSchema.safeParse({ theme: "day", fontSize: 20, mode: "paged", ...patch }).success).toBe(false);
  });
  it("resolve relógio local nas duas fronteiras, preservando temas explícitos", () => {
    for (const [hour, expected] of [[5, "night"], [6, "day"], [17, "day"], [18, "night"], [23, "night"]] as const) {
      const now = new Date(2026, 9, 8, hour);
      expect(resolveReadingTheme("clock", now)).toBe(expected);
      expect(resolveReadingTheme("papyrus", now)).toBe("papyrus");
      expect(nextThemeTransition(now)).toBeGreaterThan(0);
    }
    expect(nextThemeTransition(new Date(2026, 9, 8, 17, 59))).toBe(60000);
    expect(nextThemeTransition(new Date(2026, 9, 8, 23))).toBe(7 * 3600000);
  });
  it("limita vizinhos ao livro e respeita livros de um capítulo", () => {
    expect(chapterWindow(1, 1)).toEqual([1]);
    expect(chapterWindow(1, 21)).toEqual([1, 2]);
    expect(chapterWindow(3, 21)).toEqual([2, 3, 4]);
    expect(chapterWindow(21, 21)).toEqual([20, 21]);
  });
});

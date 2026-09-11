// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDailyDevotional } from "./useDailyDevotional";
import { useMonthlyAndWeeklyVerse } from "./useMonthlyAndWeeklyVerse";

describe("useDailyDevotional", () => {
  it("deve reportar isLoading = true quando queryResult é undefined", () => {
    const { result } = renderHook(() =>
      useDailyDevotional({ queryResult: undefined })
    );
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it("deve reportar isEmpty = true quando queryResult é null", () => {
    const { result } = renderHook(() =>
      useDailyDevotional({ queryResult: null })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it("deve expor os dados quando queryResult for retornado", () => {
    const mockData = {
      date: "2026-09-11",
      scripture: "Salmos 23:1",
      reflection: "O Senhor é o meu pastor...",
      prayerSuggestion: "Agradeça pelo cuidado de Deus.",
      createdAt: 1726050000,
    };
    const { result } = renderHook(() =>
      useDailyDevotional({ queryResult: mockData })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.data).toEqual(mockData);
  });
});

describe("useMonthlyAndWeeklyVerse", () => {
  it("deve lidar com ausência de settings silenciosamente", () => {
    const { result } = renderHook(() =>
      useMonthlyAndWeeklyVerse({ queryResult: null })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasSettings).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it("deve retornar hasSettings = true quando configurado", () => {
    const { result } = renderHook(() =>
      useMonthlyAndWeeklyVerse({
        queryResult: {
          monthlyVerse: "João 15:5",
          weeklyVerse: "Gálatas 5:22",
          updatedAt: 1726050000,
        },
      })
    );
    expect(result.current.hasSettings).toBe(true);
    expect(result.current.data?.monthlyVerse).toBe("João 15:5");
  });
});

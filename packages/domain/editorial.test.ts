import { describe, expect, it } from "vitest";
import { availableEditorialDates, editorialMonthDates, editorialSaveSchema, shiftEditorialMonth } from "./editorial";
import { publicationMidnight } from "./reading";
const draft = { date: "2026-10-09", reflection: "R", prayerSuggestion: "O", mode: "create" as const,
  selection: { book: "jo", chapter: 1, first: 1, last: 1, version: "alm1911" as const } };
describe("cadastro editorial", () => {
  it("lista só datas livres de hoje em diante e navega meses/ano bissexto", () => {
    const free = availableEditorialDates("2026-10", ["2026-10-09", "2026-10-12"], "2026-10-09");
    expect(free[0]).toBe("2026-10-10"); expect(free).not.toContain("2026-10-12");
    expect(editorialMonthDates("2028-02")).toHaveLength(29);
    expect(shiftEditorialMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftEditorialMonth("2026-01", -1)).toBe("2025-12");
  });
  it("limita ambos os textos a 512, exige seleção na criação e motivo na correção", () => {
    expect(editorialSaveSchema.safeParse({ ...draft, reflection: "R".repeat(512) }).success).toBe(true);
    for (const key of ["reflection", "prayerSuggestion"]) expect(editorialSaveSchema.safeParse({ ...draft, [key]: "R".repeat(513) }).success).toBe(false);
    expect(editorialSaveSchema.safeParse({ ...draft, selection: undefined }).success).toBe(false);
    expect(editorialSaveSchema.safeParse({ ...draft, mode: "update", selection: undefined }).success).toBe(false);
    expect(editorialSaveSchema.safeParse({ ...draft, mode: "update", selection: undefined, reason: "Correção humana" }).success).toBe(true);
    expect(publicationMidnight(draft.date)).toBe(Date.parse("2026-10-09T03:00:00Z"));
  });
});

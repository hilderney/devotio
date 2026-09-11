import { describe, it, expect } from "vitest";
import { todayLocalISODate } from "./todayLocalISODate";

describe("todayLocalISODate", () => {
  it("deve formatar datas com zero-padding correto (YYYY-MM-DD)", () => {
    // 5 de Março de 2026 às 12:00 UTC
    const date = new Date(Date.UTC(2026, 2, 5, 12, 0, 0));
    const result = todayLocalISODate(date, "UTC");
    expect(result).toBe("2026-03-05");
  });

  it("deve refletir a virada de dia em diferentes timezones para o mesmo instante UTC", () => {
    // 2026-09-11 01:30:00 UTC
    // Em São Paulo (UTC-3): ainda é 2026-09-10 às 22:30
    // Em Tóquio (UTC+9): já é 2026-09-11 às 10:30
    const instant = new Date(Date.UTC(2026, 8, 11, 1, 30, 0));

    const spDate = todayLocalISODate(instant, "America/Sao_Paulo");
    const tokyoDate = todayLocalISODate(instant, "Asia/Tokyo");

    expect(spDate).toBe("2026-09-10");
    expect(tokyoDate).toBe("2026-09-11");
  });

  it("deve tratar corretamente virada de meia-noite local exata", () => {
    // 2026-10-01 02:59:59 UTC -> Em São Paulo (UTC-3) é 2026-09-30 23:59:59
    const beforeMidnight = new Date(Date.UTC(2026, 9, 1, 2, 59, 59));
    expect(todayLocalISODate(beforeMidnight, "America/Sao_Paulo")).toBe("2026-09-30");

    // 2026-10-01 03:00:00 UTC -> Em São Paulo (UTC-3) é 2026-10-01 00:00:00
    const atMidnight = new Date(Date.UTC(2026, 9, 1, 3, 0, 0));
    expect(todayLocalISODate(atMidnight, "America/Sao_Paulo")).toBe("2026-10-01");
  });

  it("deve lidar com transições de horário de verão (ex: America/New_York)", () => {
    // Em Nova York, o horário de verão começa no segundo domingo de março.
    // 2026-03-08 06:59:00 UTC é 01:59:00 EST (UTC-5) -> 2026-03-08
    const dateWinter = new Date(Date.UTC(2026, 2, 8, 6, 59, 0));
    expect(todayLocalISODate(dateWinter, "America/New_York")).toBe("2026-03-08");

    // No verão: 2026-07-01 03:30:00 UTC -> 23:30 EDT (UTC-4) de 2026-06-30
    const summerEve = new Date(Date.UTC(2026, 6, 1, 3, 30, 0));
    expect(todayLocalISODate(summerEve, "America/New_York")).toBe("2026-06-30");
  });
});

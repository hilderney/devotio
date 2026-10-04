import { describe, it, expect } from "vitest";
import {
  canManage,
  canRemoveMember,
  isPublished,
  localDate,
  tickChange,
} from "./rules";
import {
  dateSchema,
  inviteSchema,
  messageSchema,
  publicationSchema,
  checklistSchema,
} from "./validators";
describe("regras compartilhadas", () => {
  it("reserva a gestão à liderança e protege o último administrador", () => {
    expect(canManage("member")).toBe(false);
    expect(canManage(undefined)).toBe(false);
    expect(canManage("admin")).toBe(true);
    expect(canRemoveMember("admin", 1)).toBe(false);
    expect(canRemoveMember("admin", 2)).toBe(true);
    expect(canRemoveMember("member", 1)).toBe(true);
  });
  it("não revela publicação futura ou retirada", () => {
    expect(isPublished(101, false, 100)).toBe(false);
    expect(isPublished(100, false, 100)).toBe(true);
    expect(isPublished(99, true, 100)).toBe(false);
  });
  it("usa a data local sem conversão UTC", () =>
    expect(localDate(new Date(2026, 9, 3, 0, 1))).toBe("2026-10-03"));
  it("valida o calendário, incluindo anos bissextos", () => {
    expect(dateSchema.safeParse("2025-02-29").success).toBe(false);
    expect(dateSchema.parse("2024-02-29")).toBe("2024-02-29");
    expect(dateSchema.safeParse("2026-13-01").success).toBe(false);
  });
  it("marcações expressam estado desejado e são idempotentes", () => {
    expect(tickChange(false, true)).toBe("insert");
    expect(tickChange(true, true)).toBe("none");
    expect(tickChange(true, false)).toBe("delete");
    expect(tickChange(false, false)).toBe("none");
  });
  it("normaliza convites e recusa mensagens vazias", () => {
    expect(inviteSchema.parse(" esperanc ")).toBe("ESPERANC");
    expect(inviteSchema.safeParse("123").success).toBe(false);
    expect(messageSchema.safeParse("   ").success).toBe(false);
    expect(messageSchema.safeParse("x".repeat(1001)).success).toBe(false);
  });
  it("recusa listas sem itens e publicações sem revisão", () => {
    expect(
      checklistSchema.safeParse({ name: "Lista", items: [] }).success,
    ).toBe(false);
    expect(publicationSchema.safeParse({ date: "2026-10-03" }).success).toBe(
      false,
    );
  });
});

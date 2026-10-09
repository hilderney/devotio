import { describe, expect, it } from "vitest";
import { applyEditorialQuote, editorialDraft } from "./writing";
import { bibleQuote } from "./sharing";

describe("preparação editorial", () => {
  it("trocar Palavra preserva os demais campos e separa corpo, endereço, versão e seleção", () => {
    const draft = { ...editorialDraft(), date: "2099-12-31", reflection: "Meditação em andamento", prayerSuggestion: "Oração em andamento", programming: true, query: "amor" };
    const quote = bibleQuote({ book: { abbrev: "jo", name: "João", chapters: 21, testament: "NT", order: 43 }, chapter: 1, verses: [{ abbrev: "jo", bookName: "João", chapter: 1, number: 2, text: "Texto bíblico" }] }, { book: "jo", chapter: 1, first: 2, last: 2, version: "aa" });
    expect(applyEditorialQuote(draft, quote)).toEqual({ ...draft, scripture: "2 - Texto bíblico", reference: "João 1:2", translation: "Almeida Atualizada (AA)", selection: quote, version: "aa" });
    expect(editorialDraft(undefined, quote).reflection).toBe("");
  });
});

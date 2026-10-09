import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { createBibleRepository } from "./bible";
import { alm1911DatasetSchema, alm1911Base, alm1911Revision, resolveBibleVersion } from "./validators/bible";
import { bibleQuote, bibleQuotePath } from "./sharing";
import { readingPreferencesSchema } from "./preferences";
import type { BibleChapter, BibleCatalog } from "./reading";
import type { Watch } from "./types";

const raw = readFileSync(new URL("../../docs/bibles/ALM1911.json", import.meta.url));
const books = alm1911DatasetSchema.parse(JSON.parse(raw.toString("utf8")));
const catalog: BibleCatalog = { version: "alm1911", books: books.map(({ chapters, ...b }) => ({ ...b, chapters: chapters.length })), verses: 31101, importedAt: null, source: "Arquivo fornecido" };
function content(abbrev: string, number: number): BibleChapter {
  const b = books.find(b => b.abbrev === abbrev)!;
  return { version: "alm1911", book: catalog.books.find(b => b.abbrev === abbrev)!, chapter: number,
    verses: b.chapters[number - 1].map((text, i) => ({ abbrev, bookName: b.name, chapter: number, number: i + 1, text })) };
}
const value = <T>(watch: Watch<T>) => new Promise<T>((resolve, reject) => {
  const stop = watch(v => { stop(); resolve(v); }, e => { stop(); reject(e); });
});
function setup() {
  let saved: BibleChapter[] = [];
  const load = vi.fn(async (path: string): Promise<unknown> => {
    if (path.endsWith("catalog.json")) return catalog;
    if (path.endsWith("search.json")) return [["gn", 1, 1, "principio creou deus ceus terra"], ["jo", 1, 1, "principio verbo deus"]];
    const [, abbrev, number] = path.match(/\/([a-z0-9]+)\/(\d+)\.json$/)!;
    return content(abbrev, Number(number));
  });
  const repo = createBibleRepository({ load, storage: { read: () => saved, write: chapters => { saved = chapters; } } });
  return { repo, reader: repo.forVersion("alm1911"), load, saved: () => saved };
}
describe("corpus e leitura por edição", () => {
  it("valida fonte real, hash, ordem canônica e texto sem modernizar", () => {
    expect(createHash("sha256").update(raw).digest("hex")).toBe(alm1911Revision);
    expect(books).toHaveLength(66);
    expect(books.reduce((n, b) => n + b.chapters.length, 0)).toBe(1189);
    expect(books.reduce((n, b) => n + b.chapters.reduce((s, c) => s + c.length, 0), 0)).toBe(31101);
    expect(books[0].chapters[0][0]).toBe("No principio creou Deus os céus e a terra.");
    expect(books[17].abbrev).toBe("job");
    expect(books[42].abbrev).toBe("jo");
    const invalid = JSON.parse(raw.toString("utf8"));
    [invalid[0], invalid[1]] = [invalid[1], invalid[0]];
    expect(alm1911DatasetSchema.safeParse(invalid).success).toBe(false);
  });
  it("deduplica capítulos e conserva no máximo seis com janela atual protegida", async () => {
    const t = setup();
    const [a, b] = await Promise.all([value(t.reader.watchChapter("jo", 1)), value(t.reader.watchChapter("jo", 1))]);
    expect(a).toEqual(b);
    expect(t.load.mock.calls.filter(([p]) => p.endsWith("jo/1.json"))).toHaveLength(1);
    for (let n = 2; n < 12; n++) await value(t.reader.watchChapter("jo", n));
    expect(t.saved()).toHaveLength(6);
    expect(t.saved().some(c => c.chapter === 11)).toBe(true);
    expect(await value(t.reader.watchChapter("jo", 22))).toBeNull();
    expect(t.load.mock.calls.some(([p]) => p.endsWith("jo/22.json"))).toBe(false);
  });
  it("busca só nesta edição, com acentos/prefixos e texto hidratado do capítulo", async () => {
    const t = setup();
    const results = await value(t.reader.watchSearch("PRINCÍPIO deu", 0));
    expect(results.total).toBe(2);
    expect(results.verses[0].text).toBe(books[0].chapters[0][0]);
    expect((await value(t.reader.watchSearch("PRINCÍPIO deu", 1))).verses).toEqual([]);
    expect(t.load).toHaveBeenCalledWith(`${alm1911Base}/search.json`);
  });
  it("ignora resposta após unsubscribe e permite repetir após falha", async () => {
    const t = setup();
    t.load.mockRejectedValueOnce(new Error("offline"));
    await expect(value(t.reader.watchBible())).rejects.toThrow("offline");
    expect((await value(t.reader.watchBible())).version).toBe("alm1911");
    const next = vi.fn(), error = vi.fn();
    const stop = t.reader.watchChapter("jo", 1)(next, error);
    stop();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(next).not.toHaveBeenCalled(); expect(error).not.toHaveBeenCalled();
  });
  it("mantém preferências antigas e exige que edição da seleção coincida com texto", () => {
    const old = { theme: "papyrus", fontSize: 24, mode: "continuous" };
    expect(readingPreferencesSchema.parse(old)).toEqual(old);
    expect(resolveBibleVersion(undefined, ["aa", "alm1911"])).toBe("aa");
    expect(resolveBibleVersion("aa", ["alm1911"])).toBe("alm1911");
    const selection = { book: "gn", chapter: 1, first: 1, last: 1, version: "alm1911" as const };
    const quote = bibleQuote(content("gn", 1), selection);
    expect(quote.versionName).toBe("Almeida 1911 (ALM1911)");
    expect(bibleQuotePath(quote)).toContain("version=alm1911");
    expect(() => bibleQuote(content("gn", 1), { ...selection, version: "aa" })).toThrow("outra versão");
  });
});

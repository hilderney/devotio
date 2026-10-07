import { describe, expect, it } from "vitest";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, sep, basename } from "node:path";
import { tmpdir } from "node:os";
import { LocalDatabase } from "./database.local";
import type { BibleResults } from "domain/core";
const source = resolve(import.meta.dirname, "../../../.data/bible");

// Local acceptance uses the selected provider's actual dataset, never a substitute edition.
// On a fresh checkout, run npm run setup:local to enable this corpus acceptance test.
describe.skipIf(!existsSync(join(source, "aa.json")))("aceite do corpus AA preparado", () => {
  it("importa 66 livros/1189 capítulos/31104 versículos, busca e repete sem duplicatas", () => {
    const db = new LocalDatabase(":memory:", source);
    try {
      expect(db.catalog().books).toHaveLength(66); expect(db.catalog().verses).toBe(31104);
      expect(db.get<{ n: number }>("SELECT COUNT(*) n FROM (SELECT DISTINCT abbrev,chapter FROM bibleVerses)")?.n).toBe(1189);
      expect(db.chapter("job", 42)?.verses).toHaveLength(17);
      expect(db.chapter("at", 28)?.verses).toHaveLength(31);
      expect(db.chapter("tt", 3)?.verses).toHaveLength(15);
      expect(db.chapter("fm", 1)?.verses).toHaveLength(25);
      expect(db.chapter("fm", 2)).toBeNull();
      const query = (text: string) => db.query(db.profile("marina"), { query: "search", text, page: 0 }) as BibleResults;
      expect(query("oração").total).toBe(query("oracao").total);
      expect(query("oração").total).toBeGreaterThan(40); expect(query("oração").verses).toHaveLength(40);
      expect(query("***").total).toBe(0);
      db.importBible(source); expect(db.catalog().verses).toBe(31104);
    } finally { db.close(); }
  });
  it("reverte toda a importação se um livro divergir no meio da transação", () => {
    const dir = mkdtempSync(join(tmpdir(), "devotio-bible-test-"));
    if (!resolve(dir).startsWith(resolve(tmpdir()) + sep) || !basename(dir).startsWith("devotio-bible-test-")) throw new Error("Diretório temporário inesperado");
    const db = new LocalDatabase(":memory:", source);
    try {
      for (const file of ["aa.json", "books.json", "revision.txt"]) copyFileSync(join(source, file), join(dir, file));
      const data = JSON.parse(readFileSync(join(dir, "aa.json"), "utf8").replace(/^\uFEFF/, ""));
      data[0].chapters[0][0] = "Texto de teste que não deve substituir a base";
      writeFileSync(join(dir, "aa.json"), JSON.stringify(data));
      const books = JSON.parse(readFileSync(join(dir, "books.json"), "utf8"));
      books.at(-1).chapters = 999; writeFileSync(join(dir, "books.json"), JSON.stringify(books));
      const original = db.chapter("gn", 1)?.verses[0].text;
      expect(() => db.importBible(dir)).toThrow("divergentes");
      expect(db.chapter("gn", 1)?.verses[0].text).toBe(original);
      expect(db.catalog().verses).toBe(31104);
    } finally {
      db.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

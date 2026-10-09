import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ScriptureStore } from "./scripture-store.local";
const raw = readFileSync(new URL("../../../docs/bibles/ALM1911.json", import.meta.url));
describe("cópia SQL padronizada", () => {
  it("importa integralmente, repete sem duplicação, reabre e recusa fonte divergente", () => {
    const path = join(mkdtempSync(join(tmpdir(), "devotio-scriptures-")), "corpus.sqlite");
    const first = new ScriptureStore(path);
    try { first.importAlm1911(raw); first.importAlm1911(raw);
      expect(first.catalog("alm1911")).toMatchObject({ verses: 31101 });
      expect(first.catalog("alm1911").books).toHaveLength(66);
      expect(first.db.prepare("SELECT COUNT(*) AS n FROM (SELECT DISTINCT abbrev,chapter FROM verses)").get()?.n).toBe(1189);
    } finally { first.close(); }
    const second = new ScriptureStore(path);
    try {
      expect(second.chapter("alm1911", "jo", 1)?.verses).toHaveLength(51);
      expect(second.chapter("alm1911", "job", 42)?.book.name).toBe("Jó");
      expect(() => second.importAlm1911(Buffer.from("[]"))).toThrow("divergente");
      expect(second.catalog("alm1911").verses).toBe(31101);
    } finally { second.close(); }
  });
});

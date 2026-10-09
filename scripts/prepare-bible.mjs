import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { alm1911DatasetSchema, alm1911Revision, alm1911Base } from "../packages/domain/validators/bible.ts";
import { ScriptureStore } from "../packages/backend/local/scripture-store.local.ts";

const raw = await readFile(new URL("../docs/bibles/ALM1911.json", import.meta.url));
const hash = createHash("sha256").update(raw).digest("hex");
if (hash !== alm1911Revision) throw new Error("Fonte ALM1911 alterada. Revise a edição e seu hash antes de gerar o pacote.");
const books = alm1911DatasetSchema.parse(JSON.parse(raw.toString("utf8")));
const store = new ScriptureStore(fileURLToPath(new URL("../.data/bibles/corpus.sqlite", import.meta.url)));
store.importAlm1911(raw);
const total = books.reduce((sum, b) => sum + b.chapters.reduce((n, c) => n + c.length, 0), 0);
if (total !== 31101) throw new Error("Contagem divergente da edição fornecida.");
const root = new URL(`../apps/web/public${alm1911Base}/`, import.meta.url);
await mkdir(root, { recursive: true });
const write = (name, data) => writeFile(new URL(name, root), JSON.stringify(data), "utf8");
const rows = [];
for (const { chapters, ...book } of books) {
  await mkdir(new URL(`${book.abbrev}/`, root), { recursive: true });
  for (const [index, texts] of chapters.entries()) {
    const chapter = store.chapter("alm1911", book.abbrev, index + 1);
    if (!chapter || chapter.verses.length !== texts.length) throw new Error("Cópia SQL divergente.");
    const verses = chapter.verses;
    await write(`${book.abbrev}/${index + 1}.json`, chapter);
    // Tuple index excludes text. Results hydrate only the chapters in the requested page.
    for (const verse of verses) {
      const words = verse.text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
      rows.push([book.abbrev, verse.chapter, verse.number, [...new Set(words)].join(" ")]);
    }
  }
}
await write("search.json", rows);
await write("catalog.json", store.catalog("alm1911"));
store.close();
await write("source.json", { version: "alm1911", year: 1911, sha256: hash, books: books.length, chapters: books.reduce((n, b) => n + b.chapters.length, 0), verses: total, provenance: "docs/bibles/ALM1911.json fornecido pelo usuário; inclusão pública autorizada em 09/10/2026" });
console.log(`ALM1911 preparada: 66 livros, 1.189 capítulos, ${total} versículos em ${fileURLToPath(root)}.`);

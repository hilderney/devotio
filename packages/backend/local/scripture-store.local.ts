import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { alm1911DatasetSchema, alm1911Revision, type BibleVersion } from "../../domain/validators/bible.ts";
import type { BibleBook, BibleChapter, BibleCatalog } from "../../domain/reading";

/** Complete canonical corpus, independent of user/community persistence. */
export class ScriptureStore {
  readonly db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS editions(version TEXT PRIMARY KEY, revision TEXT NOT NULL, source TEXT NOT NULL, verses INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS books(version TEXT NOT NULL REFERENCES editions(version), abbrev TEXT NOT NULL, name TEXT NOT NULL, chapters INTEGER NOT NULL, testament TEXT NOT NULL, bookOrder INTEGER NOT NULL, PRIMARY KEY(version,abbrev));
      CREATE TABLE IF NOT EXISTS verses(version TEXT NOT NULL, abbrev TEXT NOT NULL, chapter INTEGER NOT NULL, number INTEGER NOT NULL, text TEXT NOT NULL, PRIMARY KEY(version,abbrev,chapter,number), FOREIGN KEY(version,abbrev) REFERENCES books(version,abbrev));`);
  }
  importAlm1911(raw: Uint8Array) {
    const revision = createHash("sha256").update(raw).digest("hex");
    if (revision !== alm1911Revision) throw new Error("Fonte ARC1911 divergente do corpus aprovado.");
    const existing = this.db.prepare("SELECT revision FROM editions WHERE version=?").get("alm1911") as { revision: string } | undefined;
    if (existing?.revision === revision) return;
    const books = alm1911DatasetSchema.parse(JSON.parse(Buffer.from(raw).toString("utf8")));
    const count = books.reduce((sum, book) => sum + book.chapters.reduce((sum, chapter) => sum + chapter.length, 0), 0);
    if (count !== 31101) throw new Error("Contagem divergente da edição fornecida.");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("DELETE FROM verses WHERE version=?").run("alm1911");
      this.db.prepare("DELETE FROM books WHERE version=?").run("alm1911");
      this.db.prepare("INSERT INTO editions VALUES(?,?,?,?) ON CONFLICT(version) DO UPDATE SET revision=excluded.revision,source=excluded.source,verses=excluded.verses")
        .run("alm1911", revision, "ARC1911 · arquivo fornecido pelo mantenedor", count);
      const insertBook = this.db.prepare("INSERT INTO books VALUES(?,?,?,?,?,?)");
      const insertVerse = this.db.prepare("INSERT INTO verses VALUES(?,?,?,?,?)");
      for (const book of books) {
        insertBook.run("alm1911", book.abbrev, book.name, book.chapters.length, book.testament, book.order);
        book.chapters.forEach((texts, chapter) => texts.forEach((text, number) => insertVerse.run("alm1911", book.abbrev, chapter + 1, number + 1, text)));
      }
      this.db.exec("COMMIT");
    } catch (cause) { this.db.exec("ROLLBACK"); throw cause; }
  }
  catalog(version: BibleVersion): BibleCatalog {
    const edition = this.db.prepare("SELECT source,verses FROM editions WHERE version=?").get(version) as { source: string; verses: number } | undefined;
    if (!edition) throw new Error("Versão bíblica não importada.");
    const books = this.db.prepare("SELECT abbrev,name,chapters,testament,bookOrder AS 'order' FROM books WHERE version=? ORDER BY bookOrder").all(version) as unknown as BibleBook[];
    return { version, books, verses: edition.verses, source: edition.source, importedAt: null };
  }
  chapter(version: BibleVersion, abbrev: string, chapter: number): BibleChapter | null {
    if (!Number.isInteger(chapter) || chapter < 1) return null;
    const book = this.db.prepare("SELECT abbrev,name,chapters,testament,bookOrder AS 'order' FROM books WHERE version=? AND abbrev=?").get(version, abbrev) as unknown as BibleBook | undefined;
    if (!book || chapter > book.chapters) return null;
    const verses = this.db.prepare("SELECT abbrev,chapter,number,text FROM verses WHERE version=? AND abbrev=? AND chapter=? ORDER BY number").all(version, abbrev, chapter) as unknown as { abbrev: string; chapter: number; number: number; text: string }[];
    return { version, book, chapter, verses: verses.map(verse => ({ ...verse, bookName: book.name })) };
  }
  close() { this.db.close(); }
}

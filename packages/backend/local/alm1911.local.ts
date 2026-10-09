import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { alm1911DatasetSchema, alm1911Revision } from "../../domain/validators/bible";
import type { BibleChapter } from "../../domain/reading";

let corpus: ReturnType<typeof alm1911DatasetSchema.parse> | undefined;
/** Trusted source for reconstructing quotes; never accept Bible text from the browser. */
export function alm1911Chapter(abbrev: string, chapter: number): BibleChapter | null {
  if (!corpus) {
    const raw = readFileSync(new URL("../../../docs/bibles/ALM1911.json", import.meta.url));
    if (createHash("sha256").update(raw).digest("hex") !== alm1911Revision)
      throw new Error("Fonte ALM1911 divergente do corpus aprovado.");
    corpus = alm1911DatasetSchema.parse(JSON.parse(raw.toString("utf8")));
  }
  const source = corpus.find(b => b.abbrev === abbrev);
  const texts = source?.chapters[chapter - 1];
  if (!source || !texts || !Number.isInteger(chapter)) return null;
  const { chapters, ...book } = source;
  return { version: "alm1911", book: { ...book, chapters: chapters.length }, chapter,
    verses: texts.map((text, i) => ({ abbrev, bookName: book.name, chapter, number: i + 1, text })) };
}

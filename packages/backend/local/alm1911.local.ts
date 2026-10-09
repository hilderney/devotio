import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ScriptureStore } from "./scripture-store.local";
import type { BibleChapter } from "../../domain/reading";

let store: ScriptureStore | undefined;
/** Trusted source for reconstructing quotes; never accept Bible text from the browser. */
export function alm1911Chapter(abbrev: string, chapter: number): BibleChapter | null {
  if (!store) {
    const raw = readFileSync(new URL("../../../docs/bibles/ALM1911.json", import.meta.url));
    store = new ScriptureStore(fileURLToPath(new URL("../../../.data/bibles/corpus.sqlite", import.meta.url)));
    store.importAlm1911(raw);
  }
  return store.chapter("alm1911", abbrev, chapter);
}

import type { Devotional, Watch } from "./types";
import type { z } from "zod";
import type { publicationSchema } from "./validators";

export interface LocalProfile { id: string; name: string; label: string; description: string; editorial: boolean }
export interface Favorite { devotional: Devotional; favoritedAt: number }
export interface ReadingData { dates: string[]; favorites: Favorite[]; offline?: boolean; storageWarning?: string }
export interface BibleBook { abbrev: string; name: string; chapters: number; testament: "VT" | "NT"; order: number }
export interface BibleVerse { abbrev: string; bookName: string; chapter: number; number: number; text: string }
export interface BibleChapter { book: BibleBook; chapter: number; verses: BibleVerse[] }
export interface BibleCatalog { books: BibleBook[]; version: "aa"; verses: number; importedAt: number | null; source: string }
export interface BibleResults { verses: BibleVerse[]; total: number; page: number }
export type PublicationInput = z.infer<typeof publicationSchema>;
export interface EditorialEntry { devotional: Devotional; withdrawn: boolean; publishedAt: number }
export interface ReadingRepository {
  watchReading(): Watch<ReadingData>;
  setFavorite(date: string, saved: boolean): Promise<void>;
  watchBible(): Watch<BibleCatalog>;
  watchChapter(abbrev: string, chapter: number): Watch<BibleChapter | null>;
  watchSearch(query: string, page: number): Watch<BibleResults>;
  watchEditorial(): Watch<EditorialEntry[]>;
  publish(input: PublicationInput): Promise<void>;
  withdraw(date: string, reason: string): Promise<void>;
}
export function dateInZone(timeZone: string, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function recentDates(today: string): string[] {
  const day = Date.parse(today + "T12:00:00Z");
  return Array.from({ length: 8 }, (_, i) => new Date(day - i * 86400000).toISOString().slice(0, 10));
}
export function isRecent(date: string, today: string): boolean { return recentDates(today).includes(date); }
export function canPublish(editorial: boolean | undefined) { return editorial === true; }
export function searchWords(query: string): string[] {
  return query.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

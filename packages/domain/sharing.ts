import type { z } from "zod";
import { bibleSelectionSchema, notificationSummarySchema } from "./validators/sharing";
export { bibleSelectionSchema, notificationSummarySchema } from "./validators/sharing";
import type { BibleChapter } from "./reading";
import type { Watch, Message } from "./types";

export type BibleSelection = z.infer<typeof bibleSelectionSchema>;
export interface BibleQuote extends BibleSelection { text: string; reference: string; versionName: string }
export function selectionRange(anchor: number, end: number) { return { first: Math.min(anchor, end), last: Math.max(anchor, end) }; }
export function bibleQuote(chapter: BibleChapter, selection: BibleSelection): BibleQuote {
  bibleSelectionSchema.parse(selection);
  if (selection.book !== chapter.book.abbrev || selection.chapter !== chapter.chapter) throw new Error("A seleção pertence a outro capítulo.");
  const verses = chapter.verses.filter(verse => verse.number >= selection.first && verse.number <= selection.last);
  if (verses.length !== selection.last - selection.first + 1) throw new Error("Versículos não encontrados.");
  return { ...selection, text: verses.map(verse => `${verse.number} - ${verse.text}`).join("\n"), reference: `${chapter.book.name} ${selection.chapter}:${selection.first}${selection.last === selection.first ? "" : "–" + selection.last}`, versionName: "Almeida Atualizada (AA)" };
}
export function quoteText(quote: BibleQuote) { return `${quote.text}\n\n${quote.reference}\n${quote.versionName}`; }
export function bibleQuotePath(quote: BibleSelection) { return `/biblia?book=${quote.book}&chapter=${quote.chapter}&verse=${quote.first}`; }
export function notificationDate(at: number) { return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric" }).format(at); }
export type NotificationSummary = z.infer<typeof notificationSummarySchema>;
export interface AppNotification { id: string; type: "system" | "community"; entity: string; text: string; communityId: string | null; messageId: string | null; createdAt: number; readAt: number | null }
export interface NotificationPage { items: AppNotification[]; nextCursor: string | null }
export interface NotificationsRepository {
  watchSummary(): Watch<NotificationSummary>;
  watchPage(cursor: string | null): Watch<NotificationPage>;
  markRead(id: string): Promise<void>;
  refresh(): Promise<void>;
}
export interface SharingRepository {
  watchDrafts(id: string): Watch<CommunityQuoteDraft[]>;
  saveDrafts(ids: string[], selection: BibleSelection, requestId: string): Promise<CommunityQuoteDraft[]>;
  updateDraft(id: string, draftId: string, selection: BibleSelection, comment: string): Promise<void>;
  publishDraft(id: string, draftId: string, selection: BibleSelection, comment: string): Promise<void>;
  deleteDraft(id: string, draftId: string): Promise<void>;
  sendQuote(id: string, selection: BibleSelection, comment: string, requestId: string): Promise<string>;
  message(id: string, messageId: string): Promise<Message>;
}
export interface CommunityQuoteDraft { id: string; communityId: string; quote: BibleQuote; comment: string; createdAt: number }

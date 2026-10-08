import { z } from "zod";
export const bibleSelectionSchema = z.object({
  book: z.string().regex(/^[a-z0-9]{1,6}$/), chapter: z.number().int().min(1).max(150),
  first: z.number().int().min(1).max(176), last: z.number().int().min(1).max(176), version: z.literal("aa"),
}).refine(value => value.first <= value.last, "Selecione um intervalo contínuo de versículos.");
export const notificationSummarySchema = z.object({ unread: z.number().int().nonnegative(), revision: z.number().int().nonnegative() });

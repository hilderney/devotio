import { z } from "zod";
import { bibleVersionSchema } from "./bible";

export const readingFontSizes = [14, 16, 18, 20, 22, 24, 28, 32] as const;
export const readingPreferencesSchema = z.object({
  theme: z.enum(["day", "night", "papyrus", "contrast", "clock"]),
  fontSize: z.union([z.literal(14), z.literal(16), z.literal(18), z.literal(20), z.literal(22), z.literal(24), z.literal(28), z.literal(32)]),
  mode: z.enum(["paged", "continuous"]),
  bibleVersion: bibleVersionSchema.optional(),
});
export type ReadingPreferences = z.infer<typeof readingPreferencesSchema>;

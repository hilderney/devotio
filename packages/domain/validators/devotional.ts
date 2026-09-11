import { z } from "zod";

/**
 * Validação rigorosa de formato de data YYYY-MM-DD
 */
export const devotionalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD");

export const devotionalPayloadSchema = z.object({
  scripture: z.string().min(1, "Texto bíblico é obrigatório"),
  reflection: z.string().min(1, "Reflexão é obrigatória"),
  audioUrl: z.string().url().optional(),
  prayerSuggestion: z.string().min(1, "Sugestão de oração é obrigatória"),
});

export type DevotionalDateInput = z.infer<typeof devotionalDateSchema>;
export type DevotionalPayload = z.infer<typeof devotionalPayloadSchema>;

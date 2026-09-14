import { z } from "zod";

export const bibleSearchSchema = z.object({
  version: z.string().min(1, "Versão é obrigatória"),
  query: z
    .string()
    .trim()
    .min(3, "Termo de busca deve conter no mínimo 3 caracteres"),
});

export const bibleVerseRefSchema = z.object({
  version: z.string().min(1, "Versão é obrigatória"),
  abbrev: z.string().min(1, "Abreviação do livro é obrigatória"),
  chapter: z.number().int().positive("Capítulo deve ser um número positivo"),
  number: z.number().int().positive("Número do versículo deve ser positivo").optional(),
});

export type BibleSearchInput = z.infer<typeof bibleSearchSchema>;
export type BibleVerseRefInput = z.infer<typeof bibleVerseRefSchema>;

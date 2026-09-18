import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(1, "O nome da comunidade é obrigatório.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  description: z
    .string()
    .max(280, "A descrição deve ter no máximo 280 caracteres.")
    .optional(),
  scripture: z
    .string()
    .max(500, "O versículo chave deve ter no máximo 500 caracteres.")
    .optional(),
});

export const updateScriptureSchema = z.object({
  scripture: z
    .string()
    .min(1, "O versículo não pode ficar vazio.")
    .max(500, "O versículo deve ter no máximo 500 caracteres."),
});

export const inviteCodeSchema = z
  .string()
  .min(4, "Código de convite inválido.")
  .max(10, "Código de convite inválido.");

export const communityMessageSchema = z.object({
  content: z
    .string()
    .min(1, "A mensagem não pode estar vazia.")
    .max(1000, "A mensagem deve ter no máximo 1000 caracteres."),
});

export const createChecklistSchema = z.object({
  name: z
    .string()
    .min(1, "O nome da lista é obrigatório.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  items: z
    .array(z.string().min(1, "O item não pode estar vazio."))
    .min(1, "A checklist deve conter ao menos um item.")
    .max(20, "A checklist pode conter no máximo 20 itens."),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateScriptureInput = z.infer<typeof updateScriptureSchema>;
export type CommunityMessageInput = z.infer<typeof communityMessageSchema>;
export type CreateChecklistInput = z.infer<typeof createChecklistSchema>;

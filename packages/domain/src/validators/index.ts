import { z } from 'zod';

export const createCommunitySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  scripture: z.string().max(500).optional(),
});

export const updateCommunityScriptureSchema = z.object({
  communityId: z.string(),
  scripture: z.string().max(500).optional(),
});

export const joinByInviteCodeSchema = z.object({
  inviteCode: z.string().length(8),
});

export const sendCommunityMessageSchema = z.object({
  communityId: z.string(),
  content: z.string().min(1).max(2000),
});

export const createChecklistSchema = z.object({
  name: z.string().min(1).max(100),
  communityId: z.string(),
  items: z.array(z.object({
    text: z.string().min(1).max(200),
  })).min(1).max(50),
});

export const toggleChecklistTickSchema = z.object({
  checklistItemId: z.string(),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityScriptureInput = z.infer<typeof updateCommunityScriptureSchema>;
export type JoinByInviteCodeInput = z.infer<typeof joinByInviteCodeSchema>;
export type SendCommunityMessageInput = z.infer<typeof sendCommunityMessageSchema>;
export type CreateChecklistInput = z.infer<typeof createChecklistSchema>;
export type ToggleChecklistTickInput = z.infer<typeof toggleChecklistTickSchema>;
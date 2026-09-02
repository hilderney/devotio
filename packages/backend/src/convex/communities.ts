import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    scripture: v.optional(v.string()),
  },
  handler: async (ctx, { name, description, scripture }: { name: string; description?: string; scripture?: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const inviteCode = generateInviteCode();
    const communityId = await ctx.db.insert('communities', {
      name,
      description,
      scripture,
      createdBy: userId,
      createdAt: Date.now(),
      inviteCode,
    });

    await ctx.db.insert('communityMembers', {
      userId,
      communityId,
      role: 'admin',
      joinedAt: Date.now(),
    });

    return { communityId, inviteCode };
  },
});

export const updateScripture = mutation({
  args: {
    communityId: v.id('communities'),
    scripture: v.optional(v.string()),
  },
  handler: async (ctx, { communityId, scripture }: { communityId: string; scripture?: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const member = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', communityId)
      )
      .first();

    if (!member || member.role !== 'admin') {
      throw new Error('Only AG can update scripture');
    }

    await ctx.db.patch(communityId, { scripture });
  },
});

export const joinByInviteCode = mutation({
  args: { inviteCode: v.string() },
  handler: async (ctx, { inviteCode }: { inviteCode: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const community = await ctx.db
      .query('communities')
      .withIndex('by_inviteCode', (q) => q.eq('inviteCode', inviteCode))
      .first();

    if (!community) throw new Error('Invalid invite code');

    const existing = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', community._id)
      )
      .first();

    if (existing) throw new Error('Already a member');

    await ctx.db.insert('communityMembers', {
      userId,
      communityId: community._id,
      role: 'member',
      joinedAt: Date.now(),
    });

    return community._id;
  },
});

export const getById = query({
  args: { communityId: v.id('communities') },
  handler: async (ctx, { communityId }: { communityId: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const member = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', communityId)
      )
      .first();

    if (!member) throw new Error('Not a member');

    const community = await ctx.db.get(communityId);
    return community;
  },
});

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const send = mutation({
  args: {
    communityId: v.id('communities'),
    content: v.string(),
  },
  handler: async (ctx, { communityId, content }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const member = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', communityId)
      )
      .first();

    if (!member || member.role !== 'admin') {
      throw new Error('Only AG can send messages');
    }

    const messageId = await ctx.db.insert('communityMessages', {
      communityId,
      senderId: userId,
      content,
      sentAt: Date.now(),
    });

    return messageId;
  },
});

export const listByCommunity = query({
  args: { communityId: v.id('communities') },
  handler: async (ctx, { communityId }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const member = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', communityId)
      )
      .first();

    if (!member) throw new Error('Not a member');

    const messages = await ctx.db
      .query('communityMessages')
      .withIndex('by_community_sentAt', (q) => q.eq('communityId', communityId))
      .order('desc')
      .collect();

    return messages;
  },
});
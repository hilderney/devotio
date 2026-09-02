import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const remove = mutation({
  args: {
    communityId: v.id('communities'),
    userId: v.id('users'),
  },
  handler: async (ctx, { communityId, userId }: { communityId: string; userId: string }) => {
    const callerId = await ctx.auth.getUserIdentity();
    if (!callerId) throw new Error('Not authenticated');

    const callerMember = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', callerId).eq('communityId', communityId)
      )
      .first();

    if (!callerMember || callerMember.role !== 'admin') {
      throw new Error('Only AG can remove members');
    }

    if (callerId === userId) {
      const adminCount = await ctx.db
        .query('communityMembers')
        .withIndex('by_community', (q) => q.eq('communityId', communityId))
        .filter((q) => q.eq(q.field('role'), 'admin'))
        .collect();

      if (adminCount.length <= 1) {
        throw new Error('Cannot remove the only admin');
      }
    }

    const targetMember = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', communityId)
      )
      .first();

    if (!targetMember) throw new Error('Member not found');

    await ctx.db.delete(targetMember._id);
  },
});

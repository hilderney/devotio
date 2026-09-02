import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

export const toggle = mutation({
  args: { checklistItemId: v.id('checklistItems') },
  handler: async (ctx, { checklistItemId }: { checklistItemId: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const item = await ctx.db.get(checklistItemId);
    if (!item) throw new Error('Item not found');

    const existing = await ctx.db
      .query('checklistTicks')
      .withIndex('by_user_item', (q) =>
        q.eq('userId', userId).eq('checklistItemId', checklistItemId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { ticked: false };
    } else {
      await ctx.db.insert('checklistTicks', {
        userId,
        checklistItemId,
        tickedAt: Date.now(),
      });
      return { ticked: true };
    }
  },
});

export const countByItem = query({
  args: { checklistItemId: v.id('checklistItems') },
  handler: async (ctx, { checklistItemId }: { checklistItemId: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const item = await ctx.db.get(checklistItemId);
    if (!item) throw new Error('Item not found');

    const checklist = await ctx.db.get(item.checklistId);
    if (!checklist) throw new Error('Checklist not found');

    if (checklist.communityId) {
      const member = await ctx.db
        .query('communityMembers')
        .withIndex('by_user_community', (q) =>
          q.eq('userId', userId).eq('communityId', checklist.communityId)
        )
        .first();
      if (!member) throw new Error('Not a member');
    }

    const count = await ctx.db
      .query('checklistTicks')
      .withIndex('by_item', (q) => q.eq('checklistItemId', checklistItemId))
      .collect();

    return count.length;
  },
});

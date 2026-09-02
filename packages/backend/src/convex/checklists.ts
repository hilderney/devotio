import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    name: v.string(),
    communityId: v.id('communities'),
    items: v.array(v.object({ text: v.string() })),
  },
  handler: async (ctx, { name, communityId, items }: { name: string; communityId: string; items: Array<{ text: string }> }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const member = await ctx.db
      .query('communityMembers')
      .withIndex('by_user_community', (q) =>
        q.eq('userId', userId).eq('communityId', communityId)
      )
      .first();

    if (!member || member.role !== 'admin') {
      throw new Error('Only AG can create checklists');
    }

    const checklistId = await ctx.db.insert('checklists', {
      name,
      communityId,
      createdBy: userId,
      createdAt: Date.now(),
    });

    for (let i = 0; i < items.length; i++) {
      await ctx.db.insert('checklistItems', {
        checklistId,
        text: items[i].text,
        order: i,
      });
    }

    return checklistId;
  },
});

export const getWithItems = query({
  args: { checklistId: v.id('checklists') },
  handler: async (ctx, { checklistId }: { checklistId: string }) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error('Not authenticated');

    const checklist = await ctx.db.get(checklistId);
    if (!checklist) return null;

    const items = await ctx.db
      .query('checklistItems')
      .withIndex('by_checklist', (q) => q.eq('checklistId', checklistId))
      .order('asc')
      .collect();

    return { ...checklist, items };
  },
});

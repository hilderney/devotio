import { query } from './_generated/server';
import { v } from 'convex/values';

export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const devotional = await ctx.db
      .query('devotionals')
      .withIndex('by_date', (q) => q.eq('date', date))
      .first();
    return devotional ?? null;
  },
});
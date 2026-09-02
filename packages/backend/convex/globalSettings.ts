import { query } from './_generated/server';

export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query('globalSettings').first();
    return settings ?? null;
  },
});
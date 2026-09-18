import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Lista todos os personagens históricos cristãos cadastrados.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("historicalFigures")
      .collect();
  },
});

/**
 * Busca dados detalhados de um personagem histórico pelo nome.
 */
export const getByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("historicalFigures")
      .withIndex("by_name", (q: any) => q.eq("name", args.name))
      .first();
  },
});

/**
 * Cadastra ou atualiza um personagem histórico (administração editorial).
 */
export const upsert = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    quote: v.string(),
    commentary: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("historicalFigures")
      .withIndex("by_name", (q: any) => q.eq("name", args.name))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        bio: args.bio,
        quote: args.quote,
        commentary: args.commentary,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("historicalFigures", {
      name: args.name,
      bio: args.bio,
      quote: args.quote,
      commentary: args.commentary,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Cria um novo clube dentro de uma comunidade (v2).
 */
export const create = mutation({
  args: {
    communityId: v.id("communities"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user) throw new Error("Usuário não encontrado.");

    const clubId = await ctx.db.insert("clubs", {
      name: args.name,
      communityId: args.communityId,
      createdBy: user._id,
      createdAt: Date.now(),
    });

    await ctx.db.insert("clubMembers", {
      userId: user._id,
      clubId,
      role: "admin",
      joinedAt: Date.now(),
    });

    return clubId;
  },
});

/**
 * Lista os clubes de uma comunidade.
 */
export const listByCommunity = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clubs")
      .withIndex("by_community", (q: any) => q.eq("communityId", args.communityId))
      .collect();
  },
});

/**
 * Retorna dados de um clube específico.
 */
export const get = query({
  args: {
    clubId: v.id("clubs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.clubId);
  },
});

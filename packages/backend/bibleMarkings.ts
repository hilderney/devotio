import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Cria uma nova anotação/marcação bíblica.
 * Respeita a privacidade estrita (Constituição §V).
 */
export const create = mutation({
  args: {
    book: v.string(),
    chapter: v.number(),
    verse: v.number(),
    comment: v.string(),
    visibility: v.union(
      v.literal("private"),
      v.literal("club"),
      v.literal("community")
    ),
    targetClubId: v.optional(v.id("clubs")),
    targetCommunityId: v.optional(v.id("communities")),
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

    const markingId = await ctx.db.insert("bibleMarkings", {
      userId: user._id,
      book: args.book,
      chapter: args.chapter,
      verse: args.verse,
      comment: args.comment.trim(),
      visibility: args.visibility,
      targetClubId: args.targetClubId,
      targetCommunityId: args.targetCommunityId,
      createdAt: Date.now(),
    });

    return markingId;
  },
});

/**
 * Lista as marcações do próprio usuário para um determinado versículo.
 */
export const listByUserVerse = query({
  args: {
    book: v.string(),
    chapter: v.number(),
    verse: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      return [];
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("bibleMarkings")
      .withIndex("by_user_verse", (q: any) =>
        q
          .eq("userId", user._id)
          .eq("book", args.book)
          .eq("chapter", args.chapter)
          .eq("verse", args.verse)
      )
      .collect();
  },
});

/**
 * Lista marcações compartilhadas com uma comunidade.
 */
export const listByCommunity = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bibleMarkings")
      .withIndex("by_community", (q: any) => q.eq("targetCommunityId", args.communityId))
      .collect();
  },
});

/**
 * Remove uma marcação (apenas o próprio autor pode remover).
 */
export const remove = mutation({
  args: {
    markingId: v.id("bibleMarkings"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    const marking = await ctx.db.get(args.markingId);
    if (!marking) return { success: true };

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user || marking.userId !== user._id) {
      throw new Error("Apenas o autor pode excluir esta marcação.");
    }

    await ctx.db.delete(args.markingId);
    return { success: true };
  },
});

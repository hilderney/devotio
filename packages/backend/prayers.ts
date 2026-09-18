import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Cria uma nova oração no diário pessoal de orações.
 */
export const create = mutation({
  args: {
    title: v.optional(v.string()),
    content: v.string(),
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

    const prayerId = await ctx.db.insert("prayers", {
      userId: user._id,
      title: args.title,
      content: args.content.trim(),
      answered: false,
      createdAt: Date.now(),
    });

    return prayerId;
  },
});

/**
 * Lista as orações do usuário autenticado ordenadas por data de criação.
 */
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
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
      .query("prayers")
      .withIndex("by_user_created", (q: any) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

/**
 * Alterna o status de oração respondida (answered).
 */
export const toggleAnswered = mutation({
  args: {
    prayerId: v.id("prayers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    const prayer = await ctx.db.get(args.prayerId);
    if (!prayer) throw new Error("Oração não encontrada.");

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user || prayer.userId !== user._id) {
      throw new Error("Não autorizado a alterar esta oração.");
    }

    const nextAnswered = !prayer.answered;
    await ctx.db.patch(args.prayerId, {
      answered: nextAnswered,
      answeredAt: nextAnswered ? Date.now() : undefined,
    });

    return { answered: nextAnswered };
  },
});

/**
 * Remove uma oração do diário pessoal.
 */
export const remove = mutation({
  args: {
    prayerId: v.id("prayers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    const prayer = await ctx.db.get(args.prayerId);
    if (!prayer) return { success: true };

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user || prayer.userId !== user._id) {
      throw new Error("Não autorizado a excluir esta oração.");
    }

    await ctx.db.delete(args.prayerId);
    return { success: true };
  },
});

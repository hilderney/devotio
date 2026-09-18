import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Marca ou desmarca o tick de um item de checklist para o usuário autenticado.
 * Operação estritamente idempotente.
 */
export const toggle = mutation({
  args: {
    checklistItemId: v.id("checklistItems"),
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

    const existingTick = await ctx.db
      .query("checklistTicks")
      .withIndex("by_user_item", (q: any) =>
        q.eq("userId", user._id).eq("checklistItemId", args.checklistItemId)
      )
      .first();

    if (existingTick) {
      await ctx.db.delete(existingTick._id);
      return { ticked: false };
    }

    await ctx.db.insert("checklistTicks", {
      userId: user._id,
      checklistItemId: args.checklistItemId,
      tickedAt: Date.now(),
    });

    return { ticked: true };
  },
});

/**
 * Retorna contagem agregada de quantos membros marcaram cada item (sem expor nomes).
 */
export const countByItem = query({
  args: {
    checklistItemId: v.id("checklistItems"),
  },
  handler: async (ctx, args) => {
    const ticks = await ctx.db
      .query("checklistTicks")
      .withIndex("by_item", (q: any) => q.eq("checklistItemId", args.checklistItemId))
      .collect();

    return ticks.length;
  },
});

/**
 * Retorna lista de IDs de checklistItems marcados pelo usuário autenticado.
 */
export const myTicks = query({
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

    const ticks = await ctx.db
      .query("checklistTicks")
      .withIndex("by_user_item", (q: any) => q.eq("userId", user._id))
      .collect();

    return ticks.map((t: any) => t.checklistItemId);
  },
});

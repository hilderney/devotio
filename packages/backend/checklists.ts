import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Cria uma nova lista para ticar (Checklist) com itens iniciais.
 */
export const create = mutation({
  args: {
    name: v.string(),
    communityId: v.optional(v.id("communities")),
    clubId: v.optional(v.id("clubs")),
    items: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    if (args.items.length === 0) {
      throw new Error("A checklist deve conter ao menos um item.");
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user) throw new Error("Usuário não encontrado.");

    const checklistId = await ctx.db.insert("checklists", {
      name: args.name,
      communityId: args.communityId,
      clubId: args.clubId,
      createdBy: user._id,
      createdAt: Date.now(),
    });

    for (let i = 0; i < args.items.length; i++) {
      await ctx.db.insert("checklistItems", {
        checklistId,
        text: args.items[i],
        order: i,
      });
    }

    return checklistId;
  },
});

/**
 * Lista checklists de uma comunidade acompanhadas de seus itens.
 */
export const listByCommunity = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, args) => {
    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_community", (q: any) => q.eq("communityId", args.communityId))
      .collect();

    const checklistsWithItems = await Promise.all(
      checklists.map(async (cl: any) => {
        const items = await ctx.db
          .query("checklistItems")
          .withIndex("by_checklist", (q: any) => q.eq("checklistId", cl._id))
          .collect();

        items.sort((a: any, b: any) => a.order - b.order);
        return {
          ...cl,
          items,
        };
      })
    );

    return checklistsWithItems;
  },
});

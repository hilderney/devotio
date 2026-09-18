import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Envia uma mensagem no mural da comunidade (apenas AG / Admin).
 */
export const send = mutation({
  args: {
    communityId: v.id("communities"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    if (!args.content || args.content.trim().length === 0 || args.content.length > 1000) {
      throw new Error("A mensagem deve conter entre 1 e 1000 caracteres.");
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user) throw new Error("Usuário não encontrado.");

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_user_community", (q: any) =>
        q.eq("userId", user._id).eq("communityId", args.communityId)
      )
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Apenas o administrador (AG) pode publicar no mural da comunidade.");
    }

    const messageId = await ctx.db.insert("communityMessages", {
      communityId: args.communityId,
      senderId: user._id,
      content: args.content.trim(),
      sentAt: Date.now(),
    });

    return messageId;
  },
});

/**
 * Lista mensagens da comunidade ordenadas cronologicamente.
 */
export const listByCommunity = query({
  args: {
    communityId: v.id("communities"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const messages = await ctx.db
      .query("communityMessages")
      .withIndex("by_community_sentAt", (q: any) => q.eq("communityId", args.communityId))
      .order("desc")
      .take(limit);

    const messagesWithSender = await Promise.all(
      messages.map(async (msg: any) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          _id: msg._id,
          content: msg.content,
          sentAt: msg.sentAt,
          sender: {
            _id: msg.senderId,
            name: sender?.name ?? "Líder",
            image: sender?.image,
          },
        };
      })
    );

    return messagesWithSender.reverse();
  },
});

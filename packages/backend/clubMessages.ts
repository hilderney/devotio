import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Envia uma mensagem dentro de um clube.
 */
export const send = mutation({
  args: {
    clubId: v.id("clubs"),
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

    const messageId = await ctx.db.insert("clubMessages", {
      clubId: args.clubId,
      senderId: user._id,
      content: args.content.trim(),
      sentAt: Date.now(),
    });

    return messageId;
  },
});

/**
 * Lista mensagens de um clube ordenadas cronologicamente.
 */
export const listByClub = query({
  args: {
    clubId: v.id("clubs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const messages = await ctx.db
      .query("clubMessages")
      .withIndex("by_club_sentAt", (q: any) => q.eq("clubId", args.clubId))
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
            name: sender?.name ?? "Membro",
            image: sender?.image,
          },
        };
      })
    );

    return messagesWithSender.reverse();
  },
});

import { v, ConvexError } from "convex/values";
import {
  communitySchema,
  inviteSchema,
  messageSchema,
  scriptureSchema,
  checklistSchema,
  canRemoveMember,
  copy,
  tickChange,
  hasApprovedAccess,
  type Community,
  type CommunityDetail,
} from "domain/core";
import { query, mutation } from "./server";
import { ensureUser, findUser, membership } from "./access";
export const list = query({
  args: {},
  handler: async (ctx): Promise<Community[]> => {
    const user = await findUser(ctx);
    if (!user) return [];
    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const result: Community[] = [];
    for (const member of memberships) {
      const c = await ctx.db.get(member.communityId);
      if (c)
        result.push({
          id: c._id,
          name: c.name,
          description: c.description,
          scripture: c.scripture,
          role: member.role,
          ...(member.role === "admin" ? { inviteCode: c.inviteCode } : {}),
        });
    }
    return result;
  },
});
export const create = mutation({
  args: { name: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    const input = communitySchema.parse(args);
    // An invitation is not an authentication secret; access still requires a verified session.
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let inviteCode = "";
    for (let attempt = 0; attempt < 10; attempt++) {
      inviteCode = Array.from(
        { length: 8 },
        () => alphabet[Math.floor(Math.random() * alphabet.length)],
      ).join("");
      if (
        !(await ctx.db
          .query("communities")
          .withIndex("by_invite", (q) => q.eq("inviteCode", inviteCode))
          .unique())
      )
        break;
      inviteCode = "";
    }
    if (!inviteCode) throw new ConvexError("Não foi possível gerar o convite.");
    const id = await ctx.db.insert("communities", {
      ...input,
      scripture: "",
      inviteCode,
      createdAt: Date.now(),
    });
    await ctx.db.insert("communityMembers", {
      communityId: id,
      userId: user._id,
      role: "admin",
    });
    return id;
  },
});
export const previewInvite = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    await findUser(ctx);
    const code = inviteSchema.parse(args.code);
    const c = await ctx.db
      .query("communities")
      .withIndex("by_invite", (q) => q.eq("inviteCode", code))
      .unique();
    return c ? { id: c._id, name: c.name } : null;
  },
});
export const join = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    const code = inviteSchema.parse(args.code);
    const c = await ctx.db
      .query("communities")
      .withIndex("by_invite", (q) => q.eq("inviteCode", code))
      .unique();
    if (!c)
      throw new ConvexError("Não encontramos uma comunidade com esse código.");
    const existing = await ctx.db
      .query("communityMembers")
      .withIndex("by_pair", (q) =>
        q.eq("communityId", c._id).eq("userId", user._id),
      )
      .unique();
    if (!existing)
      await ctx.db.insert("communityMembers", {
        communityId: c._id,
        userId: user._id,
        role: "member",
      });
    return c._id;
  },
});
export const detail = query({
  args: { id: v.id("communities"), cursor: v.union(v.string(), v.null()) },
  handler: async (ctx, args): Promise<CommunityDetail | null> => {
    const user = await findUser(ctx);
    if (!user) return null;
    const member = await ctx.db
      .query("communityMembers")
      .withIndex("by_pair", (q) =>
        q.eq("communityId", args.id).eq("userId", user._id),
      )
      .unique();
    if (!member) return null;
    const c = await ctx.db.get(args.id);
    if (!c) return null;
    const members = await ctx.db
      .query("communityMembers")
      .withIndex("by_community", (q) => q.eq("communityId", args.id))
      .collect();
    const activeIds = new Set(
      (
        await Promise.all(
          members.map(async (m) => {
            const user = await ctx.db.get(m.userId);
            return user && hasApprovedAccess(user.status) ? m.userId : null;
          }),
        )
      ).filter((id) => id !== null),
    );
    const messages = await ctx.db
      .query("communityMessages")
      .withIndex("by_community_time", (q) => q.eq("communityId", args.id))
      .order("desc")
      .paginate({ cursor: args.cursor, numItems: 50 });
    const lists = await ctx.db
      .query("checklists")
      .withIndex("by_community", (q) => q.eq("communityId", args.id))
      .collect();
    return {
      community: {
        id: c._id,
        name: c.name,
        description: c.description,
        scripture: c.scripture,
        role: member.role,
        ...(member.role === "admin" ? { inviteCode: c.inviteCode } : {}),
      },
      members: await Promise.all(
        members.map(async (m) => ({
          id: m._id,
          userId: m.userId,
          name: (await ctx.db.get(m.userId))?.name ?? "Membro",
          role: m.role,
        })),
      ),
      messages: await Promise.all(
        messages.page.reverse().map(async (m) => ({
          id: m._id,
          content: m.content,
          sentAt: m.sentAt,
          name: (await ctx.db.get(m.senderId))?.name ?? "Administrador",
        })),
      ),
      hasMore: !messages.isDone,
      nextCursor: messages.isDone ? null : messages.continueCursor,
      lists: await Promise.all(
        lists.map(async (list) => ({
          id: list._id,
          name: list.name,
          items: await Promise.all(
            (
              await ctx.db
                .query("checklistItems")
                .withIndex("by_checklist", (q) => q.eq("checklistId", list._id))
                .collect()
            )
              .sort((a, b) => a.order - b.order)
              .map(async (item) => {
                const ticks = await ctx.db
                  .query("checklistTicks")
                  .withIndex("by_item", (q) => q.eq("itemId", item._id))
                  .collect();
                return {
                  id: item._id,
                  text: item.text,
                  checked: ticks.some((t) => t.userId === user._id),
                  count: ticks.filter((t) => activeIds.has(t.userId)).length,
                };
              }),
          ),
        })),
      ),
    };
  },
});
export const send = mutation({
  args: { id: v.id("communities"), content: v.string() },
  handler: async (ctx, args) => {
    const { user } = await membership(ctx, args.id, true);
    await ctx.db.insert("communityMessages", {
      communityId: args.id,
      senderId: user._id,
      content: messageSchema.parse(args.content),
      sentAt: Date.now(),
    });
  },
});
export const updateScripture = mutation({
  args: { id: v.id("communities"), scripture: v.string() },
  handler: async (ctx, args) => {
    await membership(ctx, args.id, true);
    await ctx.db.patch(args.id, {
      scripture: scriptureSchema.parse(args.scripture),
    });
  },
});
export const createChecklist = mutation({
  args: {
    id: v.id("communities"),
    name: v.string(),
    items: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await membership(ctx, args.id, true);
    const input = checklistSchema.parse(args);
    const checklistId = await ctx.db.insert("checklists", {
      communityId: args.id,
      name: input.name,
    });
    for (const [order, text] of input.items.entries())
      await ctx.db.insert("checklistItems", { checklistId, text, order });
  },
});
export const setTick = mutation({
  args: { itemId: v.id("checklistItems"), checked: v.boolean() },
  handler: async (ctx, args) => {
    await findUser(ctx);
    const item = await ctx.db.get(args.itemId);
    const list = item && (await ctx.db.get(item.checklistId));
    if (!list) throw new ConvexError("Este item não está disponível.");
    const { user } = await membership(ctx, list.communityId);
    const tick = await ctx.db
      .query("checklistTicks")
      .withIndex("by_pair", (q) =>
        q.eq("itemId", args.itemId).eq("userId", user._id),
      )
      .unique();
    const change = tickChange(!!tick, args.checked);
    if (change === "insert")
      await ctx.db.insert("checklistTicks", {
        itemId: args.itemId,
        userId: user._id,
      });
    if (change === "delete" && tick) await ctx.db.delete(tick._id);
  },
});
export const removeMember = mutation({
  args: { id: v.id("communities"), memberId: v.id("communityMembers") },
  handler: async (ctx, args) => {
    await membership(ctx, args.id, true);
    const target = await ctx.db.get(args.memberId);
    if (!target || target.communityId !== args.id)
      throw new ConvexError("Membro não encontrado.");
    const members = await ctx.db
      .query("communityMembers")
      .withIndex("by_community", (q) => q.eq("communityId", args.id))
      .collect();
    let activeAdmins = 0;
    for (const member of members) {
      if (member.role !== "admin") continue;
      const account = await ctx.db.get(member.userId);
      if (account && hasApprovedAccess(account.status)) activeAdmins++;
    }
    const targetAccount = await ctx.db.get(target.userId);
    if (
      targetAccount &&
      hasApprovedAccess(targetAccount.status) &&
      !canRemoveMember(target.role, activeAdmins)
    )
      throw new ConvexError(copy.lastAdmin);
    await ctx.db.delete(target._id);
  },
});

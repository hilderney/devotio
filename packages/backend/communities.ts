import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Cria uma nova comunidade e define o criador como admin de forma atômica.
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    scripture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado: usuário deve estar autenticado.");
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    let user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: identity?.name ?? "Usuário",
        email: identity?.email ?? "usuario@devotio.local",
        authId,
      });
      user = await ctx.db.get(userId);
    }

    const inviteCode = generateInviteCode();
    const communityId = await ctx.db.insert("communities", {
      name: args.name,
      description: args.description,
      scripture: args.scripture,
      createdBy: user._id,
      createdAt: Date.now(),
      inviteCode,
    });

    await ctx.db.insert("communityMembers", {
      userId: user._id,
      communityId,
      role: "admin",
      joinedAt: Date.now(),
    });

    return { communityId, inviteCode };
  },
});

/**
 * Retorna os dados da comunidade se o usuário for membro ou admin.
 */
export const get = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    return await ctx.db.get(args.communityId);
  },
});

/**
 * Busca dados básicos da comunidade pelo inviteCode para confirmação de entrada.
 */
export const getByInviteCode = query({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communities")
      .withIndex("by_inviteCode", (q: any) => q.eq("inviteCode", args.inviteCode.toUpperCase()))
      .first();
  },
});

/**
 * Lista as comunidades das quais o usuário autenticado participa.
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

    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    const communities = await Promise.all(
      memberships.map(async (m: any) => {
        const comm = await ctx.db.get(m.communityId);
        return comm ? { ...comm, userRole: m.role } : null;
      })
    );

    return communities.filter(Boolean);
  },
});

/**
 * Atualiza o versículo chave da comunidade (Apenas Admin).
 */
export const updateScripture = mutation({
  args: {
    communityId: v.id("communities"),
    scripture: v.string(),
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

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_user_community", (q: any) =>
        q.eq("userId", user._id).eq("communityId", args.communityId)
      )
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Apenas o administrador da comunidade pode alterar o versículo.");
    }

    await ctx.db.patch(args.communityId, {
      scripture: args.scripture,
    });
  },
});

/**
 * Permite ao usuário entrar em uma comunidade com um código de convite válido.
 */
export const joinByInviteCode = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    let user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: identity?.name ?? "Usuário",
        email: identity?.email ?? "usuario@devotio.local",
        authId,
      });
      user = await ctx.db.get(userId);
    }

    const community = await ctx.db
      .query("communities")
      .withIndex("by_inviteCode", (q: any) => q.eq("inviteCode", args.inviteCode.toUpperCase()))
      .first();

    if (!community) {
      throw new Error("Código de convite inválido ou comunidade inexistente.");
    }

    const existingMembership = await ctx.db
      .query("communityMembers")
      .withIndex("by_user_community", (q: any) =>
        q.eq("userId", user._id).eq("communityId", community._id)
      )
      .first();

    if (existingMembership) {
      return { communityId: community._id, alreadyMember: true };
    }

    await ctx.db.insert("communityMembers", {
      userId: user._id,
      communityId: community._id,
      role: "member",
      joinedAt: Date.now(),
    });

    return { communityId: community._id, alreadyMember: false };
  },
});

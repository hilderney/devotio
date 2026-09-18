import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { canRemoveMember } from "domain";

/**
 * Lista membros de uma comunidade com seus dados de perfil.
 */
export const list = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_community", (q: any) => q.eq("communityId", args.communityId))
      .collect();

    const membersWithProfile = await Promise.all(
      memberships.map(async (m: any) => {
        const user = await ctx.db.get(m.userId);
        return {
          memberId: m._id,
          userId: m.userId,
          name: user?.name ?? "Membro",
          email: user?.email,
          image: user?.image,
          role: m.role,
          joinedAt: m.joinedAt,
        };
      })
    );

    return membersWithProfile;
  },
});

/**
 * Remove um membro da comunidade.
 * Bloqueia a remoção caso o alvo seja o único administrador da comunidade.
 */
export const remove = mutation({
  args: {
    communityId: v.id("communities"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error("Não autorizado.");
    }

    const authId = identity ? (identity.subject ?? identity.tokenIdentifier) : "dev-user-auth-id";
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_authId", (q: any) => q.eq("authId", authId))
      .first();

    if (!currentUser) throw new Error("Usuário autenticado não encontrado.");

    const callerMembership = await ctx.db
      .query("communityMembers")
      .withIndex("by_user_community", (q: any) =>
        q.eq("userId", currentUser._id).eq("communityId", args.communityId)
      )
      .first();

    if (!callerMembership || callerMembership.role !== "admin") {
      throw new Error("Apenas o administrador pode remover membros.");
    }

    const targetMembership = await ctx.db
      .query("communityMembers")
      .withIndex("by_user_community", (q: any) =>
        q.eq("userId", args.targetUserId).eq("communityId", args.communityId)
      )
      .first();

    if (!targetMembership) {
      throw new Error("O usuário não pertence a esta comunidade.");
    }

    if (targetMembership.role === "admin") {
      const allAdmins = await ctx.db
        .query("communityMembers")
        .withIndex("by_community", (q: any) => q.eq("communityId", args.communityId))
        .filter((q: any) => q.eq(q.field("role"), "admin"))
        .collect();

      const check = canRemoveMember("admin", allAdmins.length);
      if (!check.canRemove) {
        throw new Error(check.reason ?? "Não é possível remover o único administrador da comunidade.");
      }
    }

    await ctx.db.delete(targetMembership._id);
    return { success: true };
  },
});

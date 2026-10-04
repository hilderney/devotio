import { ConvexError } from "convex/values";
import { canManage } from "domain/core";
import type { QueryCtx, MutationCtx, Id } from "./server";
export async function identity(ctx: QueryCtx) {
  const session = await ctx.auth.getUserIdentity();
  if (!session) throw new ConvexError("Entre na sua conta para continuar.");
  return session;
}
export async function findUser(ctx: QueryCtx) {
  const session = await identity(ctx);
  return ctx.db
    .query("users")
    .withIndex("by_authId", (q) => q.eq("authId", session.subject))
    .unique();
}
export async function ensureUser(ctx: MutationCtx) {
  const session = await identity(ctx);
  const existing = await findUser(ctx);
  if (existing) return existing;
  const id = await ctx.db.insert("users", {
    authId: session.subject,
    name: session.name ?? "Leitor",
    email: session.email ?? "",
  });
  const user = await ctx.db.get(id);
  if (!user) throw new ConvexError("Não foi possível criar sua conta.");
  return user;
}
export async function membership(
  ctx: QueryCtx,
  id: Id<"communities">,
  admin = false,
) {
  const user = await findUser(ctx);
  if (!user) throw new ConvexError("Você não tem acesso a esta comunidade.");
  const member = await ctx.db
    .query("communityMembers")
    .withIndex("by_pair", (q) => q.eq("communityId", id).eq("userId", user._id))
    .unique();
  if (!member || (admin && !canManage(member.role)))
    throw new ConvexError("Você não tem acesso a esta ação na comunidade.");
  return { user, member };
}

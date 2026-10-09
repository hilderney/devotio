import { ConvexError, v } from "convex/values";
import { makeFunctionReference } from "convex/server";
import {
  canManageEditorial,
  publicationSchema,
  editorialAuditSchema,
} from "domain/core";
import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./server";
import { findUser } from "./access";

const fields = {
  date: v.string(),
  reference: v.string(),
  translation: v.string(),
  scripture: v.string(),
  reflection: v.string(),
  prayerSuggestion: v.string(),
  credit: v.string(),
  licenseEvidence: v.string(),
  publishedAt: v.number(),
  audioUrl: v.optional(v.string()),
};
async function editor(ctx: QueryCtx) {
  const user = await findUser(ctx);
  if (!canManageEditorial(user))
    throw new ConvexError("Acesso exclusivo da gestão editorial.");
  return user;
}
export const list = query({
  args: { cursor: v.union(v.string(), v.null()) },
  returns: v.object({
    entries: v.array(
      v.object({ ...fields, id: v.id("devotionals"), withdrawn: v.boolean() }),
    ),
    cursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    await editor(ctx);
    const page = await ctx.db
      .query("devotionals")
      .withIndex("by_date")
      .order("desc")
      .paginate({ cursor: args.cursor, numItems: 25 });
    return {
      entries: page.page.map((d) => ({
        id: d._id,
        date: d.date,
        reference: d.reference,
        translation: d.translation,
        scripture: d.scripture,
        reflection: d.reflection,
        prayerSuggestion: d.prayerSuggestion,
        credit: d.credit,
        licenseEvidence: d.licenseEvidence,
        publishedAt: d.publishedAt,
        audioUrl: d.audioUrl,
        withdrawn: d.withdrawn,
      })),
      cursor: page.isDone ? null : page.continueCursor,
    };
  },
});
export const save = mutation({
  args: {
    ...fields,
    reason: v.string(),
    mode: v.union(v.literal("create"), v.literal("update")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await editor(ctx);
    const input = publicationSchema.parse({ ...args, reviewedBy: user._id });
    const existing = await ctx.db
      .query("devotionals")
      .withIndex("by_date", (q) => q.eq("date", input.date))
      .unique();
    if ((args.mode === "create") === !!existing)
      throw new ConvexError(
        existing
          ? "Esta data já possui um devocional. Use editar."
          : "Devocional não encontrado.",
      );
    await ctx.runMutation(
      makeFunctionReference<"mutation">("editorial:publish"),
      input,
    );
    return null;
  },
});
export const withdraw = mutation({
  args: { id: v.id("devotionals"), reason: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await editor(ctx);
    const audit = editorialAuditSchema.parse({
      actor: user._id,
      reason: args.reason,
    });
    await ctx.runMutation(
      makeFunctionReference<"mutation">("editorial:withdraw"),
      { id: args.id, ...audit },
    );
    return null;
  },
});

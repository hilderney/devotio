import { v } from "convex/values";
export const scriptureSelectionValidator = v.object({
  book: v.string(), chapter: v.number(), first: v.number(), last: v.number(),
  version: v.union(v.literal("aa"), v.literal("alm1911")),
});

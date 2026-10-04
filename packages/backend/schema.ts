import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  users: defineTable({
    authId: v.string(),
    name: v.string(),
    email: v.string(),
  }).index("by_authId", ["authId"]),
  devotionals: defineTable({
    date: v.string(),
    reference: v.string(),
    translation: v.string(),
    scripture: v.string(),
    reflection: v.string(),
    prayerSuggestion: v.string(),
    credit: v.string(),
    licenseEvidence: v.string(),
    reviewedBy: v.string(),
    publishedAt: v.number(),
    audioUrl: v.optional(v.string()),
    withdrawn: v.boolean(),
    updatedAt: v.number(),
  }).index("by_date", ["date"]),
  editorialEvents: defineTable({
    devotionalId: v.id("devotionals"),
    actor: v.string(),
    reason: v.string(),
    action: v.union(v.literal("publish"), v.literal("withdraw")),
    at: v.number(),
  }).index("by_devotional", ["devotionalId"]),
  globalSettings: defineTable({
    key: v.literal("main"),
    monthlyVerse: v.string(),
    monthlyReference: v.string(),
    weeklyVerse: v.string(),
    weeklyReference: v.string(),
  }).index("by_key", ["key"]),
  communities: defineTable({
    name: v.string(),
    description: v.string(),
    scripture: v.string(),
    inviteCode: v.string(),
    createdAt: v.number(),
  }).index("by_invite", ["inviteCode"]),
  communityMembers: defineTable({
    userId: v.id("users"),
    communityId: v.id("communities"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user", ["userId"])
    .index("by_community", ["communityId"])
    .index("by_pair", ["communityId", "userId"]),
  communityMessages: defineTable({
    communityId: v.id("communities"),
    senderId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
  }).index("by_community_time", ["communityId", "sentAt"]),
  checklists: defineTable({
    communityId: v.id("communities"),
    name: v.string(),
  }).index("by_community", ["communityId"]),
  checklistItems: defineTable({
    checklistId: v.id("checklists"),
    text: v.string(),
    order: v.number(),
  }).index("by_checklist", ["checklistId"]),
  checklistTicks: defineTable({
    itemId: v.id("checklistItems"),
    userId: v.id("users"),
  })
    .index("by_item", ["itemId"])
    .index("by_pair", ["itemId", "userId"]),
});

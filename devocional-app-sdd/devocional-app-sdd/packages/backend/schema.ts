import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // 1. USUÁRIOS E AUTENTICAÇÃO
  // ============================================
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    // ID do provedor de auth (Better Auth)
    authId: v.string(),
  })
    .index("by_authId", ["authId"])
    .index("by_email", ["email"]),

  // ============================================
  // 2. COMUNIDADES (v1)
  // ============================================
  communities: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    scripture: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    // Ver specs/002-comunidade-v1/plan.md §1
    inviteCode: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_inviteCode", ["inviteCode"]),

  communityMembers: defineTable({
    userId: v.id("users"),
    communityId: v.id("communities"),
    role: v.union(v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_community", ["communityId"])
    .index("by_user_community", ["userId", "communityId"]),

  // ============================================
  // 3. CLUBES (v2 — fora do escopo do MVP)
  // ============================================
  clubs: defineTable({
    name: v.string(),
    communityId: v.id("communities"),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_community", ["communityId"]),

  clubMembers: defineTable({
    userId: v.id("users"),
    clubId: v.id("clubs"),
    role: v.union(v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_club", ["clubId"])
    .index("by_user_club", ["userId", "clubId"]),

  // ============================================
  // 4. CONFIGURAÇÕES GLOBAIS (Tema Mês/Semana)
  // ============================================
  globalSettings: defineTable({
    monthlyVerse: v.string(),
    weeklyVerse: v.string(),
    updatedAt: v.number(),
  }),

  // ============================================
  // 5. DEVOCIONAIS DIÁRIOS (v1)
  // ============================================
  devotionals: defineTable({
    date: v.string(), // "YYYY-MM-DD"
    scripture: v.string(),
    reflection: v.string(),
    audioUrl: v.optional(v.string()),
    prayerSuggestion: v.string(),
    publishedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_date", ["date"]),

  // ============================================
  // 6. MENSAGENS (Comunidade e Clubes)
  // ============================================
  communityMessages: defineTable({
    communityId: v.id("communities"),
    senderId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
  }).index("by_community_sentAt", ["communityId", "sentAt"]),

  clubMessages: defineTable({
    clubId: v.id("clubs"),
    senderId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
  }).index("by_club_sentAt", ["clubId", "sentAt"]),

  // ============================================
  // 7. LISTAS PARA "TICAR" (Checklists)
  // ============================================
  checklists: defineTable({
    name: v.string(),
    communityId: v.optional(v.id("communities")),
    clubId: v.optional(v.id("clubs")),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_community", ["communityId"])
    .index("by_club", ["clubId"]),

  checklistItems: defineTable({
    checklistId: v.id("checklists"),
    text: v.string(),
    order: v.number(),
  }).index("by_checklist", ["checklistId"]),

  checklistTicks: defineTable({
    userId: v.id("users"),
    checklistItemId: v.id("checklistItems"),
    tickedAt: v.optional(v.number()),
  })
    .index("by_user_item", ["userId", "checklistItemId"])
    .index("by_item", ["checklistItemId"]),

  // ============================================
  // 8. BÍBLIA ONLINE — MARCAÇÕES (v3 — fora do escopo do MVP)
  // ============================================
  bibleMarkings: defineTable({
    userId: v.id("users"),
    book: v.string(),
    chapter: v.number(),
    verse: v.number(),
    comment: v.string(),
    visibility: v.union(
      v.literal("private"),
      v.literal("club"),
      v.literal("community"),
    ),
    targetClubId: v.optional(v.id("clubs")),
    targetCommunityId: v.optional(v.id("communities")),
    createdAt: v.number(),
  })
    .index("by_user_verse", ["userId", "book", "chapter", "verse"])
    .index("by_community", ["targetCommunityId"])
    .index("by_club", ["targetClubId"]),

  // ============================================
  // 9. DIÁRIO DE ORAÇÕES (v2 — fora do escopo do MVP)
  // ============================================
  prayers: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    content: v.string(),
    answered: v.boolean(),
    answeredAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user_created", ["userId", "createdAt"]),

  // ============================================
  // 10. PERSONAGENS HISTÓRICOS (v3 — fora do escopo do MVP)
  // ============================================
  historicalFigures: defineTable({
    name: v.string(),
    bio: v.string(),
    quote: v.string(),
    commentary: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_name", ["name"]),
});

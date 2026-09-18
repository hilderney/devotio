import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";

/**
 * Lista todos os livros bíblicos cadastrados para uma determinada tradução/versão.
 */
export const listBooks = query({
  args: {
    version: v.string(), // ex: "acf"
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bibleBooks")
      .withIndex("by_version", (q: any) => q.eq("version", args.version))
      .collect();
  },
});

/**
 * Retorna todos os versículos de um capítulo de determinado livro.
 */
export const getChapter = query({
  args: {
    version: v.string(),
    abbrev: v.string(),
    chapter: v.number(),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db
      .query("bibleBooks")
      .withIndex("by_version_abbrev", (q: any) =>
        q.eq("version", args.version).eq("abbrev", args.abbrev)
      )
      .first();

    const verses = await ctx.db
      .query("bibleVerses")
      .withIndex("by_version_abbrev_chapter", (q: any) =>
        q
          .eq("version", args.version)
          .eq("abbrev", args.abbrev)
          .eq("chapter", args.chapter)
      )
      .collect();

    verses.sort((a: any, b: any) => a.number - b.number);

    return {
      book,
      chapter: args.chapter,
      verses,
    };
  },
});

/**
 * Busca um versículo único pelo livro, capítulo e número.
 */
export const getVerse = query({
  args: {
    version: v.string(),
    abbrev: v.string(),
    chapter: v.number(),
    number: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bibleVerses")
      .withIndex("by_version_abbrev_chapter_number", (q: any) =>
        q
          .eq("version", args.version)
          .eq("abbrev", args.abbrev)
          .eq("chapter", args.chapter)
          .eq("number", args.number)
      )
      .first();
  },
});

/**
 * Busca textual de versículos por palavra-chave.
 */
export const search = query({
  args: {
    version: v.string(),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.query || args.query.trim().length < 3) {
      throw new Error("O termo de busca deve conter no mínimo 3 caracteres.");
    }

    const limit = args.limit ?? 50;

    // Busca indexada por texto no schema
    const results = await ctx.db
      .query("bibleVerses")
      .withSearchIndex("search_text", (q: any) =>
        q.search("text", args.query).eq("version", args.version)
      )
      .take(limit);

    return results;
  },
});

/**
 * Seed / importação em lote de livros bíblicos (idempotente).
 */
export const upsertBooks = mutation({
  args: {
    books: v.array(
      v.object({
        version: v.string(),
        abbrev: v.string(),
        name: v.string(),
        author: v.optional(v.string()),
        chapters: v.number(),
        group: v.optional(v.string()),
        testament: v.union(v.literal("VT"), v.literal("NT")),
      })
    ),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    let updated = 0;

    for (const book of args.books) {
      const existing = await ctx.db
        .query("bibleBooks")
        .withIndex("by_version_abbrev", (q: any) =>
          q.eq("version", book.version).eq("abbrev", book.abbrev)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, book);
        updated++;
      } else {
        await ctx.db.insert("bibleBooks", book);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

/**
 * Seed / importação em lote de versículos bíblicos (idempotente).
 */
export const upsertVerses = mutation({
  args: {
    verses: v.array(
      v.object({
        version: v.string(),
        abbrev: v.string(),
        chapter: v.number(),
        number: v.number(),
        text: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    let updated = 0;

    for (const verse of args.verses) {
      const existing = await ctx.db
        .query("bibleVerses")
        .withIndex("by_version_abbrev_chapter_number", (q: any) =>
          q
            .eq("version", verse.version)
            .eq("abbrev", verse.abbrev)
            .eq("chapter", verse.chapter)
            .eq("number", verse.number)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { text: verse.text });
        updated++;
      } else {
        await ctx.db.insert("bibleVerses", verse);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

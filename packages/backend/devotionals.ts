import { v } from "convex/values";
import { query } from "./_generated/server";
import { devotionalDateSchema } from "domain";

/**
 * Busca o devocional do dia pelo índice by_date.
 * Valida o formato com zod antes de consultar.
 * Retorna null se não houver devocional para a data (sem lançar erro).
 */
export const getByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error(
        "Não autorizado: usuário deve estar autenticado para acessar o devocional."
      );
    }

    // Validação de formato da data YYYY-MM-DD com Zod (de packages/domain)
    const validation = devotionalDateSchema.safeParse(args.date);
    if (!validation.success) {
      throw new Error(
        `Formato de data inválido: ${args.date}. Esperado YYYY-MM-DD.`
      );
    }

    // Consulta pelo índice by_date
    const devotional = await ctx.db
      .query("devotionals")
      .withIndex("by_date", (q: any) => q.eq("date", args.date))
      .first();

    if (!devotional) {
      return null;
    }

    return {
      _id: devotional._id,
      date: devotional.date,
      scripture: devotional.scripture,
      reflection: devotional.reflection,
      audioUrl: devotional.audioUrl,
      prayerSuggestion: devotional.prayerSuggestion,
      createdAt: devotional.createdAt,
    };
  },
});

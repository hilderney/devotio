import { query } from "./_generated/server";

/**
 * Retorna as configurações globais (tema do mês e da semana).
 * Retorna null silenciosamente se ainda não configurado.
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && process.env.DEV_BYPASS_AUTH !== "true") {
      throw new Error(
        "Não autorizado: usuário deve estar autenticado para acessar as configurações devocionais."
      );
    }

    const settings = await ctx.db.query("globalSettings").first();
    if (!settings) {
      return null;
    }

    return {
      monthlyVerse: settings.monthlyVerse,
      weeklyVerse: settings.weeklyVerse,
      updatedAt: settings.updatedAt,
    };
  },
});

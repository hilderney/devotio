/**
 * Textos e mensagens oficiais do Devocional Diário.
 * Compartilhados estritamente entre Web e Mobile para evitar divergências de redação.
 */

export const DEVOTIONAL_MESSAGES = {
  emptyState: {
    title: "Nenhum devocional publicado",
    message: "O devocional de hoje ainda não foi publicado. Volte em breve.",
  },
  audio: {
    loading: "Carregando áudio...",
    error: "Não foi possível carregar o áudio.",
    titlePrefix: "Devocional de",
  },
  labels: {
    monthlyVerse: "TEMA DO MÊS",
    weeklyVerse: "TEMA DA SEMANA",
    prayerSuggestion: "DIRECIONAMENTO DE ORAÇÃO",
    scripture: "PALAVRA DO DIA",
    reflection: "REFLEXÃO PASTORAL",
  },
} as const;

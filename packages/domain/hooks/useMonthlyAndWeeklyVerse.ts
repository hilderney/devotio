import type { GlobalSettingsData } from "../types/devotional";

export interface UseMonthlyAndWeeklyVerseResult {
  data: GlobalSettingsData | null;
  isLoading: boolean;
  hasSettings: boolean;
}

export interface UseMonthlyAndWeeklyVerseParams {
  queryResult?: GlobalSettingsData | null;
}

/**
 * Hook reativo agnóstico para o Tema do Mês e Tema da Semana.
 */
export function useMonthlyAndWeeklyVerse(
  params?: UseMonthlyAndWeeklyVerseParams
): UseMonthlyAndWeeklyVerseResult {
  const rawData = params?.queryResult;
  const isLoading = rawData === undefined;
  const data = rawData ?? null;
  const hasSettings = !isLoading && data !== null;

  return {
    data,
    isLoading,
    hasSettings,
  };
}

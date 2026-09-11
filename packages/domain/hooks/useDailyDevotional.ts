import { useState, useEffect } from "react";
import { todayLocalISODate } from "../date/todayLocalISODate";
import type { DevotionalData } from "../types/devotional";

export interface UseDailyDevotionalResult {
  data: DevotionalData | null;
  isLoading: boolean;
  isEmpty: boolean;
  audioError: string | null;
  setAudioError: (error: string | null) => void;
  currentDate: string;
}

export interface UseDailyDevotionalParams {
  /**
   * Resultado direto da query Convex (useQuery) ou valor resolvido.
   * Se for undefined, indica carregamento.
   * Se for null, indica vazio (não publicado).
   */
  queryResult?: DevotionalData | null;
  dateOverride?: string;
}

/**
 * Hook reativo agnóstico para o Devocional Diário.
 * Gerencia a data local atual (recalculada ao cruzar meia-noite),
 * os estados de carregamento, vazio e erros de áudio.
 */
export function useDailyDevotional(
  params?: UseDailyDevotionalParams
): UseDailyDevotionalResult {
  const [currentDate, setCurrentDate] = useState<string>(() =>
    params?.dateOverride ?? todayLocalISODate()
  );
  const [audioError, setAudioError] = useState<string | null>(null);

  // Recalcula a data local periodicamente para tratar a virada de dia
  useEffect(() => {
    if (params?.dateOverride) {
      setCurrentDate(params.dateOverride);
      return;
    }

    const checkDate = () => {
      const now = todayLocalISODate();
      if (now !== currentDate) {
        setCurrentDate(now);
        setAudioError(null); // Reseta erro de áudio ao virar o dia
      }
    };

    // Checa a cada 30 segundos se a data local mudou
    const interval = setInterval(checkDate, 30_000);
    return () => clearInterval(interval);
  }, [currentDate, params?.dateOverride]);

  const rawData = params?.queryResult;
  const isLoading = rawData === undefined;
  const data = rawData ?? null;
  const isEmpty = !isLoading && data === null;

  return {
    data,
    isLoading,
    isEmpty,
    audioError,
    setAudioError,
    currentDate,
  };
}

import React from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface MonthlyVerseBannerProps {
  verse?: string | null;
}

/**
 * Tema do Mês: Fixo no topo da tela (sticky header), permanecendo visível
 * ao longo da rolagem contínua para meditação constante.
 * Trata ausência silenciosa se ainda não configurado.
 */
export const MonthlyVerseBanner: React.FC<MonthlyVerseBannerProps> = ({ verse }) => {
  if (!verse) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-monthlyBg border-b border-monthlyBorder text-monthlyText shadow-sm backdrop-blur-sm bg-opacity-95 transition-all">
      <div className="max-w-3xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-monthlyRef uppercase px-2 py-0.5 rounded bg-stone-800 border border-stone-700">
            {DEVOTIONAL_MESSAGES.labels.monthlyVerse}
          </span>
        </div>
        <p className="font-serif italic text-sm sm:text-base text-monthlyText leading-relaxed flex-1 sm:text-right">
          "{verse}"
        </p>
      </div>
    </header>
  );
};

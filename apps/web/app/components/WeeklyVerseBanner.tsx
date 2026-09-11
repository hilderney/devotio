import React from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface WeeklyVerseBannerProps {
  verse?: string | null;
}

/**
 * Tema da Semana: Logo abaixo do tema do mês, visualmente secundário ao tema do mês,
 * porém com destaque reverente sobre o corpo do devocional.
 */
export const WeeklyVerseBanner: React.FC<WeeklyVerseBannerProps> = ({ verse }) => {
  if (!verse) return null;

  return (
    <div className="w-full bg-weeklyBg border-b border-weeklyBorder text-weeklyText">
      <div className="max-w-3xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4">
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-weeklyRef uppercase">
          {DEVOTIONAL_MESSAGES.labels.weeklyVerse}
        </span>
        <p className="font-serif italic text-sm sm:text-base text-stone-800 leading-snug sm:text-right">
          "{verse}"
        </p>
      </div>
    </div>
  );
};

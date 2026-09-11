import React from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface PrayerSuggestionCardProps {
  prayerSuggestion: string;
}

/**
 * Sugestão de Oração: Bloco visualmente distinto (fundo âmbar acolhedor, borda diferenciada),
 * sinalizando instrução prática de oração pessoal.
 */
export const PrayerSuggestionCard: React.FC<PrayerSuggestionCardProps> = ({
  prayerSuggestion,
}) => {
  return (
    <aside
      aria-label="Sugestão de oração"
      className="w-full bg-prayerBg border border-prayerBorder rounded-lg p-5 sm:p-6 shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <svg
          className="w-4 h-4 text-prayerAccent shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="text-xs font-semibold tracking-wider text-prayerTitle uppercase">
          {DEVOTIONAL_MESSAGES.labels.prayerSuggestion}
        </span>
      </div>
      <p className="font-sans text-sm sm:text-base text-prayerText leading-relaxed">
        {prayerSuggestion}
      </p>
    </aside>
  );
};

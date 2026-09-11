import React from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface EmptyDevotionalStateProps {
  dateLabel?: string;
}

/**
 * Estado vazio: Quando não houver devocional publicado para o dia.
 * Sóbrio, acolhedor e visualmente distinto do estado de loading.
 */
export const EmptyDevotionalState: React.FC<EmptyDevotionalStateProps> = ({
  dateLabel,
}) => {
  return (
    <div className="w-full py-16 px-6 text-center space-y-4 max-w-md mx-auto my-8 border border-uiBorder/70 rounded-xl bg-surface/80 shadow-xs">
      <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-textMuted">
        <svg
          className="w-6 h-6 text-stone-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-lg font-medium text-textPrimary">
          {DEVOTIONAL_MESSAGES.emptyState.title}
        </h3>
        {dateLabel && (
          <p className="text-xs text-textMuted uppercase tracking-wider font-sans">
            {dateLabel}
          </p>
        )}
      </div>

      <p className="text-sm text-textSecondary leading-relaxed">
        {DEVOTIONAL_MESSAGES.emptyState.message}
      </p>
    </div>
  );
};

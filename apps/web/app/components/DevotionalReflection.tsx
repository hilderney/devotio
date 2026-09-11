import React from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface DevotionalReflectionProps {
  reflection: string;
}

/**
 * Reflexão: Exibida na íntegra, imediatamente após o texto bíblico,
 * sem exigir cliques ou expansões para revelar o conteúdo.
 */
export const DevotionalReflection: React.FC<DevotionalReflectionProps> = ({ reflection }) => {
  return (
    <section aria-labelledby="reflection-heading" className="space-y-3 pt-2">
      <div className="flex items-center gap-2 border-b border-subtleBg pb-2">
        <h2
          id="reflection-heading"
          className="text-xs font-semibold tracking-wider text-textMuted uppercase"
        >
          {DEVOTIONAL_MESSAGES.labels.reflection}
        </h2>
      </div>
      <div className="font-serif text-base sm:text-lg text-textPrimary leading-loose space-y-4 whitespace-pre-line font-normal">
        {reflection}
      </div>
    </section>
  );
};

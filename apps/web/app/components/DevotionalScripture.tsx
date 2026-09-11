import React from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface DevotionalScriptureProps {
  scripture: string;
}

/**
 * Devocional (Texto Bíblico): Renderiza como texto corrido, sem truncamento,
 * sem "leia mais" ou paginação (respeitando a Constituição §I).
 */
export const DevotionalScripture: React.FC<DevotionalScriptureProps> = ({ scripture }) => {
  return (
    <section aria-labelledby="scripture-heading" className="space-y-3">
      <div className="flex items-center gap-2 border-b border-subtleBg pb-2">
        <h2
          id="scripture-heading"
          className="text-xs font-semibold tracking-wider text-textMuted uppercase"
        >
          {DEVOTIONAL_MESSAGES.labels.scripture}
        </h2>
      </div>
      <div className="font-serif text-lg sm:text-xl text-textPrimary leading-relaxed tracking-normal font-normal pl-4 border-l-2 border-primary-accent italic bg-stone-50/60 py-3 pr-3 rounded-r-md">
        {scripture}
      </div>
    </section>
  );
};

import React from "react";

/**
 * Skeleton de carregamento: Mantém altura aproximada do conteúdo real
 * para eliminar Content Layout Shift (CLS) abrupto.
 */
export const DevotionalSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Carregando devocional..."
      className="w-full space-y-8 animate-pulse"
    >
      {/* Skeleton de Data e Áudio */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-stone-200 rounded"></div>
        <div className="h-14 w-full bg-stone-200/80 rounded-lg"></div>
      </div>

      {/* Skeleton do Texto Bíblico */}
      <div className="space-y-3 pt-2">
        <div className="h-3.5 w-28 bg-stone-200 rounded"></div>
        <div className="space-y-2.5 pl-4 border-l-2 border-stone-200 py-2">
          <div className="h-5 w-full bg-stone-200/80 rounded"></div>
          <div className="h-5 w-11/12 bg-stone-200/80 rounded"></div>
          <div className="h-5 w-4/5 bg-stone-200/80 rounded"></div>
        </div>
      </div>

      {/* Skeleton da Reflexão Pastoral */}
      <div className="space-y-3 pt-4">
        <div className="h-3.5 w-36 bg-stone-200 rounded"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-stone-200/80 rounded"></div>
          <div className="h-4 w-full bg-stone-200/80 rounded"></div>
          <div className="h-4 w-10/12 bg-stone-200/80 rounded"></div>
          <div className="h-4 w-full bg-stone-200/80 rounded"></div>
          <div className="h-4 w-3/4 bg-stone-200/80 rounded"></div>
        </div>
      </div>

      {/* Skeleton da Sugestão de Oração */}
      <div className="h-28 w-full bg-stone-200/60 rounded-lg border border-stone-200"></div>
    </div>
  );
};

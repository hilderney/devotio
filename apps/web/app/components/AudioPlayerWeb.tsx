import React, { useState, useRef } from "react";
import { DEVOTIONAL_MESSAGES } from "domain";

interface AudioPlayerWebProps {
  audioUrl?: string;
  onError?: (errorMessage: string) => void;
  dateLabel?: string;
}

/**
 * Player de Áudio Web: Baseado em <audio> HTML5 nativo, sem autoplay.
 * Se audioUrl for ausente, não renderiza nada.
 * Falhas de rede exibem um estado de erro discreto e elegante.
 */
export const AudioPlayerWeb: React.FC<AudioPlayerWebProps> = ({
  audioUrl,
  onError,
  dateLabel,
}) => {
  if (!audioUrl) return null;

  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleError = () => {
    setHasError(true);
    onError?.(DEVOTIONAL_MESSAGES.audio.error);
  };

  if (hasError) {
    return (
      <div
        role="alert"
        className="w-full bg-audioErrorBg border border-audioErrorBorder text-audioErrorText rounded-lg p-3 sm:p-4 flex items-center gap-3 text-sm"
      >
        <svg
          className="w-5 h-5 text-red-600 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-sans font-medium">
          {DEVOTIONAL_MESSAGES.audio.error}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-100 border border-uiBorder rounded-lg p-4 sm:p-4.5 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-textSecondary uppercase tracking-wider">
          <svg
            className="w-4 h-4 text-primary-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <span>
            {DEVOTIONAL_MESSAGES.audio.titlePrefix} {dateLabel ?? "Hoje"}
          </span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        preload="metadata"
        onError={handleError}
        className="w-full h-10 rounded focus:outline-none accent-stone-800"
      >
        Seu navegador não suporta a reprodução de áudio.
      </audio>
    </div>
  );
};

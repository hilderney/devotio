import React, { useState } from "react";
import { COMMUNITY_MESSAGES } from "domain";

interface MessageComposerProps {
  onSendMessage: (content: string) => Promise<void>;
}

/**
 * Caixa de composição de mensagens para o Mural da Comunidade (Visível apenas para AG / Admin).
 */
export const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage }) => {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(content.trim());
      setContent("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-surface border border-uiBorder rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
        <span className="text-xs font-semibold tracking-wider text-textSecondary uppercase">
          Orientação Pastoral / Mural do Líder
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={COMMUNITY_MESSAGES.labels.placeholderMessage}
        maxLength={1000}
        rows={3}
        className="w-full text-sm font-sans p-3 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600 transition-all placeholder:text-textMuted"
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-textMuted">
          {content.length}/1000 caracteres
        </span>
        <button
          type="submit"
          disabled={isSending || !content.trim()}
          className="px-4 py-2 rounded-lg bg-stone-800 text-stone-100 text-xs sm:text-sm font-medium hover:bg-stone-900 disabled:opacity-40 transition-all shadow-xs"
        >
          {isSending ? "Publicando..." : COMMUNITY_MESSAGES.labels.postButton}
        </button>
      </div>
    </form>
  );
};

import React from "react";
import { COMMUNITY_MESSAGES, type CommunityMessageData } from "domain";

interface MessageFeedProps {
  messages: CommunityMessageData[];
  isLoading?: boolean;
}

/**
 * Feed de mensagens publicadas no Mural da Comunidade.
 */
export const MessageFeed: React.FC<MessageFeedProps> = ({
  messages,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-stone-200/70 rounded-xl"></div>
        <div className="h-24 bg-stone-200/70 rounded-xl"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="w-full py-12 text-center space-y-2 border border-uiBorder/60 rounded-xl bg-surface/50">
        <p className="font-serif text-base font-medium text-textPrimary">
          {COMMUNITY_MESSAGES.emptyFeed.title}
        </p>
        <p className="text-xs sm:text-sm text-textSecondary max-w-sm mx-auto">
          {COMMUNITY_MESSAGES.emptyFeed.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <article
          key={msg._id}
          className="w-full bg-surface border border-uiBorder rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
        >
          <header className="flex items-center justify-between border-b border-subtleBg pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-100 flex items-center justify-center font-medium text-xs">
                {msg.sender.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-textPrimary">
                  {msg.sender.name}
                </h4>
                <span className="text-[10px] text-amber-700 uppercase font-medium tracking-wider">
                  Líder / Autoridade Guia
                </span>
              </div>
            </div>
            <time className="text-[11px] text-textMuted font-sans">
              {new Intl.DateTimeFormat("pt-BR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(msg.sentAt))}
            </time>
          </header>

          <p className="font-sans text-sm sm:text-base text-textPrimary leading-relaxed whitespace-pre-line">
            {msg.content}
          </p>
        </article>
      ))}
    </div>
  );
};

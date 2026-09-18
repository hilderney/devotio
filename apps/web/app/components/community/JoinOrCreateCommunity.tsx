import React, { useState } from "react";
import { COMMUNITY_MESSAGES } from "domain";

interface JoinOrCreateCommunityProps {
  onCreateCommunity: (name: string, description?: string, scripture?: string) => Promise<void>;
  onJoinCommunity: (inviteCode: string) => Promise<void>;
}

/**
 * Interface apresentada para usuários que ainda não participam de uma comunidade.
 */
export const JoinOrCreateCommunity: React.FC<JoinOrCreateCommunityProps> = ({
  onCreateCommunity,
  onJoinCommunity,
}) => {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scripture, setScripture] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onCreateCommunity(name.trim(), description.trim() || undefined, scripture.trim() || undefined);
    } catch (err: any) {
      setError(err.message || "Erro ao criar comunidade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onJoinCommunity(inviteCode.trim());
    } catch (err: any) {
      setError(err.message || COMMUNITY_MESSAGES.errors.invalidInviteCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 sm:p-8 bg-surface border border-uiBorder rounded-2xl shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-medium text-textPrimary">
          {COMMUNITY_MESSAGES.noCommunity.title}
        </h3>
        <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
          {COMMUNITY_MESSAGES.noCommunity.description}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center">
          {error}
        </div>
      )}

      {mode === "choose" && (
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setMode("join")}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-800 text-stone-100 text-sm font-medium hover:bg-stone-900 transition-all shadow-xs"
          >
            {COMMUNITY_MESSAGES.noCommunity.joinButton}
          </button>
          <button
            onClick={() => setMode("create")}
            className="w-full py-2.5 px-4 rounded-xl border border-uiBorder bg-surface text-stone-800 text-sm font-medium hover:bg-mutedBg transition-all"
          >
            {COMMUNITY_MESSAGES.noCommunity.createButton}
          </button>
        </div>
      )}

      {mode === "join" && (
        <form onSubmit={handleJoin} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Código de Convite (6 letras/números)
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Ex: AB3K9Z"
              maxLength={10}
              required
              className="w-full text-center font-mono text-lg uppercase tracking-widest p-3 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("choose");
                setError(null);
              }}
              className="w-1/3 py-2 text-xs rounded-lg border border-uiBorder hover:bg-mutedBg"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !inviteCode.trim()}
              className="w-2/3 py-2 rounded-lg bg-stone-800 text-stone-100 text-sm font-medium hover:bg-stone-900 disabled:opacity-40"
            >
              {isSubmitting ? "Entrando..." : "Confirmar Entrada"}
            </button>
          </div>
        </form>
      )}

      {mode === "create" && (
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Nome da Comunidade *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Comunidade Graça & Paz"
              maxLength={80}
              required
              className="w-full text-sm p-2.5 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição da congregação ou grupo"
              maxLength={280}
              className="w-full text-sm p-2.5 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Versículo Chave (opcional)
            </label>
            <textarea
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              placeholder="Ex: 'Porque onde estiverem dois ou três reunidos em meu nome...' (Mateus 18:20)"
              maxLength={500}
              rows={2}
              className="w-full text-sm p-2.5 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("choose");
                setError(null);
              }}
              className="w-1/3 py-2 text-xs rounded-lg border border-uiBorder hover:bg-mutedBg"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-2/3 py-2 rounded-lg bg-stone-800 text-stone-100 text-sm font-medium hover:bg-stone-900 disabled:opacity-40"
            >
              {isSubmitting ? "Criando..." : "Criar Comunidade"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

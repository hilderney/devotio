import React, { useState } from "react";
import { COMMUNITY_MESSAGES } from "domain";

interface ScriptureBannerProps {
  scripture?: string;
  isAdmin: boolean;
  onUpdateScripture?: (newScripture: string) => Promise<void>;
}

/**
 * Versículo chave da comunidade com opção de edição pastoral para o AG.
 */
export const ScriptureBanner: React.FC<ScriptureBannerProps> = ({
  scripture,
  isAdmin,
  onUpdateScripture,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(scripture ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim() || !onUpdateScripture) return;
    setIsSaving(true);
    try {
      await onUpdateScripture(value.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-weeklyBg border border-weeklyBorder rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-weeklyRef uppercase">
          {COMMUNITY_MESSAGES.labels.scripture}
        </span>
        {isAdmin && !isEditing && (
          <button
            onClick={() => {
              setValue(scripture ?? "");
              setIsEditing(true);
            }}
            className="text-xs text-textSecondary hover:text-textPrimary font-medium underline transition-colors"
          >
            Editar versículo
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 pt-1">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full text-sm font-serif p-2.5 rounded-lg border border-uiBorder bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
            placeholder="Digite a passagem bíblica central da comunidade..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs rounded border border-uiBorder hover:bg-mutedBg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !value.trim()}
              className="px-3 py-1 text-xs rounded bg-stone-800 text-stone-100 hover:bg-stone-900 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Salvando..." : "Salvar Versículo"}
            </button>
          </div>
        </div>
      ) : (
        <p className="font-serif italic text-base sm:text-lg text-textPrimary leading-relaxed">
          {scripture || "Nenhum versículo definido para esta comunidade."}
        </p>
      )}
    </div>
  );
};

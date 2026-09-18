import React, { useState } from "react";
import { type ChecklistData } from "domain";

interface ChecklistCardProps {
  checklists: ChecklistData[];
  myTicks: Set<string>;
  onToggleTick: (itemId: string) => void;
  isAdmin: boolean;
  onCreateChecklist?: (name: string, items: string[]) => Promise<void>;
}

/**
 * Listas devocionais e de oração para ticar com contagem agregada de participantes.
 */
export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  checklists,
  myTicks,
  onToggleTick,
  isAdmin,
  onCreateChecklist,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [listName, setListName] = useState("");
  const [rawItems, setRawItems] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim() || !rawItems.trim() || !onCreateChecklist) return;

    const items = rawItems
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (items.length === 0) return;

    setIsSaving(true);
    try {
      await onCreateChecklist(listName.trim(), items);
      setListName("");
      setRawItems("");
      setIsCreating(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão de Criação de Checklist para o AG */}
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-3 py-1.5 rounded-lg border border-uiBorder bg-surface text-xs font-medium text-textPrimary hover:bg-mutedBg transition-colors shadow-xs"
          >
            {isCreating ? "Fechar Formulário" : "+ Criar Nova Lista de Oração"}
          </button>
        </div>
      )}

      {/* Formulário de Criação */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="w-full bg-surface border border-uiBorder rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
        >
          <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
            Nova Lista de Oração / Ações
          </h4>
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Título da lista (ex: Motivos de Oração da Semana)"
            maxLength={100}
            className="w-full text-sm p-2.5 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
          />
          <textarea
            value={rawItems}
            onChange={(e) => setRawItems(e.target.value)}
            placeholder="Itens da lista (digite um motivo/item por linha)..."
            rows={4}
            className="w-full text-sm font-sans p-2.5 rounded-lg border border-uiBorder bg-canvas/40 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-stone-600"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs rounded border border-uiBorder hover:bg-mutedBg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !listName.trim() || !rawItems.trim()}
              className="px-4 py-1.5 rounded bg-stone-800 text-stone-100 text-xs font-medium hover:bg-stone-900 disabled:opacity-40 shadow-xs"
            >
              {isSaving ? "Salvando..." : "Salvar Lista"}
            </button>
          </div>
        </form>
      )}

      {/* Listas Ativas */}
      {checklists.length === 0 ? (
        <div className="w-full py-12 text-center space-y-2 border border-uiBorder/60 rounded-xl bg-surface/50">
          <p className="font-serif text-base font-medium text-textPrimary">
            Nenhuma lista ativa
          </p>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            Nenhuma lista devocional ou motivo de oração foi criado para esta comunidade até o momento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {checklists.map((cl) => (
            <div
              key={cl._id}
              className="w-full bg-surface border border-uiBorder rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
            >
              <h4 className="font-serif text-base font-semibold text-textPrimary">
                {cl.name}
              </h4>
              <div className="divide-y divide-subtleBg/70 border-t border-subtleBg pt-1">
                {cl.items.map((item) => {
                  const isChecked = myTicks.has(item._id);
                  return (
                    <label
                      key={item._id}
                      className="flex items-start gap-3 py-2.5 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleTick(item._id)}
                        className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-800 focus:ring-stone-600 accent-stone-800 transition-all cursor-pointer"
                      />
                      <span
                        className={`text-sm leading-relaxed transition-all ${
                          isChecked
                            ? "text-textMuted line-through"
                            : "text-textPrimary group-hover:text-stone-900"
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

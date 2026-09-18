import React from "react";

export type ActiveTab = "devocional" | "comunidade";

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  communityName?: string;
}

/**
 * Barra de navegação superior, minimalista e reverente.
 * Permite alternar entre a Palavra Diária e a Comunidade.
 */
export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  communityName,
}) => {
  return (
    <nav className="w-full bg-surface border-b border-uiBorder sticky top-0 z-30 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logotipo / Nome do App */}
        <div className="flex items-center gap-3">
          <span className="font-serif font-semibold text-lg text-textPrimary tracking-tight">
            Devotio
          </span>
          {communityName && (
            <span className="hidden sm:inline-block text-xs text-textMuted border-l border-uiBorder pl-3">
              {communityName}
            </span>
          )}
        </div>

        {/* Abas */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange("devocional")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === "devocional"
                ? "bg-primary text-textInverse shadow-xs"
                : "text-textSecondary hover:text-textPrimary hover:bg-mutedBg"
            }`}
          >
            Palavra Diária
          </button>
          <button
            onClick={() => onTabChange("comunidade")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === "comunidade"
                ? "bg-primary text-textInverse shadow-xs"
                : "text-textSecondary hover:text-textPrimary hover:bg-mutedBg"
            }`}
          >
            Comunidade
          </button>
        </div>
      </div>
    </nav>
  );
};

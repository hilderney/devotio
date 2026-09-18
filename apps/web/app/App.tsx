import React, { useState } from "react";
import { Navbar, type ActiveTab } from "./components/Navbar";
import { DevotionalPage } from "./routes/devocional";
import { CommunityPage } from "./routes/comunidade";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("devocional");

  return (
    <div className="min-h-screen bg-canvas flex flex-col selection:bg-amber-100 selection:text-stone-900">
      {/* Barra de Navegação Principal */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        communityName="Comunidade Graça & Vida"
      />

      {/* Roteamento de Apresentação */}
      <div className="flex-1 flex flex-col">
        {activeTab === "devocional" ? <DevotionalPage /> : <CommunityPage />}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  type CommunityData,
  type CommunityMemberData,
  type CommunityMessageData,
  type ChecklistData,
} from "domain";
import { ScriptureBanner } from "../components/community/ScriptureBanner";
import { MessageComposer } from "../components/community/MessageComposer";
import { MessageFeed } from "../components/community/MessageFeed";
import { MemberList } from "../components/community/MemberList";
import { ChecklistCard } from "../components/community/ChecklistCard";
import { JoinOrCreateCommunity } from "../components/community/JoinOrCreateCommunity";

// Dados de exemplo para demonstração/desenvolvimento
const DEMO_COMMUNITY: CommunityData = {
  _id: "comm_1",
  name: "Comunidade Graça & Vida",
  description: "Grupo de edificação, oração e supervisão pastoral mútua.",
  scripture: "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles. (Mateus 18:20)",
  createdBy: "user_pastor",
  createdAt: Date.now() - 86400000 * 30,
  inviteCode: "GRACA7",
  userRole: "admin", // Admin / AG por padrão para testes de liderança
};

const DEMO_MEMBERS: CommunityMemberData[] = [
  {
    memberId: "mem_1",
    userId: "user_pastor",
    name: "Pr. Lucas Silva",
    email: "lucas.silva@igreja.org",
    role: "admin",
    joinedAt: Date.now() - 86400000 * 30,
  },
  {
    memberId: "mem_2",
    userId: "user_membro1",
    name: "Ana Beatriz",
    email: "ana.beatriz@email.com",
    role: "member",
    joinedAt: Date.now() - 86400000 * 15,
  },
  {
    memberId: "mem_3",
    userId: "user_membro2",
    name: "Carlos Eduardo",
    email: "carlos.eduardo@email.com",
    role: "member",
    joinedAt: Date.now() - 86400000 * 5,
  },
];

const DEMO_MESSAGES: CommunityMessageData[] = [
  {
    _id: "msg_1",
    content: "Queridos irmãos, nesta semana estaremos jejuando pela saúde das famílias e pelo avanço dos ministérios. Meditemos no Salmo 23 diariamente.",
    sentAt: Date.now() - 86400000 * 2,
    sender: {
      _id: "user_pastor",
      name: "Pr. Lucas Silva",
    },
  },
  {
    _id: "msg_2",
    content: "Lembramos a todos do nosso encontro de oração nesta sexta-feira às 20h. Que a paz de Cristo reine em nossos lares.",
    sentAt: Date.now() - 3600000 * 5,
    sender: {
      _id: "user_pastor",
      name: "Pr. Lucas Silva",
    },
  },
];

const DEMO_CHECKLISTS: ChecklistData[] = [
  {
    _id: "cl_1",
    name: "Motivos de Oração da Semana",
    communityId: "comm_1",
    createdBy: "user_pastor",
    createdAt: Date.now() - 86400000,
    items: [
      { _id: "it_1", checklistId: "cl_1", text: "Oração pela família do irmão Marcos", order: 0 },
      { _id: "it_2", checklistId: "cl_1", text: "Intercessão pelos novos convertidos e batismos", order: 1 },
      { _id: "it_3", checklistId: "cl_1", text: "Gratidão pela recuperação da irmã Eunice", order: 2 },
    ],
  },
];

export const CommunityPage: React.FC = () => {
  const [community, setCommunity] = useState<CommunityData | null>(DEMO_COMMUNITY);
  const [activeSection, setActiveSection] = useState<"mural" | "listas" | "membros">("mural");
  const [members, setMembers] = useState<CommunityMemberData[]>(DEMO_MEMBERS);
  const [messages, setMessages] = useState<CommunityMessageData[]>(DEMO_MESSAGES);
  const [checklists, setChecklists] = useState<ChecklistData[]>(DEMO_CHECKLISTS);
  const [myTicks, setMyTicks] = useState<Set<string>>(new Set(["it_1"]));

  const isAdmin = community?.userRole === "admin";

  const handleSendMessage = async (content: string) => {
    const newMsg: CommunityMessageData = {
      _id: "msg_" + Date.now(),
      content,
      sentAt: Date.now(),
      sender: {
        _id: "user_pastor",
        name: "Pr. Lucas Silva",
      },
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleUpdateScripture = async (newScripture: string) => {
    if (community) {
      setCommunity({ ...community, scripture: newScripture });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  const handleToggleTick = (itemId: string) => {
    setMyTicks((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleCreateChecklist = async (name: string, items: string[]) => {
    const newChecklist: ChecklistData = {
      _id: "cl_" + Date.now(),
      name,
      communityId: community?._id,
      createdBy: "user_pastor",
      createdAt: Date.now(),
      items: items.map((text, idx) => ({
        _id: "it_" + Date.now() + "_" + idx,
        checklistId: "cl_" + Date.now(),
        text,
        order: idx,
      })),
    };
    setChecklists((prev) => [newChecklist, ...prev]);
  };

  const handleCreateCommunity = async (name: string, description?: string, scripture?: string) => {
    const newComm: CommunityData = {
      _id: "comm_" + Date.now(),
      name,
      description,
      scripture,
      createdBy: "user_pastor",
      createdAt: Date.now(),
      inviteCode: "NV" + Math.floor(1000 + Math.random() * 9000),
      userRole: "admin",
    };
    setCommunity(newComm);
  };

  const handleJoinCommunity = async (inviteCode: string) => {
    if (inviteCode === "GRACA7" || inviteCode.length >= 4) {
      setCommunity({
        ...DEMO_COMMUNITY,
        inviteCode: inviteCode.toUpperCase(),
        userRole: "member",
      });
    } else {
      throw new Error("Código de convite inválido.");
    }
  };

  if (!community) {
    return (
      <main className="max-w-3xl mx-auto w-full px-4 py-8">
        <JoinOrCreateCommunity
          onCreateCommunity={handleCreateCommunity}
          onJoinCommunity={handleJoinCommunity}
        />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Cabeçalho da Comunidade */}
      <header className="border-b border-subtleBg pb-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-textPrimary tracking-tight">
            {community.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 uppercase">
              {isAdmin ? "Papel: Administrador (AG)" : "Papel: Membro"}
            </span>
            <button
              onClick={() => {
                // Alterna o papel para testar visualizações de AG vs Membro
                setCommunity({
                  ...community,
                  userRole: isAdmin ? "member" : "admin",
                });
              }}
              className="text-[11px] text-textMuted hover:text-textSecondary underline"
              title="Alternar papel para testar visão do AG vs visão do Membro"
            >
              (Simular {isAdmin ? "Membro" : "Líder/AG"})
            </button>
          </div>
        </div>
        {community.description && (
          <p className="text-sm text-textSecondary leading-relaxed">
            {community.description}
          </p>
        )}
      </header>

      {/* Versículo Chave da Comunidade */}
      <ScriptureBanner
        scripture={community.scripture}
        isAdmin={isAdmin}
        onUpdateScripture={handleUpdateScripture}
      />

      {/* Sub-navegação interna da Comunidade */}
      <div className="flex border-b border-uiBorder gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveSection("mural")}
          className={`pb-2.5 transition-all relative ${
            activeSection === "mural"
              ? "text-textPrimary border-b-2 border-stone-800 font-semibold"
              : "text-textMuted hover:text-textSecondary"
          }`}
        >
          Mural Pastoral ({messages.length})
        </button>
        <button
          onClick={() => setActiveSection("listas")}
          className={`pb-2.5 transition-all relative ${
            activeSection === "listas"
              ? "text-textPrimary border-b-2 border-stone-800 font-semibold"
              : "text-textMuted hover:text-textSecondary"
          }`}
        >
          Listas & Oração ({checklists.length})
        </button>
        <button
          onClick={() => setActiveSection("membros")}
          className={`pb-2.5 transition-all relative ${
            activeSection === "membros"
              ? "text-textPrimary border-b-2 border-stone-800 font-semibold"
              : "text-textMuted hover:text-textSecondary"
          }`}
        >
          Membros ({members.length})
        </button>
      </div>

      {/* Conteúdo da Seção Ativa */}
      {activeSection === "mural" && (
        <section className="space-y-6">
          {isAdmin && <MessageComposer onSendMessage={handleSendMessage} />}
          <MessageFeed messages={messages} />
        </section>
      )}

      {activeSection === "listas" && (
        <section>
          <ChecklistCard
            checklists={checklists}
            myTicks={myTicks}
            onToggleTick={handleToggleTick}
            isAdmin={isAdmin}
            onCreateChecklist={handleCreateChecklist}
          />
        </section>
      )}

      {activeSection === "membros" && (
        <section>
          <MemberList
            members={members}
            currentUserIsAdmin={isAdmin}
            onRemoveMember={handleRemoveMember}
            inviteCode={community.inviteCode}
          />
        </section>
      )}
    </main>
  );
};

import React, { useState } from "react";
import { canRemoveMember, type CommunityMemberData } from "domain";

interface MemberListProps {
  members: CommunityMemberData[];
  currentUserIsAdmin: boolean;
  onRemoveMember?: (userId: string) => Promise<void>;
  inviteCode?: string;
}

/**
 * Lista de membros da comunidade com papéis e controle de remoção pastoral.
 */
export const MemberList: React.FC<MemberListProps> = ({
  members,
  currentUserIsAdmin,
  onRemoveMember,
  inviteCode,
}) => {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const adminCount = members.filter((m) => m.role === "admin").length;

  const handleRemove = async (userId: string) => {
    if (!onRemoveMember) return;
    setRemovingId(userId);
    try {
      await onRemoveMember(userId);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bloco de Código de Convite */}
      {inviteCode && (
        <div className="bg-prayerBg border border-prayerBorder rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-prayerTitle uppercase">
              Código de Convite da Comunidade
            </span>
            <p className="font-mono text-lg font-bold text-prayerText tracking-widest">
              {inviteCode}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteCode);
              alert("Código de convite copiado!");
            }}
            className="px-3 py-1.5 rounded-md bg-stone-800 text-stone-100 text-xs font-medium hover:bg-stone-900 transition-colors shadow-xs"
          >
            Copiar Código
          </button>
        </div>
      )}

      {/* Lista de Membros */}
      <div className="w-full bg-surface border border-uiBorder rounded-xl divide-y divide-subtleBg overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-mutedBg/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
            Membros Participantes ({members.length})
          </span>
          <span className="text-[11px] text-textMuted">
            {adminCount} Administrador{adminCount > 1 ? "es" : ""}
          </span>
        </div>

        {members.map((member) => {
          const removalCheck = canRemoveMember(member.role, adminCount);
          const isOnlyAdmin = !removalCheck.canRemove;

          return (
            <div
              key={member.memberId}
              className="px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-canvas/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="text-sm font-medium text-textPrimary leading-tight">
                    {member.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.2 rounded uppercase ${
                        member.role === "admin"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      {member.role === "admin" ? "Administrador (AG)" : "Membro"}
                    </span>
                    {member.email && (
                      <span className="text-[11px] text-textMuted hidden sm:inline">
                        {member.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {currentUserIsAdmin && (
                <div>
                  <button
                    onClick={() => handleRemove(member.userId)}
                    disabled={isOnlyAdmin || removingId === member.userId}
                    title={isOnlyAdmin ? removalCheck.reason : "Remover membro da comunidade"}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      isOnlyAdmin
                        ? "opacity-30 cursor-not-allowed text-stone-400 bg-stone-100"
                        : "text-red-700 hover:bg-red-50 border border-red-200"
                    }`}
                  >
                    {removingId === member.userId ? "Removendo..." : "Remover"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

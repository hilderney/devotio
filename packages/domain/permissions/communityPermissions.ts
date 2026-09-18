export type CommunityRole = "admin" | "member";

/**
 * Verifica se o papel do usuário é de Administrador / Autoridade Guia (AG).
 */
export function isAdminOfCommunity(role: CommunityRole | string | undefined | null): boolean {
  return role === "admin";
}

/**
 * Verifica se o usuário é membro ativo da comunidade (admin ou member).
 */
export function isMemberOfCommunity(role: CommunityRole | string | undefined | null): boolean {
  return role === "admin" || role === "member";
}

/**
 * Regra de negócio para remoção de membros:
 * Não é permitido remover o único administrador da comunidade.
 */
export function canRemoveMember(
  targetRole: CommunityRole | string,
  adminCount: number
): { canRemove: boolean; reason?: string } {
  if (targetRole === "admin" && adminCount <= 1) {
    return {
      canRemove: false,
      reason: "Não é possível remover o único administrador da comunidade.",
    };
  }
  return { canRemove: true };
}

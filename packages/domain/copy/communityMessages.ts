/**
 * Textos e mensagens oficiais para a Aba Comunidade.
 * Compartilhados entre Web e Mobile.
 */

export const COMMUNITY_MESSAGES = {
  emptyFeed: {
    title: "Mural silencioso",
    message: "Ainda não há mensagens publicadas pelo líder no mural desta comunidade.",
  },
  emptyChecklists: {
    title: "Nenhuma lista ativa",
    message: "Nenhuma lista devocional ou de oração foi criada até o momento.",
  },
  noCommunity: {
    title: "Você ainda não participa de uma comunidade",
    description: "Crie uma nova comunidade para liderar seu grupo ou ingresse com um código de convite compartilhado pelo seu pastor.",
    createButton: "Criar Nova Comunidade",
    joinButton: "Entrar com Código",
  },
  errors: {
    onlyAdminCanPost: "Apenas o administrador (AG) pode publicar no mural da comunidade.",
    onlyAdminCanUpdateScripture: "Apenas o administrador pode alterar o versículo da comunidade.",
    cannotRemoveOnlyAdmin: "Você não pode remover o único administrador desta comunidade.",
    invalidInviteCode: "Código de convite inválido ou comunidade inexistente.",
  },
  labels: {
    scripture: "VERSÍCULO DA COMUNIDADE",
    mural: "MURAL DA COMUNIDADE",
    checklists: "LISTAS PARA TICAR",
    members: "MEMBROS",
    inviteCode: "CÓDIGO DE CONVITE",
    postButton: "Publicar no Mural",
    placeholderMessage: "Escreva uma reflexão, aviso ou direcionamento pastoral para a comunidade...",
  },
} as const;

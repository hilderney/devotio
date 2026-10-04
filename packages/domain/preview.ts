// Development-only fixture. Imported dynamically behind import.meta.env.DEV in the web entrypoint.
import {
  communitySchema,
  inviteSchema,
  messageSchema,
  checklistSchema,
  scriptureSchema,
} from "./validators";
import { canManage, canRemoveMember, copy } from "./rules";
import type { Repository, HomeData, CommunityDetail, Watch } from "./types";
export function createPreviewRepository(): Repository {
  const listeners = new Set<() => void>();
  let sequence = 10;
  const id = () => String(++sequence);
  const groups: CommunityDetail[] = [
    {
      community: {
        id: "esperanca",
        name: "Comunidade Esperança",
        description:
          "Um espaço para caminhar juntos na fé, no cuidado e na oração.",
        scripture: "Que o amor seja o princípio de tudo o que fazemos.",
        role: "member",
      },
      members: [
        { id: "m1", userId: "leader", name: "Daniel Almeida", role: "admin" },
        { id: "m2", userId: "me", name: "Marina Oliveira", role: "member" },
        { id: "m3", userId: "ruth", name: "Rute Santos", role: "member" },
      ],
      messages: [
        {
          id: "a1",
          name: "Daniel Almeida",
          sentAt: Date.now() - 86400000,
          content:
            "Que esta semana seja um convite à presença. Reserve um momento para escutar, acolher alguém e levar suas inquietações a Deus.",
        },
        {
          id: "a2",
          name: "Daniel Almeida",
          sentAt: Date.now() - 3600000,
          content:
            "Nosso encontro de oração será nesta quarta-feira, às 19h30. Você é bem-vindo, com suas alegrias e com aquilo que ainda é difícil colocar em palavras.",
        },
      ],
      lists: [
        {
          id: "l1",
          name: "Para levar em oração",
          items: [
            {
              id: "i1",
              text: "Pelas famílias da nossa comunidade",
              checked: false,
              count: 1,
            },
            {
              id: "i2",
              text: "Por quem precisa de acolhimento",
              checked: false,
              count: 2,
            },
            {
              id: "i3",
              text: "Por sabedoria nas pequenas decisões",
              checked: false,
              count: 1,
            },
          ],
        },
      ],
      hasMore: false,
      nextCursor: null,
    },
  ];
  const group = (groupId: string) => {
    const value = groups.find((g) => g.community.id === groupId);
    if (!value) throw new Error(copy.revoked);
    return value;
  };
  const admin = (groupId: string) => {
    const value = group(groupId);
    if (!canManage(value.community.role))
      throw new Error("Apenas a liderança pode realizar esta ação.");
    return value;
  };
  const publish = () => listeners.forEach((fn) => fn());
  const watch =
    <T>(read: () => T): Watch<T> =>
    (next, error) => {
      const emit = () => {
        try {
          next(structuredClone(read()));
        } catch (e) {
          error(e instanceof Error ? e : new Error(copy.network));
        }
      };
      listeners.add(emit);
      queueMicrotask(() => {
        if (listeners.has(emit)) emit();
      });
      return () => {
        listeners.delete(emit);
      };
    };
  return {
    mode: "preview",
    watchHome: (date) =>
      watch<HomeData>(() => ({
        user: { id: "me", name: "Marina Oliveira" },
        settings: {
          monthlyVerse: "Aquietai-vos e sabei que eu sou Deus.",
          monthlyReference: "Salmo 46:10 · tema ilustrativo",
          weeklyVerse: "Um coração atento ao que permanece.",
          weeklyReference: "Tema da semana",
        },
        devotional: {
          id: "preview",
          date,
          reference: "Salmo 46:1–3",
          translation: "Paráfrase ilustrativa",
          scripture:
            "Deus é abrigo e força, presença que nos ampara nos dias difíceis.\nPor isso, não precisamos entregar o coração ao medo, mesmo quando tudo ao redor parece mudar.\nAinda que as águas se agitem e os montes estremeçam, encontramos nele um lugar de descanso.",
          reflection:
            "Nem sempre o silêncio chega quando tudo se resolve. Às vezes, ele começa quando deixamos de carregar sozinhos aquilo que pesa.\n\nO convite de hoje é simples: fazer uma pausa. Perceber a respiração, acolher o momento presente e lembrar que não precisamos ter todas as respostas para nos aproximar de Deus.\n\nEntre uma tarefa e outra, há espaço para um coração que escuta. Que a Palavra encontre esse espaço em nós e nos ensine a atravessar o dia com mais confiança e gentileza.",
          prayerSuggestion:
            "Senhor, ajuda-me a descansar em tua presença. Acalma o que está inquieto em mim e ensina-me a reconhecer teu cuidado nas pequenas coisas de hoje. Amém.",
          credit:
            "Texto ilustrativo para avaliação da interface. Não é uma publicação pastoral revisada.",
        },
      })),
    watchCommunities: () => watch(() => groups.map((g) => g.community)),
    watchCommunity: (groupId, cursor) =>
      watch(() => {
        const value = groups.find((g) => g.community.id === groupId);
        if (!value) return null;
        const offset = Number(cursor ?? 0);
        const messages = [...value.messages]
          .reverse()
          .slice(offset, offset + 50)
          .reverse();
        const hasMore = offset + 50 < value.messages.length;
        return {
          ...value,
          messages,
          hasMore,
          nextCursor: hasMore ? String(offset + 50) : null,
        };
      }),
    async createCommunity(input) {
      const value = communitySchema.parse(input);
      const groupId = id();
      groups.push({
        community: {
          id: groupId,
          ...value,
          scripture: "",
          role: "admin",
          inviteCode:
            "DEVO" +
            Array.from(
              { length: 4 },
              (_, i) =>
                "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[
                  (Number(groupId) >> (i * 5)) % 32
                ],
            ).join(""),
        },
        members: [
          { id: id(), userId: "me", name: "Marina Oliveira", role: "admin" },
        ],
        messages: [],
        lists: [],
        hasMore: false,
        nextCursor: null,
      });
      publish();
      return groupId;
    },
    async previewInvite(code) {
      const normalized = inviteSchema.parse(code);
      const found = groups.find(
        (g) =>
          g.community.inviteCode === normalized ||
          (normalized === "ESPERANC" && g.community.id === "esperanca"),
      );
      return found
        ? { id: found.community.id, name: found.community.name }
        : null;
    },
    async joinCommunity(code) {
      const normalized = inviteSchema.parse(code);
      const found = groups.find(
        (g) =>
          g.community.inviteCode === normalized ||
          (normalized === "ESPERANC" && g.community.id === "esperanca"),
      );
      if (!found)
        throw new Error("Não encontramos uma comunidade com esse código.");
      return found.community.id;
    },
    async sendMessage(groupId, content) {
      admin(groupId).messages.push({
        id: id(),
        name: "Marina Oliveira",
        content: messageSchema.parse(content),
        sentAt: Date.now(),
      });
      publish();
    },
    async updateScripture(groupId, scripture) {
      admin(groupId).community.scripture = scriptureSchema.parse(scripture);
      publish();
    },
    async createChecklist(groupId, name, items) {
      const value = checklistSchema.parse({ name, items });
      admin(groupId).lists.push({
        id: id(),
        name: value.name,
        items: value.items.map((text) => ({
          id: id(),
          text,
          checked: false,
          count: 0,
        })),
      });
      publish();
    },
    async setTick(itemId, checked) {
      const item = groups
        .flatMap((g) => g.lists)
        .flatMap((l) => l.items)
        .find((i) => i.id === itemId);
      if (!item) throw new Error("Item não encontrado.");
      if (item.checked !== checked) {
        item.count += checked ? 1 : -1;
        item.checked = checked;
        publish();
      }
    },
    async removeMember(groupId, memberId) {
      const value = admin(groupId);
      const member = value.members.find((m) => m.id === memberId);
      if (!member) return;
      if (
        !canRemoveMember(
          member.role,
          value.members.filter((m) => m.role === "admin").length,
        )
      )
        throw new Error(copy.lastAdmin);
      value.members = value.members.filter((m) => m.id !== memberId);
      publish();
    },
  };
}

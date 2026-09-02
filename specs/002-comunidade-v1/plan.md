# Plano Técnico: Comunidade (v1)

**Spec relacionada:** ./spec.md
**Status:** aprovado

## 1. Impacto no schema (`packages/backend/schema.ts`)

Nenhuma tabela nova. Uma adição pequena e opcional para resolver a pergunta em
aberto §9 da spec:

- `communities.inviteCode: v.string()` — código curto gerado na criação da
  comunidade, usado pelo fluxo de "entrar via convite". Adicionar índice
  `by_inviteCode`.

## 2. Funções Convex necessárias

| Função | Tipo | Descrição | Quem pode chamar |
|---|---|---|---|
| `communities.create` | mutation | cria comunidade + `communityMembers` (role admin) para o criador | qualquer usuário autenticado |
| `communities.updateScripture` | mutation | atualiza `scripture` | apenas AG da comunidade |
| `communities.joinByInviteCode` | mutation | adiciona o usuário atual como `member` via `inviteCode` | qualquer usuário autenticado |
| `communityMembers.remove` | mutation | remove membro; bloqueia se for o único admin | apenas AG |
| `communityMessages.send` | mutation | cria mensagem | apenas AG |
| `communityMessages.listByCommunity` | query | lista mensagens ordenadas por `sentAt` | membro ou AG da comunidade |
| `checklists.create` | mutation | cria checklist + itens iniciais, `communityId` obrigatório | apenas AG |
| `checklistTicks.toggle` | mutation | cria/remove o tick do usuário atual para um item | membro ou AG da comunidade |
| `checklistTicks.countByItem` | query | retorna contagem agregada por item, sem lista nominal | membro ou AG da comunidade |

## 3. Regras de negócio → `packages/domain`

- `packages/domain/permissions/isAdminOfCommunity.ts` — recebe `userId,
  communityId`, checa `communityMembers` (role `admin`). Usado dentro de **toda**
  mutation de AG listada acima — nunca só no client.
- `packages/domain/permissions/isMemberOfCommunity.ts` — usado para bloquear
  queries/mutations de quem não pertence à comunidade.
- `packages/domain/validators/communityValidators.ts` — zod para nome/descrição de
  comunidade, texto de mensagem (limite de tamanho), nome de checklist/item.
- `packages/domain/hooks/useCommunity.ts`, `useCommunityMessages.ts`,
  `useChecklist.ts` — encapsulam as queries acima.

## 4. Impacto em `apps/web`

- Rotas: `comunidade/index.tsx` (escritura + mural), `comunidade/membros.tsx`
  (gestão, visível só se `isAdminOfCommunity`), `comunidade/listas.tsx`.
- Componentes: `ScriptureBanner`, `MessageFeed`, `MessageComposer` (só renderiza se
  AG — mas a proteção real é a mutation, não o `if`), `ChecklistCard` com contagem
  agregada.

## 5. Impacto em `apps/mobile`

- Telas equivalentes em `apps/mobile/app/(tabs)/comunidade/`.
- `MessageComposer` mobile precisa de teclado bem posicionado (KeyboardAvoidingView)
  — diferença de UX que não existe no plano web, registrada aqui para não virar
  bug "silencioso" depois.

## 6. Riscos técnicos e decisões a validar

- Geração de `inviteCode`: garantir unicidade (checar índice antes de inserir ou
  usar Convex `action` com retry) — decisão de implementação, sem impacto de schema
  adicional além do índice já listado.
- Bloqueio de "remover o único admin": implementar como checagem explícita dentro
  de `communityMembers.remove`, com teste de domínio dedicado (não confiar em UI
  para prevenir isso).

## 7. Plano de testes

- `packages/domain`: teste de `isAdminOfCommunity` e `isMemberOfCommunity` com
  casos positivo/negativo.
- `packages/domain`: teste garantindo que `communityMembers.remove` rejeita remover
  o último admin.
- `packages/domain`: teste de `checklistTicks.toggle` sendo idempotente por
  usuário (marcar duas vezes não duplica).
- Manual: dois usuários de teste (um AG, um membro) confirmando que o membro não
  consegue enviar mensagem nem ver quem marcou o quê na checklist.

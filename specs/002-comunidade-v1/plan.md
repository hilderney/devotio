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
| `communities.create` | mutation | cria comunidade + `communityMembers` (role admin) para o criador, gera `inviteCode` | qualquer usuário autenticado |
| `communities.updateScripture` | mutation | atualiza `scripture` | apenas AG da comunidade |
| `communities.joinByInviteCode` | mutation | adiciona o usuário atual como `member` via `inviteCode` | qualquer usuário autenticado |
| `communities.get` | query | retorna dados da comunidade (nome, descrição, scripture) para membros | membro ou AG da comunidade |
| `communityMembers.list` | query | lista membros (nome, papel) da comunidade | membro ou AG da comunidade |
| `communityMembers.remove` | mutation | remove membro; bloqueia se for o único admin | apenas AG |
| `communityMessages.send` | mutation | cria mensagem | apenas AG |
| `communityMessages.listByCommunity` | query | lista mensagens paginadas, ordenadas por `sentAt` desc para paginação, exibidas asc na UI | membro ou AG da comunidade |
| `checklists.create` | mutation | cria checklist + itens iniciais, `communityId` obrigatório, mínimo 1 item | apenas AG |
| `checklists.listByCommunity` | query | lista checklists ativas da comunidade | membro ou AG da comunidade |
| `checklistTicks.toggle` | mutation | cria/remove o tick do usuário atual para um item (idempotente) | membro ou AG da comunidade |
| `checklistTicks.countByItem` | query | retorna contagem agregada por item, sem lista nominal | membro ou AG da comunidade |
| `checklistTicks.myTicks` | query | retorna quais itens o usuário atual já marcou (para renderizar o checkbox como marcado) | membro ou AG da comunidade |

### Contratos e casos de borda

- **`communities.create`**: implementado como uma única mutation Convex (garante
  atomicidade nativa da plataforma entre o insert de `communities` e de
  `communityMembers` — resolve o requisito de "não ficar órfã" da spec §4 item 1
  sem precisar de transação manual).
- **`communityMembers.remove(communityId, targetUserId)`**: antes de remover,
  contar quantos `communityMembers` com `role: "admin"` existem para a
  `communityId`; se o alvo é admin e a contagem é 1, rejeitar com erro
  `"Não é possível remover o único administrador da comunidade."`.
- **`communityMessages.send`**: valida `content` (1–1000 caracteres) via zod
  antes de checar permissão, para retornar o erro mais específico primeiro só
  depois de confirmar que o usuário tem permissão de enviar (evita vazar detalhe
  de validação para quem nem deveria poder chamar a função).
- **`communityMessages.listByCommunity`**: paginação via `paginationOptsValidator`
  do Convex (cursor-based), página inicial de 50 mensagens — decisão que atende
  ao requisito não-funcional de "escala razoável para v1" (spec §5).
- **`checklistTicks.toggle(checklistItemId)`**: `userId` sempre lido de
  `ctx.auth.getUserIdentity()`, nunca recebido como argumento — elimina por
  construção a possibilidade de um usuário marcar tick em nome de outro.

## 3. Regras de negócio → `packages/domain`

- `packages/domain/permissions/isAdminOfCommunity.ts` — recebe `userId,
  communityId`, checa `communityMembers` (role `admin`). Usado dentro de **toda**
  mutation de AG listada acima — nunca só no client.
- `packages/domain/permissions/isMemberOfCommunity.ts` — usado para bloquear
  queries/mutations de quem não pertence à comunidade.
- `packages/domain/permissions/canRemoveMember.ts` — encapsula a regra de
  "não remover o único admin", reusável tanto na mutation quanto em testes.
- `packages/domain/validators/communityValidators.ts` — zod para: nome (1–80),
  descrição (≤280), scripture (≤500), conteúdo de mensagem (1–1000), nome de
  checklist e de item.
- `packages/domain/hooks/useCommunity.ts`, `useCommunityMembers.ts`,
  `useCommunityMessages.ts` (com paginação), `useChecklists.ts`,
  `useChecklistTicks.ts` — encapsulam as queries acima. `useCommunityMessages`
  expõe `loadMore()` para a paginação cursor-based.
- `packages/domain/copy/communityMessages.ts` — textos fixos de erro/estado vazio
  (ex: "Você não pode remover o único administrador desta comunidade."),
  compartilhados entre os dois apps.

## 4. Impacto em `apps/web`

- Rotas: `comunidade/index.tsx` (escritura + mural), `comunidade/membros.tsx`
  (gestão, visível só se `isAdminOfCommunity`), `comunidade/listas.tsx`.
- Componentes: `ScriptureBanner`, `MessageFeed` (com botão/scroll "carregar mais"
  usando `loadMore()`), `MessageComposer` (só renderiza se AG — mas a proteção
  real é a mutation, não o `if`), `MemberList` com botão de remoção condicional,
  `ChecklistCard` com contagem agregada e checkbox refletindo `useChecklistTicks`.
- Formulário de criação de comunidade e de entrada por `inviteCode` como duas
  rotas/telas separadas (`comunidade/nova.tsx`, `comunidade/entrar.tsx`).
- Erros de mutation (ex: tentar remover único admin) exibidos via toast/inline,
  usando o texto de `communityMessages.ts` — nunca a mensagem de erro bruta do
  Convex.

## 5. Impacto em `apps/mobile`

- Telas equivalentes em `apps/mobile/app/(tabs)/comunidade/`.
- `MessageComposer` mobile precisa de teclado bem posicionado
  (`KeyboardAvoidingView`) — diferença de UX que não existe no plano web,
  registrada aqui para não virar bug "silencioso" depois.
- `MessageFeed` mobile usa `FlatList` com `onEndReached` acionando `loadMore()`,
  em vez do botão "carregar mais" do web — mesma função de domínio, gatilho de UI
  diferente por convenção de plataforma (scroll infinito é padrão em listas
  nativas).
- Entrada por `inviteCode`: considerar suporte a colar o código via clipboard
  (`expo-clipboard`) como conveniência mobile — não obrigatório para v1, mas
  registrar como melhoria de baixo custo.

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

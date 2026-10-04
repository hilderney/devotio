# Plano Técnico: Comunidade (v1)

> Revisão técnica de 02/10/2026: a base aprovada foi preservada, com correções documentais para a SPA atual. Ver [stack](../../docs/engineering/stack.md) e [estado real](../../docs/engineering/status.md). Integração e aceites não estão concluídos; nativo fica para etapa posterior.

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
| `checklistTicks.toggle` | mutation | contrato de estado desejado pendente; ver casos de borda | membro ou AG da comunidade |
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
- **`communityMessages.send`**: autenticar e verificar associação/papel antes de
  validar conteúdo via Zod e persistir. Não expor dados do grupo a usuários sem acesso.
- **`communityMessages.listByCommunity`**: paginação via `paginationOptsValidator`
  do Convex (cursor-based), página inicial de 50 mensagens — decisão que atende
  ao requisito não-funcional de "escala razoável para v1" (spec §5).
- **Marcação de item**: `userId` vem da sessão. O nome histórico `toggle` não
  define idempotência: repetir uma inversão muda o resultado. Antes de executar T8,
  revisar o contrato para receber estado desejado (marcado/desmarcado) ou uma chave
  de operação. A spec exige resultado idempotente; não marcar T8 pronta com toggle simples.

## 3. Regras de negócio → `packages/domain`

- `packages/domain/permissions/communityPermissions.ts` já contém helpers puros
  para papel e remoção do último admin. O backend carrega a associação do usuário
  autenticado e passa os fatos para esses helpers; domain não consulta o banco.
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

## Divergências a resolver antes do aceite

A matriz da spec §6 menciona editar/remover mensagens próprias, mas §7 exclui
edição/remoção. A recomendação do piloto é seguir §7 até revisão explícita do
produto. A escolha de convite por código continua pendente de confirmação.

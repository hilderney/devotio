# Tasks: Comunidade (v1)

**Plano relacionado:** ./plan.md

## Backend / Domain (`packages/backend`, `packages/domain`)

- [ ] T1 — Adicionar `inviteCode` + índice `by_inviteCode` em `communities`.
      Critério de aceite: geração de código garante unicidade (checar índice
      antes de inserir, com retry em caso de colisão).
- [ ] T2 — Implementar `communities.create` como mutation atômica única (insert de
      `communities` + `communityMembers` role admin + geração de `inviteCode`).
      Critério de aceite: valida nome (1–80) e descrição (≤280) via zod antes de
      inserir; nunca deixa a comunidade sem nenhum admin.
- [ ] T3 — Implementar `communities.updateScripture` e `communities.get`.
      Critério de aceite: `updateScripture` valida ≤500 caracteres e checa
      `isAdminOfCommunity`; `get` checa `isMemberOfCommunity`.
- [ ] T4 — Implementar `communities.joinByInviteCode`.
      Critério de aceite: código inválido/inexistente retorna erro específico
      (não genérico); usuário já membro chamando de novo é idempotente (não
      duplica o registro em `communityMembers`).
- [ ] T5 — Implementar `communityMembers.list` e `communityMembers.remove` com
      `canRemoveMember` em `packages/domain/permissions`.
      Critério de aceite: teste de domínio cobrindo (a) remover membro comum,
      (b) tentar remover único admin → rejeitado, (c) remover admin quando existe
      outro admin → permitido.
- [ ] T6 — Implementar `communityMessages.send` e `communityMessages.listByCommunity`
      com paginação (`paginationOptsValidator`, página inicial de 50).
      Critério de aceite: `send` valida conteúdo (1–1000) e checa
      `isAdminOfCommunity` antes de inserir; membro comum chamando diretamente a
      mutation recebe erro de permissão.
- [ ] T7 — Implementar `checklists.create` e `checklists.listByCommunity`.
      Critério de aceite: `create` rejeita checklist sem nenhum item; itens
      recebem `order` sequencial a partir de 0.
- [ ] T8 — Implementar `checklistTicks.toggle`, `checklistTicks.countByItem` e
      `checklistTicks.myTicks`.
      Critério de aceite: `toggle` usa `userId` de `ctx.auth.getUserIdentity()`
      (nunca de argumento); teste de domínio confirmando idempotência (chamar
      duas vezes seguidas não duplica nem deixa em estado inconsistente).
- [ ] T9 — Implementar `isAdminOfCommunity`, `isMemberOfCommunity`,
      `canRemoveMember` em `packages/domain/permissions`, com testes cobrindo
      caso positivo e negativo de cada um.
- [ ] T10 — Implementar hooks `useCommunity`, `useCommunityMembers`,
      `useCommunityMessages` (com `loadMore()`), `useChecklists`,
      `useChecklistTicks` em `packages/domain/hooks`.
- [ ] T11 — Criar `packages/domain/copy/communityMessages.ts` com os textos fixos
      de erro/estado vazio usados pelos dois apps.

## Web (`apps/web`)

- [ ] T-W1 — Telas `comunidade/nova.tsx` e `comunidade/entrar.tsx` (criação e
      entrada por `inviteCode`), com validação de formulário espelhando os
      limites de T2/T4.
- [ ] T-W2 — Tela `comunidade/index.tsx`: `ScriptureBanner` + `MessageFeed` com
      "carregar mais" usando `loadMore()` + `MessageComposer` condicional ao AG.
      Critério de aceite: erro de mutation exibido via texto de
      `communityMessages.ts`, nunca erro bruto do Convex.
- [ ] T-W3 — Tela `comunidade/membros.tsx`: `MemberList` com remoção condicional
      ao AG; botão de remover desabilitado (com tooltip explicativo) quando o
      alvo é o único admin.
- [ ] T-W4 — Tela `comunidade/listas.tsx`: `ChecklistCard` com contagem agregada
      e checkbox refletindo `useChecklistTicks`.

## Mobile (`apps/mobile`)

- [ ] T-M1 — Telas equivalentes a T-W1/T-W2/T-W3/T-W4 em `apps/mobile`.
- [ ] T-M2 — `MessageComposer` com `KeyboardAvoidingView` testado em iOS e Android.
- [ ] T-M3 — `MessageFeed` com `FlatList` + `onEndReached` acionando `loadMore()`.
- [ ] T-M4 — (opcional, baixo custo) Botão de colar `inviteCode` via
      `expo-clipboard` na tela de entrada.

## Cross-cutting

- [ ] Testes de domínio de T5, T8 e T9 passando.
- [ ] Validação manual com dois usuários de teste (um AG, um membro) confirmando:
      membro não envia mensagem, membro não remove ninguém, membro não vê quem
      marcou o quê na checklist (apenas contagem), AG não consegue remover a si
      mesmo sendo o único admin.
- [ ] Confirmar decisão de convite por código com o dono do produto (spec §9)
      antes de fechar T1/T2/T4.
- [ ] Checar que paginação do mural (T6/T-W2/T-M3) se comporta bem com uma
      comunidade de teste com 100+ mensagens simuladas.

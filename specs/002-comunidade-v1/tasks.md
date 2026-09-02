# Tasks: Comunidade (v1)

**Plano relacionado:** ./plan.md

## Backend / Domain (`packages/backend`, `packages/domain`)

- [ ] T1 — Adicionar `inviteCode` + índice `by_inviteCode` em `communities`.
- [ ] T2 — Implementar `communities.create`, `communities.updateScripture`,
      `communities.joinByInviteCode`.
- [ ] T3 — Implementar `communityMembers.remove` com bloqueio de "único admin" +
      teste de domínio.
- [ ] T4 — Implementar `communityMessages.send` e `.listByCommunity`.
- [ ] T5 — Implementar `checklists.create`, `checklistTicks.toggle`,
      `checklistTicks.countByItem`.
- [ ] T6 — Implementar `isAdminOfCommunity`, `isMemberOfCommunity` em
      `packages/domain/permissions`, com testes.
- [ ] T7 — Implementar hooks `useCommunity`, `useCommunityMessages`,
      `useChecklist`.

## Web (`apps/web`)

- [ ] T-W1 — Tela de escritura + mural (`comunidade/index.tsx`).
- [ ] T-W2 — Tela de gestão de membros, visível condicionalmente ao AG.
- [ ] T-W3 — Tela de listas/checklists com contagem agregada.

## Mobile (`apps/mobile`)

- [ ] T-M1 — Telas equivalentes a T-W1/T-W2/T-W3 em `apps/mobile`.
- [ ] T-M2 — `MessageComposer` com `KeyboardAvoidingView` testado em iOS e Android.

## Cross-cutting

- [ ] Testes de domínio de T3 e T6 passando.
- [ ] Validação manual com dois usuários (AG e membro) confirmando as regras de
      permissão da spec §6, em web e mobile.
- [ ] Confirmar decisão de convite por código com o dono do produto (spec §9) antes
      de fechar T1/T2.

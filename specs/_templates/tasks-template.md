# Tasks: [Nome da Feature]

**Plano relacionado:** ./plan.md

Cada task deve ser pequena o suficiente para um agente completar e verificar
sozinho, com critério de aceite claro.

## Backend / Domain (`packages/backend`, `packages/domain`)

- [ ] T1 — [descrição] — critério de aceite: ...
- [ ] T2 — ...

## Web (`apps/web`)

- [ ] T-W1 — ...

## Mobile (`apps/mobile`)

- [ ] T-M1 — ...

## Cross-cutting

- [ ] Atualizar `docs/architecture.md` se alguma decisão de arquitetura mudou.
- [ ] Testes de `packages/domain` cobrindo as regras da spec §6.
- [ ] Validar manualmente em web e mobile.

## Evidência e liberação

- [ ] Lint real e typecheck em todos os workspaces aplicáveis.
- [ ] Testar autorização nas funções do backend, além das regras puras de domain.
- [ ] Registrar evidências do aceite (comando, resultado, data; capturas quando úteis).
- [ ] Validar cotas, licenças e dados pessoais conforme impacto.
- [ ] Documentar diferenças de plataforma; manter tasks adiadas abertas.
- [ ] Atualizar estado real e checklist de release; nenhuma proposta marcada como entregue.

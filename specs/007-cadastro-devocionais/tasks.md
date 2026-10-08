# Tasks: Cadastro de devocionais

## Revisão autorizada 07/10/2026

- [x] R1 — Palavra somente leitura e metadados canônicos no servidor.
- [x] R2 — Busca, seleção contextual e estado preservado nas idas e voltas.
- [x] R3 — Testes integrados, lint/typecheck/build e documentação atualizada.

Evidência da revisão atual: 119 testes (71 domain + 30 backend + 18 web), sem
skips; lint/typecheck/verify:web passaram. Inclui Palavra readonly, preservação dos
campos/seleção nas idas e voltas, busca preenchida e metadados canônicos no servidor.
Revisão física C3 e Expo permanecem pendentes; evidências abaixo são do marco anterior.

**Plano:** [plan.md](plan.md).

## Backend / Domain

- [x] T1 — Contrato Zod, calendário de Brasília e testes de regras.
- [x] T2 — Criar somente em data livre; editar existente; autorização no servidor, autoria e auditoria.
- [x] T3 — Exclusão lógica e persistência; testes de conflito, papéis e disponibilidade.
- [x] T4 — Adaptador com invalidação direcionada e sem polling.

## Web

- [x] W1 — Listagem CRUD e formulário branco com três botões e tipografia uniforme.
- [x] W2 — Seleção bíblica, preenchimento, cancelamento e isolamento do rascunho por conta.
- [x] W3 — Placeholder Auxílio sem IA; testes de fluxo em DOM.

## Mobile

- [ ] M1 — Implementação Expo adiada; somente web responsiva neste marco.

## Cross-cutting e evidências

- [x] C1 — Arquitetura, catálogo e status atualizados.
- [x] C2 — Lint, typecheck, testes e build reais.
- [ ] C3 — Revisão visual física no navegador.

Evidências de 07/10/2026: `npm run test` — 96 testes passaram (64 domain, 22 backend,
10 web), sem skips. Incluem autorização no banco, data ocupada/retirada, edição,
disponibilidade na fronteira da meia-noite, reabertura do SQLite, cache diário,
invalidação por data, seleção bíblica, cancelamento, três botões/ausência de SVG,
Auxílio sem rede, conflito preservando formulário e confirmação de retirada.
`npm run lint`, `npm run typecheck` e `npm run verify:web` passaram. HTTP exigiu
execução autorizada fora do sandbox após EACCES no loopback. Revisão visual física
continua aberta; não confundir jsdom com navegador real. Sem implantação pública.

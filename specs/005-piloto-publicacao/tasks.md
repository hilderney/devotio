# Tasks: Publicação do piloto gratuito

**Plano relacionado:** [plan.md](./plan.md)  
**Spec:** [spec.md](./spec.md)

Contas ainda inexistentes. Execução é operacional/guiada; marcar item só com evidência (URL, captura ou nota datada). Coordenar com R1/R2 em [004/tasks.md](../004-fundacao-lancamento/tasks.md).

## Backend / Domain

- [ ] B1 — Criar conta Convex no plano **Free** e projeto do piloto — critério: plano Free confirmado no painel; sem Starter/faturamento automático.
- [ ] B2 — Inicializar deployment com `packages/backend` (`convex.json`) e gerar artefatos oficiais necessários — critério: URLs `.convex.cloud` e `.convex.site` anotadas.
- [ ] B3 — Configurar `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `SITE_URL` no Convex — critério: secrets só no painel; nenhum segredo em `VITE_*` ou Git.
- [ ] B4 — Validar auth e autorização no deployment real (login local ou URL final) — critério: sessão criada; usuário sem papel negado nas funções; evidência registrada. Fecha parte de R1 da 004.

## Web / hospedagem

- [ ] W1 — Criar conta Cloudflare e projeto Pages ligado ao GitHub `hilderney/devotio` — critério: projeto Pages existe e aponta para o repo.
- [ ] W2 — Configurar build: `npm ci && npm run build --workspace=web`, saída `apps/web/dist`, Node `24.19.0`, env `VITE_CONVEX_URL` e `VITE_CONVEX_SITE_URL` — critério: deploy bem-sucedido; `_redirects` e `_headers` no artefato.
- [ ] W3 — Smoke test no `*.pages.dev`: refresh de rotas SPA, HTTPS, manifest/SW — critério: link direto e refresh funcionam sem 404 de rota.
- [ ] W4 — Alinhar Google OAuth (origins + callback Convex) e `SITE_URL` ao URL Pages definitivo; retestar login/logout/cancelamento em Safari iOS e Chrome Android — critério: OAuth no URL público ok. Completa R1 da 004 quando evidenciado.

## Mobile

- [ ] M1 — Expo/lojas fora desta spec; manter adiado (alinhado à 004 M1).

## Cross-cutting / operação

- [ ] O1 — Criar projeto Google Cloud, OAuth Client Web e consent em modo Testing com e-mails dos convidados — critério: client id/secret no Convex; redirect `…/api/auth/callback/google`.
- [ ] O2 — Publicar conteúdo editorial aprovado no deployment do piloto (sem fixtures) — critério: leitura do dia disponível para usuário autenticado. Parte de R2 da 004.
- [ ] O3 — Convite limitado (meta 20–50); preencher registro operacional de cotas em [free-launch.md](../../docs/operations/free-launch.md) — critério: linha datada com plano Free e cota observada.
- [ ] O4 — Atualizar [status.md](../../docs/engineering/status.md) e marcar R1/R2 na 004 somente com evidências — critério: docs refletem URL público e pendências reais.
- [ ] O5 — Ensaio mínimo de recuperação: redeploy/rollback estático e nota sobre snapshot Convex conforme [release.md](../../docs/operations/release.md) — critério: procedimento registrado; sem migração automática para plano pago.

## Evidência e liberação

- [ ] Lint, typecheck, testes e `npm run verify:web` antes do primeiro deploy público.
- [ ] Nenhuma fixture ou `DEV_BYPASS_AUTH` no ambiente do piloto.
- [ ] Spec 005 só avança de “rascunho” após aprovação humana explícita; tasks só fecham com evidência.

# Tasks — reconstrução web

- [x] W-H1 Cabeçalho desktop compacto na rolagem, links acessíveis, perfil/sino e faixa mensal reduzida; reserva de altura completa e movimento reduzido. Passaram 34 testes web, lint/typecheck do monorepo e build/PWA. Integração verifica rolagem/retorno, altura reservada, aviso acionável e desativação da compactação fora do desktop sem consultas por rolagem. Homologação visual/física pendente.

**Plano:** [plan.md](plan.md). Evidências devem distinguir execução local de produção.

## Consolidação para testes — 08/10/2026

- [ ] W-C1 — Consolidar botões e retorno bíblico; preservar semântica e estados acessíveis.
- [ ] W-C2 — Separar casca/menu das rotas; feedback de falha visível e retorno de foco.
- [ ] W-C3 — Organizar CSS por área, remover duplicações e corrigir navegação estreita.
- [ ] W-C4 — Padronizar editor/formulários e fechamento dos modais.
- [ ] Q-C1 — Testes de regressão, lint/typecheck, build/PWA e inspeção visual possível.
- [ ] Q-C2 — Registrar roteiro de testes, evidências e bloqueios reais da publicação.

Backend/domain: sem regra nova prevista. Mobile: adiado, sem entrega nativa.

## Backend / domain

- [x] F1 — Contratos, validadores Zod, regras puras e testes de permissão, data e idempotência.
- [x] F2 — Backend Convex real com auth Google, acesso por grupo e operações de comunidade.
- [x] F3 — Publicação interna com metadados de licença/revisor, liberação e auditoria.
- [x] F4 — Hooks e adaptadores reais; prévia local isolada e efêmera.
- [x] F5 — Testes de autorização entre grupos, escrita de membro e proteção de ticks.

## Web

- [x] W1 — Nova identidade visual, shell responsivo e TanStack Router.
- [x] W2 — Leitura diária e estados, áudio opcional, temas e data local.
- [x] W3 — Comunidades: criação/convite, mural, listas e membros.
- [x] W4 — Acesso, conta, ajuda e aviso de privacidade de pré-lançamento.
- [x] W5 — PWA, fontes locais, atualização e cache sem dados privados.

## Mobile

- [ ] M1 — Expo adiado; diferença de distribuição registrada no plano.

## Cross-cutting

- [x] Q4 — Retorno seguro ao destino após login e mensagens recuperáveis de OAuth/logout (implementação local; OAuth real em R1).
- [x] Q5 — Validar configuração de ambiente sem fallback acidental para fixtures.
- [x] Q6 — Automatizar verificação do build de produção e registrar homologação pendente.

- [x] Q1 — Lint, typecheck, testes e build reais nos workspaces.
- [x] Q2 — Verificação visual desktop/celular e navegação/formulários no navegador.
- [x] Q3 — Atualizar documentação com comandos, estado implementado e pendências.
- [ ] R1 — Configurar credenciais e verificar OAuth em dispositivos reais (depende de contas).
- [ ] R2 — Aprovar conteúdo/licenças/política, ensaiar recuperação e liberar piloto (não é parte da prévia local).

## Evidência local — 03/10/2026

Lint, typecheck e build passaram. Testes de regras e autorização usam Vitest/convex-test. Interface conferida em 390px e 1440px; criação, mural e ticks na prévia funcionam. O build conectado também compilou; OAuth real e instalação física não foram verificados. R1/R2 e M1 permanecem abertos. Veja docs/engineering/status.md.

Continuação: 45 testes (38 domain + 7 backend), incluindo destino seguro,
configuração parcial, descarte de dados ao trocar sessão e virada local de data.
verify:web passou com inspeção do service worker e do bundle. Revisão visual
desta rodada não executada: controle de navegador bloqueado por política da
ferramenta. Nenhuma credencial real foi encontrada no workspace; apenas .env.example.

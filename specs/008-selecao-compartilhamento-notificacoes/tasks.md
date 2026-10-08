# Tasks: Seleção, compartilhamento e notificações

## Menu expansível — revisão 07/10/2026

- [x] D1 — Estados texto/ícones, altura total, direita e seta abaixo de X.
- [x] D2 — Swipe horizontal por mouse/toque e expansão pela tela no celular.
- [x] D3 — Testes de gestos sem disparar ações/alterar seleção; checks monorepo.
- [ ] D4 — Conferência física de gestos/rolagem em navegador móvel.

Evidência: `npm run test` passou com 121 testes (71 domain + 30 backend em cache
verificado, 20 web executados nesta revisão); lint/typecheck/verify:web passaram.
DOM verifica estados, seleção/destinos preservados, ações compactas, swipes,
rolagem vertical distinguida e clique posterior ao arraste suprimido. Não houve
chamadas HTTP adicionais causadas pelos gestos. Verificação física segue em D4.

## Revisão autorizada 07/10/2026

- [x] R1 — Cópia numerada, múltiplas comunidades e ícone Enviar.
- [x] R2 — Rascunhos privados persistentes com autorização, lote e retry atômicos.
- [x] R3 — Escrever, escolher Palavra e retornar sem perda do comentário/seleção.
- [x] R4 — Testes, documentação e verificações do monorepo.

Evidência da revisão atual: 119 testes (71 domain + 30 backend + 18 web), sem
skips; lint/typecheck/verify:web passaram. Lote multi-select privado, isolamento de
autor, reabertura SQLite, retry após publicação/descarte e invalidação somente do
destino foram verificados. Gestos, área de transferência e visual físicos em C3
continuam pendentes; evidências abaixo são do marco anterior.

**Plano:** [plan.md](plan.md).

## Backend / Domain

- [x] B1 — Seleção, referência, quote e contratos validados; testes puros.
- [x] B2 — Migração não destrutiva, mensagens estruturadas e avisos transacionais.
- [x] B3 — Consultas paginadas, lida explícita, isolamento, mensagem alvo e persistência.
- [x] B4 — SSE autenticado sem polling; ciclo de sessão e resumo direto no adaptador.
- [x] B5 — Busca parcial e reutilização de resultados por sessão.

## Web

- [x] W1 — Seleção simples/intervalo, teclado, arraste e menu lateral; gestos físicos em C3.
- [x] W2 — Compartilhamento externo, cadastro Palavra e rascunho comunitário.
- [x] W3 — Sino/modal, badge, lida explícita e destinos autorizados.
- [x] W4 — Busca automática e testes integrados em DOM.
- [x] W5 — Esclarecido pelo usuário: Lida somente nas notificações; nenhuma marcação bíblica.

## Mobile

- [ ] M1 — Expo adiado; somente navegador responsivo nesta etapa.

## Cross-cutting

- [x] C1 — Arquitetura, documentação de uso, catálogo e status.
- [x] C2 — Lint, typecheck, testes, HTTP local e build reais.
- [ ] C3 — Inspeção visual/gestos em navegador físico.

## Evidências — 07/10/2026

`npm run test`: 112 testes, sem skips (69 domain + 27 backend + 16 web). Incluem
intervalo invertido, texto/referência/versão, bloqueio por papel, postagem idempotente,
destinatários, revogação, paginação, lida explícita persistente e mensagem antiga.
HTTP real valida autenticação SSE, alteração de contador e encerramento no logout.
React/jsdom valida menu/X, arraste simulado, compartilhamento, rascunho antes de
publicar, sino/lida, busca após quatro caracteres e atualização SSE sem novo HTTP.
Suíte HTTP/SSE executada com autorização para loopback fora do sandbox.

Lint/typecheck e `verify:web` passaram. Navegador físico não foi usado; validação
de long-press/rolagem e visualização nativa de compartilhar continua em C3.
Sem novos serviços, IA, push, publicação ou implementação Expo/Convex público.

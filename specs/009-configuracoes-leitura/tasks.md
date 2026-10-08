# Tasks: configurações e leitura

- [x] W6 Fechar menu da conta no clique externo, Escape e ações internas; fluxo de Configurações e link verificados em integração (31 testes web e repetição focada do teste de menu após incluir clique externo). Lint/typecheck e build/PWA passaram. Visual físico pendente.

## Backend/domain

- [x] D1 Validator de preferências, horário e janela com testes.
- [x] D2 Antecipação e retenção no cache de seis, deduplicação e testes.

## Web

- [x] W7 Converter todos os selects compartilhados para modal de opções; seleção/cancelamento, teclado/foco, grupos e modal dentro das Configurações. Passaram 33 testes web (28 integração + 5 componente), lint/typecheck do monorepo e build/PWA. Sem select nativo, painel ancorado ou Popover API na web. Homologação física pendente.

- [x] W1 Provider persistente, modal no perfil, aplicação imediata e temas.
- [x] W2 Escala tipográfica e preservação de âncora.
- [x] W3 Leitura contínua limitada, vizinhos e paginação por gesto sem conflito.
- [x] W4 Testes de integração dos fluxos e chamadas.
- [x] W5 Revisão solicitada: dropdown compartilhado nos seis selects, temas e teclado; verificar integração.

## Mobile

- [ ] M1 Adaptadores nativos — adiados, sem implementação nesta etapa.

## Cross-cutting

- [x] C1 Lint, typecheck, testes e build; documentação do estado real.
- [ ] C2 Homologação visual e gestos em aparelho físico.

## Evidências — 08/10/2026

Suíte completa: **131 testes passaram, sem skips** (77 domain, 30 backend, 24 web),
incluindo HTTP/SSE em execução autorizada. Casos novos verificam preferências,
fronteiras do relógio, vizinhos, visitas versus antecipações, cache máximo de seis,
reabertura, aplicação imediata sem chamadas extras, persistência/logout, swipe
grande/curto/vertical e avanço/retorno no modo Contínuo limitado a três capítulos.
Simulações em jsdom não substituem a homologação física C2. Expo não implementado.

Lint e typecheck passaram no monorepo. `verify:web` passou: build, manifest,
licenças, 19 recursos estáticos, ausência de fixtures e cache de API. Bundle
principal 574,25 kB (aviso acima de 500 kB já existente); sem dependência nova.
Links locais e `git diff --check` verificados.

Revisão de dropdowns: **28 testes web passaram, sem skips** (25 integração + 3
componente). Verificados teclado, foco, grupos, seleção, campos desabilitados,
fechamento, fallback sem Popover API, data/capítulo e aplicação imediata no modal.
Build/PWA passou; nenhuma tag select/option/optgroup permanece no código da web.
Domain/backend não foram alterados nesta revisão visual.

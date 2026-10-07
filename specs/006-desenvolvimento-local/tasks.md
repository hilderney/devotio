# Tasks — produto local

## Backend/domain
- [x] Contratos, validação, janela por fuso e permissões com testes.
- [x] SQLite persistente, migração/seed e sessão mock validada no servidor.
- [x] Comunidades e isolamento de acesso, listas, ticks e convites.
- [x] Devocional, snapshots privados e operações editoriais auditadas.
- [x] Importação AA validada, idempotente; leitura e busca locais.

## Web
- [x] Perfis/login/logout, integração HTTP e três abas.
- [x] Janela recente, favoritos e espelho com limpeza de sessão.
- [x] Bíblia com seleção de livro/capítulo, busca e referência por URL.
- [x] Operação editorial local e estados de erro/loading/vazio.

## Cross-cutting
- [x] Testar autorização HTTP, persistência e integridade de AA.
- [x] Lint, typecheck, testes e build; mock excluído da produção.
- [x] Documentar comandos, perfis, banco, evidências e limites.
- [ ] Verificar interface em desktop/celular.

**Evidências em 04/10/2026:** 63 testes (45 domínio + 18 backend), incluindo AA
real, sem skips. `verify:local` e `verify:web` passaram. Corpo bíblico e fontes
conferidos em [status](../../docs/engineering/status.md). UI implementada e
compilada; a revisão visual permanece aberta porque o controle da página foi
bloqueado pela política de URL/protocolo da ferramenta. Não declarar DoD visual
ou homologação pública concluída.

## Mobile
- [ ] Adiado: apresentação/storage nativos; não integra esta entrega.

## Revisão 05/10 — cache e sessão
- [x] Backend/domain: lote de oito datas, diferença diária e validação de janela.
- [x] Domain: cache persistente versionado, seis capítulos LRU e deduplicação.
- [x] Domain: eliminar polling e invalidar apenas leituras afetadas por mutações.
- [x] Web: armazenamento por perfil, sessão de 30 dias e eventos entre abas.
- [x] Web: atualização manual e leitura recente offline a partir do cache.
- [x] Testar contagem de requisições, recarga, virada de dia, LRU e isolamento.
- [x] Validar monorepo e atualizar documentação operacional.

Evidências desta revisão: 79 testes (60 domain + 19 backend), lint/typecheck,
build/PWA, `verify:web` e `verify:local`. Contagens de rede medidas nos testes do
adaptador; revisão visual permanece aberta e mobile continua adiado.

## Correção 06/10 — entrada travada
- [x] Reproduzir com teste integrado da interface, roteador e bootstrap em StrictMode.
- [x] Corrigir transição e verificar visitante, sessão existente, login e falha de conexão.
- [x] Validar lint/typecheck, testes pertinentes e build; registrar evidências.

Evidências: 85 testes (60 domain + 19 backend + 6 web), lint/typecheck e
`verify:web`. Os testes web usam jsdom/HTTP simulado, incluindo logout, destino
protegido e as três áreas. Revisão visual física permanece pendente.

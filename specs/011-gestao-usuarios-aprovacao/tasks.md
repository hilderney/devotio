# Tasks — Gestão de usuários e aprovação

## Backend/domain
- [x] Contratos e validadores; regras de situação e permissões com testes.
- [x] Schema e bootstrap idempotente preservando usuários existentes.
- [x] Exigir aprovação nas operações públicas de conteúdo.
- [x] Login senha/TOTP, limitação de tentativas, replay, expiração e logout.
- [x] CRUD, configuração do piloto e permissões comunitárias/editoriais.
- [x] Testes negativos de segurança e isolamento no Convex.

## Web
- [x] Página não listada de entrada e gestão, paginação, filtros e confirmação.
- [x] Estado de espera/desativação após Google e revogação reativa.
- [x] Gestão editorial conectada para contas autorizadas.
- [x] Testes de interface e build/PWA.

## Mobile
- [ ] Adiado: app Expo e homologação nativa; não faz parte desta entrega.

## Cross-cutting
- [x] Arquitetura, status e roteiro de configuração/recuperação atualizados.
- [x] Lint, typecheck e testes do monorepo.
- [ ] Homologação com Google e autenticador reais no ambiente publicado.
- [ ] Publicação aprovada e executada no deployment identificado.

## Evidências de 09/10/2026

- 163 testes passaram sem skips: 83 domain, 39 backend, 41 web.
- `npm run lint` e `npm run typecheck` passaram em todos os workspaces.
- Comando completo: `npm run test -- --concurrency=1 -- --maxWorkers=2`.
  Rodada inicial teve EACCES no loopback e timeouts de testes existentes sob
  carga; execução autorizada fora do sandbox e com paralelismo limitado passou.
- Testes Convex usam componente Better Auth real em convex-test: bootstrap,
  pré-cadastro verificado, preservação de legados, importação, paginação, edição,
  desativação, última administração ativa, editorial, senha, TOTP, replay e limite.
- `npm run verify:web` passou: build/PWA, 22 recursos estáticos, sem fixtures ou
  runtime cache de API. Advertências de comentários de dependências no Rollup.
- `npx convex codegen --typecheck disable` completou geração e análise de módulos
  na configuração dev da raiz, sem finalizar deploy ou alterar dados do piloto.
- Setup de credenciais não executado para não gerar segredos do proprietário.
  Teste com autenticador físico, Google real, revisão visual física e rollout
  seguem pendentes; não declarar a feature ativa no site publicado.
- Auditoria npm online em 09/10: 11 entradas (3 moderadas, 6 altas, 2 críticas),
  em ferramentas de desenvolvimento já presentes no lockfile, incluindo
  Vitest/Tinypool e dependências de Tailwind. Versões desses pacotes não foram
  alteradas por esta feature. Atualização major dessas ferramentas fica separada;
  não executar `npm audit fix --force` como parte deste CRUD. Auditoria offline
  não foi usada como evidência de ausência de vulnerabilidades.

# Tasks: versões da Bíblia

## Backend/domain

- [x] Validar/normalizar ALM1911 e preparar pacote determinístico com hash/contagens.
- [x] Criar contrato/adaptador de Bíblia com versões, busca e cache limitado.
- [x] Preservar preferências antigas e identificar versão em seleções/cópias.
- [x] Reconstruir citações ALM1911 no backend local mantendo regras de acesso.
- [x] Testar corpus real, cache, edição, citações e preferências no núcleo.

## Web

- [x] Acrescentar seletor nas Configurações e habilitar ALM1911 no build público/conectado.
- [x] Preservar endereço/termo e eliminar dados antigos ao trocar de edição.
- [x] Testar escolha, persistência e leitura/busca da edição correta.

## Mobile

- [ ] Implementação/homologação Expo adiada (não concluída).

## Cross-cutting

- [x] Atualizar arquitetura, fonte bíblica e estado real.
- [x] Lint, typecheck, testes e build verificados; corpus fora do bundle/precache.
- [x] Publicar Worker e verificar catálogo/capítulo da ALM1911.
- [ ] Homologação visual/física no aparelho do usuário.

Verificação em 09/10/2026: 153 testes passaram (83 domain, 31 backend, 39 web).
Suítes afetadas repetidas após ajustes finais, sem falhas. Lint/typecheck do monorepo
e build/verify:web finais passaram. Inspeção do build confere 1.189 capítulos e
31.101 versículos, corpus fora do JS/precache e ausência de fixtures de desenvolvimento.
HTTP local exigiu execução autorizada fora do sandbox por EACCES no loopback.

Integração realizada pelo usuário: `main` contém o CRUD após o merge `46f3bb0`.
O log de produção de 09/10 às 18:33 UTC revelou perda de exportações de Bíblia em
`domain/core` durante esse merge. Também se perdeu a ligação `Repository.bible`
do app conectado. Correção restaura ambas, preservando aprovação/CRUD; validação
do estado integrado e publicação permanecem separadas.

- [x] Validar o build de produção após restaurar exports e composição do app conectado.

Correção de integração em 09/10/2026: build do workspace web e verificação do
artefato passaram, com 66 livros/1.189 capítulos/31.101 versículos. Lint/typecheck
do monorepo passaram. Foram executados 135 testes (88 domain + 47 web), incluindo
quatro regressões da composição conectada para preservar Bíblia e aprovação.

Publicação `a5d52d2`: Workers Builds concluído com sucesso. HTTP público verificou
catálogo JSON e João 1 com 51 versículos, além dos assets atuais do leitor e seletor.
Isso não verificou o menu autenticado: o usuário identificou que ele ainda dependia
de `repository.reading`, apesar de a rota já usar `repository.bible`.

- [x] Corrigir a disponibilidade dos menus desktop/celular e validar navegação.

Correção do menu em 09/10: menus consideram Bíblia independente da capacidade
privada local. Três testes de Bíblia publicada passaram, incluindo links desktop
e celular e navegação de Devocional para João 1. Lint/typecheck do monorepo e build
web passaram. A regressão era de interface, não ausência do corpus no Worker.

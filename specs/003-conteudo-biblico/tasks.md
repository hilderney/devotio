# Tasks: Conteúdo Bíblico — Importação, Cache e Leitura

> Revisão de 04/10/2026: Bíblia integra o marco web local. Tasks abertas e
> condicionadas à revisão aprovada da spec/plano. D4/D5 resolvidas: importar
> **AA** da ABíbliaDigital em `.api.br` para o banco. Nenhuma tabela bíblica existe
> no schema ativo.

**Plano relacionado:** ./plan.md

> Pré-requisito: as perguntas restantes da `spec.md §9` (condições de uso,
> identificação da edição e atualização) precisam de resposta antes de iniciar T1. Não começar a
> importar dados "provisoriamente" enquanto a licença não estiver confirmada.

## Backend / Domain (`packages/backend`, `packages/domain`)

- [ ] T1 — Adicionar `bibleBooks` e `bibleVerses` ao schema, com os índices
      listados no plano §1.
      Critério de aceite: `npx convex dev` roda sem erro de schema; índices
      compostos cobrem os padrões de acesso de leitura por capítulo e por
      versículo único.
- [ ] T2 — Implementar a interface `BibleContentProvider` e o
      `abibliaDigitalApiProvider`, após validação dos contratos reais de AA.
      Prever lotes por capítulo, retomada, timeout e concorrência controlada.
      Critério de aceite: rodar o provider isoladamente (fora do Convex, em
      script Node local) retorna a estrutura esperada para pelo menos 1 livro
      antes de integrar com `syncVersion`.
- [ ] T3 — Implementar `bibleContent.syncVersion` como `internalAction`.
      Critério de aceite: idempotente (teste de domínio rodando duas vezes);
      retorna o resumo estruturado descrito no plano §3; não é chamável do
      client (verificar que não aparece como função pública na API gerada).
- [ ] T4 — Implementar `bibleContent.listBooks`, `getChapter`, `getVerse`.
      Critério de aceite: `getChapter`/`getVerse` retornam `null`/lista vazia
      (nunca erro) para referência inexistente (spec §4 item 8).
- [ ] T5 — Adicionar search index em `bibleVerses.text` e implementar
      `bibleContent.search`.
      Critério de aceite: query rejeita termo com menos de 3 caracteres (zod);
      resposta limitada a 100 resultados.
- [ ] T6 — Implementar `formatReference` em `packages/domain/bible/reference.ts`
      com testes cobrindo capítulo inteiro vs. versículo específico.
- [ ] T7 — Implementar hooks `useBibleBooks`, `useBibleChapter`, `useBibleVerse`,
      `useBibleSearch` em `packages/domain/hooks`.

## Validação de dados (antes de considerar o import "fonte de verdade")

- [ ] T8 — Importar a versão AA (edição definida na spec §9) em ambiente de
      desenvolvimento via `syncVersion`.
- [ ] T9 — Validar amostra de ao menos 10 versículos conhecidos contra uma fonte
      impressa/confiável, registrando o resultado (aprovado ou lista de
      divergências encontradas) antes de qualquer uso em produção.
- [ ] T10 — Medir o tamanho real ocupado no Convex após a importação de T8 e
      confirmar contra o limite do free tier (plano §7) antes de decidir importar
      versões adicionais.

## Web (`apps/web`) — priorizada; aguarda revisão aprovada da spec/plano

- [ ] T-W1 — Rotas `biblia/index.tsx`, `biblia/$abbrev.tsx`,
      `biblia/$abbrev.$chapter.tsx`, `biblia/busca.tsx`.
- [ ] T-W2 — Componentes `BookList`, `ChapterList`, `VerseList`,
      `SearchResults`, consumindo os hooks de T7.

## Mobile (`apps/mobile`) — adiado; não integra o marco local web

- [ ] T-M1 — Telas equivalentes a T-W1 em `apps/mobile/app/(tabs)/fe-madura/biblia/`.

## Cross-cutting

- [ ] Confirmar respostas às perguntas da spec §9 e atualizar o status da spec
      de "rascunho" para "aprovada" antes de iniciar T1.
- [ ] Testes de domínio (T3, T6) passando.
- [ ] Atualizar `docs/architecture.md` (Modelo de Dados) e registrar evidência de licença;
      revisar também a arquitetura se o provider escolhido introduzir alguma
      dependência de infraestrutura não prevista (ex: se a decisão for self-host
      da abibliadigital em vez do dataset estático).

# Plano Técnico: Conteúdo Bíblico — Importação, Cache e Leitura

> Revisão de 04/10/2026: Bíblia priorizada para a web local. Fonte ABíbliaDigital
> escolhida; nenhuma tabela bíblica implementada. D4 confirmou importação para
> o banco e D5 definiu **AA** como versão inicial. Conferir edição/condições e
> demais pendências antes de aprovar a spec e este plano para execução.

**Spec relacionada:** ./spec.md
**Status:** rascunho — fonte, importação e AA definidas; conferir demais pontos da spec §9
antes de ser considerado aprovado para execução.

## 1. Impacto no schema (`packages/backend/schema.ts`)

```ts
bibleBooks: defineTable({
  version: v.string(),        // ex: "acf", "nvi" — chave de particionamento
  abbrev: v.string(),         // ex: "gn", "mt" — abreviação em português
  name: v.string(),           // "Gênesis"
  author: v.optional(v.string()),
  chapters: v.number(),
  group: v.optional(v.string()),   // "Pentateuco", "Evangelhos", etc.
  testament: v.union(v.literal("VT"), v.literal("NT")),
})
  .index("by_version", ["version"])
  .index("by_version_abbrev", ["version", "abbrev"]),

bibleVerses: defineTable({
  version: v.string(),
  abbrev: v.string(),
  chapter: v.number(),
  number: v.number(),
  text: v.string(),
})
  .index("by_version_abbrev_chapter", ["version", "abbrev", "chapter"])
  .index("by_version_abbrev_chapter_number", ["version", "abbrev", "chapter", "number"]),
```

Justificativa dos índices: toda leitura desta feature busca por
`(version, abbrev, chapter[, number])` — nunca por `_id` isolado — então os
índices compostos cobrem exatamente os padrões de acesso de §4 da spec (listagem
de capítulo e busca de versículo único).

## 2. Desenho do `BibleContentProvider`

Interface definida em `packages/backend/bibleContent/provider.ts` (TypeScript
puro, sem depender de nenhuma lib de rede específica):

```ts
interface BibleContentProvider {
  fetchBooks(version: string): Promise<BibleBookInput[]>;
  fetchVerses(version: string, abbrev: string): Promise<BibleVerseInput[]>;
}
```

A implementação prevista passa a ser `abibliaDigitalApiProvider.ts`, usando
`https://abibliadigital.api.br/api/`. Ver [contrato documentado e pendências](../../docs/engineering/bible-provider.md).
O provedor e a importação foram escolhidos; `syncVersion` deve começar somente
pela versão AA, com seu identificador verificado no catálogo. Não construir também um provider de dataset ou hospedar
uma cópia do serviço por antecipação.

Antes da execução, detalhar respostas validadas por Zod, importação por capítulos
em lotes, retomada após falha, timeout e limites de concorrência. Não presumir um
endpoint que devolva o livro inteiro nem disparar milhares de chamadas sem controle.

A escolha de provider é uma constante de configuração
(`packages/backend/bibleContent/config.ts`), não uma variável de ambiente lida em
runtime de leitura — reforça o requisito não-funcional de "import não bloqueia o
app em produção".

## 3. Funções Convex necessárias

| Função | Tipo | Descrição | Quem pode chamar |
|---|---|---|---|
| `bibleContent.syncVersion` | action (internal) | roda o provider configurado para uma `version`, faz upsert em `bibleBooks`/`bibleVerses` | apenas via script administrativo (Convex CLI `npx convex run`), nunca exposta como função pública chamável pelo client |
| `bibleContent.listBooks` | query | retorna os 66 livros para uma `version` | qualquer usuário autenticado |
| `bibleContent.getChapter` | query | retorna livro + capítulo + lista de versículos | qualquer usuário autenticado |
| `bibleContent.getVerse` | query | retorna um único versículo | qualquer usuário autenticado |
| `bibleContent.search` | query | busca por termo dentro de uma `version`, retorna lista de `{ abbrev, chapter, number, text }` | qualquer usuário autenticado |

### Contrato de `bibleContent.syncVersion`

```ts
// args
{ version: string }  // primeira versão aprovada: AA; validar identificador "aa"

// retorno
{
  version: string;
  booksImported: number;
  versesImported: number;
  startedAt: number;
  finishedAt: number;
}
```

- Implementado como `internalAction` do Convex (não `action` pública) — só
  invocável via `npx convex run bibleContent:syncVersion` ou de dentro de outra
  function interna, nunca por uma chamada vinda do client web/mobile. Isso
  implementa o requisito de permissão da spec §6 por construção, não por
  checagem condicional.
- Upsert: para cada livro/versículo, busca pelo índice composto
  (`by_version_abbrev` / `by_version_abbrev_chapter_number`) antes de inserir; se
  já existir, faz `patch` em vez de `insert` — garante a idempotência exigida na
  spec §4 item 2.

### Contrato de `bibleContent.search`

```ts
// args
{ version: string, query: string }  // query: mínimo 3 caracteres, validado via zod

// retorno
Array<{ abbrev: string; bookName: string; chapter: number; number: number; text: string }>
// limitado a 100 resultados por chamada — evitar retorno gigante em termos comuns
```

- Busca feita com `withSearchIndex` do Convex sobre o campo `text` de
  `bibleVerses` (requer declarar um search index adicional em `bibleVerses` no
  schema, não listado em §1 por ser um índice de busca full-text e não um índice
  padrão — adicionar em conjunto com a implementação desta função).

## 4. Regras de negócio → `packages/domain`

- `packages/domain/hooks/useBibleBooks.ts`, `useBibleChapter.ts`,
  `useBibleVerse.ts`, `useBibleSearch.ts` — encapsulam as queries acima.
- `packages/domain/bible/reference.ts` — função pura `formatReference(abbrev,
  chapter, number?)` retornando `"João 3:16"` ou `"João 3"`, usada por qualquer
  tela que precise citar um versículo/capítulo de forma consistente (Bíblia
  Online e, futuramente, o devocional diário se vier a linkar a Bíblia Online).
- Nenhuma nova regra de permissão além do que já existe — leitura é aberta a
  qualquer usuário autenticado, sem diferenciação de papel (spec §6).

## 5. Impacto em `apps/web`

- Área de Bíblia no marco local; posição na navegação e URL ainda a aprovar.
  Decomposição proposta de telas:
  `biblia/index.tsx` (lista de livros), `biblia/$abbrev.tsx` (lista de
  capítulos do livro), `biblia/$abbrev.$chapter.tsx` (leitura do capítulo),
  `biblia/busca.tsx` (campo de busca + resultados).
- Componentes: `BookList`, `ChapterList`, `VerseList`, `SearchResults`.
- A leitura web foi priorizada pelo usuário em 04/10/2026; sua execução depende
  da revisão aprovada desta spec, e não de uma futura priorização de Fé Madura.

## 6. Impacto em `apps/mobile`

- Telas equivalentes sob `apps/mobile/app/(tabs)/fe-madura/biblia/`, mesma
  divisão de responsabilidade do web (ver `docs/architecture.md §7` — sem
  componente compartilhado entre plataformas, só os hooks de domínio).
- Expo permanece adiado e sem workspace executável. Compartilhar contratos de
  domínio não comprova equivalência de UI, armazenamento ou comportamento offline.

## 7. Estimativa de capacidade (Convex free tier)

- Medir os bytes UTF-8 reais do dataset e os documentos/índices após importação
  de uma amostra em desenvolvimento. A estimativa anterior de 30–40 bytes por
  versículo não é confiável e foi retirada. Não inferir capacidade só pelo número
  de versículos. Projetar crescimento, busca, I/O e transferência antes de importar
  versões adicionais. Ver [cotas atuais](../../docs/operations/free-launch.md).

## 8. Riscos técnicos e decisões a validar

- **Licenciamento de dataset** (spec §9, pergunta 2) — bloqueador para importar
  qualquer versão, inclusive ACF, até confirmação.
- **Search index do Convex**: validar limites de `withSearchIndex` (tamanho de
  campo indexado, comportamento com texto em português/acentuação) com uma
  importação de teste pequena (ex: um único livro) antes de rodar a importação
  completa.
- **Qualidade e identificação da edição**: conferir referências, codificação,
  contagens e uma amostra de texto com a fonte editorial aprovada antes de
  considerar os dados como referência para `devotionals.scripture`.

## 9. Plano de testes

- `packages/domain`: teste de `formatReference` cobrindo referência de capítulo
  inteiro vs. versículo específico.
- `packages/backend`: teste de `syncVersion` rodado duas vezes seguidas contra um
  provider de teste (mock com 1-2 livros) confirmando que a segunda execução não
  duplica documentos (idempotência).
- Manual: importar 1 versão completa em ambiente de desenvolvimento, navegar por
  3-4 livros distintos no app web (mobile adiado) e conferir visualmente contra uma
  fonte impressa/confiável os mesmos versículos citados no risco de qualidade de
  dataset acima.

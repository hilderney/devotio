# Plano Técnico: Conteúdo Bíblico — Importação, Cache e Leitura

**Spec relacionada:** ./spec.md
**Status:** rascunho — depende das decisões da spec §9 (provider, licença, versões)
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

Duas implementações previstas (a segunda só é construída se a decisão da spec §9
optar por ela, ou como plano B futuro):

- `jsonDatasetProvider.ts` — lê os arquivos JSON de
  `thiagobodruk/bible`/`thiagobodruk/biblia` (baixados uma vez para
  `packages/backend/bibleContent/data/*.json` no repositório, **não** buscados em
  tempo de importação via rede — evita qualquer dependência de rede até para o
  processo de seed).
- `abibliaDigitalApiProvider.ts` — chama os endpoints REST documentados do
  projeto `omarciovsena/abibliadigital` (`/api/books`, `/api/verses/:version/:abbrev/:chapter`),
  mantido no código como opção, mas **não ativado por padrão** dado que a API
  oficial está fora do ar desde 01/08/2026 (ver spec §1). Só faz sentido ativar
  este provider contra uma instância confirmada no ar (self-host validado) — não
  assumir a URL oficial como disponível sem checar antes.

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
{ version: string }  // ex: "acf"

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

- Nova seção sob a rota `fe-madura/biblia/` (dentro da futura Aba Fé Madura, v2):
  `biblia/index.tsx` (lista de livros), `biblia/$abbrev.tsx` (lista de
  capítulos do livro), `biblia/$abbrev.$chapter.tsx` (leitura do capítulo),
  `biblia/busca.tsx` (campo de busca + resultados).
- Componentes: `BookList`, `ChapterList`, `VerseList`, `SearchResults`.
- Como esta spec cobre apenas a fundação de dados/leitura, a construção efetiva
  dessas rotas no app web só entra em tasks quando "Fé Madura v2" for priorizada
  — ver `tasks.md` para o que é entregável já e o que fica marcado como
  dependente dessa priorização.

## 6. Impacto em `apps/mobile`

- Telas equivalentes sob `apps/mobile/app/(tabs)/fe-madura/biblia/`, mesma
  divisão de responsabilidade do web (ver `docs/architecture.md §7` — sem
  componente compartilhado entre plataformas, só os hooks de domínio).
- Sem diferença de comportamento relevante entre web e mobile nesta feature —
  é leitura de texto, sem dependência de recursos nativos como áudio ou
  background.

## 7. Estimativa de capacidade (Convex free tier)

- Uma versão completa (~31.100 versículos + 66 livros) importada para
  `bibleVerses`/`bibleBooks`: estimativa de ~30-40 bytes de texto médio por
  versículo em português mais overhead de documento do Convex — ordem de
  grandeza de poucos MB por versão importada, folgado dentro do limite de 0.5GB
  do plano gratuito mesmo com 2-3 versões. Ainda assim, medir o tamanho real após
  a primeira importação de teste antes de decidir importar mais de uma versão
  (spec §9, pergunta 1).

## 8. Riscos técnicos e decisões a validar

- **Licenciamento de dataset** (spec §9, pergunta 2) — bloqueador para importar
  qualquer versão além de ACF até confirmação.
- **Search index do Convex**: validar limites de `withSearchIndex` (tamanho de
  campo indexado, comportamento com texto em português/acentuação) com uma
  importação de teste pequena (ex: um único livro) antes de rodar a importação
  completa.
- **Qualidade do dataset de terceiro**: os arquivos de `thiagobodruk/bible` foram
  gerados por um crawler e o próprio autor documenta que "podem conter pequenos
  problemas de encoding/sintaxe" — validar uma amostra manualmente (ex: comparar
  10 versículos conhecidos com uma Bíblia impressa/fonte confiável) antes de
  considerar a importação como fonte de verdade para `devotionals.scripture`.

## 9. Plano de testes

- `packages/domain`: teste de `formatReference` cobrindo referência de capítulo
  inteiro vs. versículo específico.
- `packages/backend`: teste de `syncVersion` rodado duas vezes seguidas contra um
  provider de teste (mock com 1-2 livros) confirmando que a segunda execução não
  duplica documentos (idempotência).
- Manual: importar 1 versão completa em ambiente de desenvolvimento, navegar por
  3-4 livros distintos no app (web e mobile) e conferir visualmente contra uma
  fonte impressa/confiável os mesmos versículos citados no risco de qualidade de
  dataset acima.

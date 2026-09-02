# AGENTS.md — Configuração de Desenvolvimento Agêntico

> Este arquivo é lido por qualquer agente de IA (Claude Code, Cursor, etc.) antes de
> tocar em código neste repositório. Ele define **como trabalhar**, não **o que construir**
> — isso vive em `/specs`. Overrides específicos de plataforma estão em
> `apps/web/AGENTS.md` e `apps/mobile/AGENTS.md`.

## 0. Antes de qualquer coisa

1. Leia `docs/constitution.md`. Os princípios ali são inegociáveis.
2. Toda feature nova começa em `/specs/NNN-nome-da-feature/spec.md`, **nunca** direto no
   código. Se não existe spec para o que você está prestes a construir, pare e crie a
   spec primeiro (use `specs/_templates/spec-template.md`).
3. Nunca escreva lógica de negócio dentro de `apps/web` ou `apps/mobile`. Se você se
   pegar escrevendo uma regra de permissão, validação ou cálculo dentro de um app,
   ela pertence a `packages/domain` ou `packages/backend`.

## 1. Estrutura do monorepo

```
devocional-app/
├── docs/                    # constituição, arquitetura, ADRs
├── specs/                   # spec-driven development (uma pasta por feature)
├── packages/
│   ├── backend/             # Convex: schema, queries, mutations, actions, cron
│   ├── domain/              # TS puro: tipos, validação (zod), regras de permissão,
│   │                        # hooks reativos (re-export de convex/react) — SEM UI
│   └── ui-kit/              # design tokens (cores, spacing, tipografia, raio)
│                            # consumidos por Tailwind (web) e NativeWind (mobile)
├── apps/
│   ├── web/                 # TanStack Start (React 19 + Vite) + shadcn/ui
│   └── mobile/              # Expo (React Native) + NativeWind
├── turbo.json
└── package.json
```

**Regra de ouro:** `packages/backend` e `packages/domain` são a única fonte de verdade.
`apps/web` e `apps/mobile` são cascas de apresentação finas — roteamento, layout,
gestos e chamadas aos hooks do `domain`. Se uma regra precisa existir nos dois apps,
ela está no lugar errado.

## 2. Fluxo de trabalho (Spec → Plan → Tasks → Code)

Para cada feature:

1. **`spec.md`** — o quê e por quê (sem tecnologia). Escrito/aprovado antes do plano.
2. **`plan.md`** — como, tecnicamente: schema Convex necessário, funções, impacto em
   web e mobile, decisões de UI por plataforma.
3. **`tasks.md`** — checklist executável, dividido em `backend/domain`, `web`, `mobile`,
   `cross-cutting`. Cada task deve ser pequena o suficiente pra um agente completar
   e verificar sozinha.
4. **Código** — só começa depois que `spec.md` e `plan.md` existem e fazem sentido.

Um agente que recebe "implemente a feature X" e não encontra `specs/XXX-x/spec.md`
deve **gerar a spec primeiro**, mostrar pro humano, e só then seguir para plan/tasks/code.

## 3. Comandos (Turborepo)

```bash
pnpm install                       # instala tudo no monorepo
pnpm dev --filter=web              # roda apenas o app web
pnpm dev --filter=mobile           # roda apenas o Expo (mobile)
pnpm dev                           # roda web + convex dev em paralelo
pnpm convex dev                    # backend Convex em modo watch
pnpm --filter=domain test          # testes de regras de negócio (o mais importante)
pnpm lint && pnpm typecheck        # antes de qualquer commit
```

## 4. Convenções de código

- **TypeScript estrito** em todo o repositório. `any` é proibido sem comentário
  justificando.
- **Validação de entrada sempre com zod**, definida uma única vez em
  `packages/domain/validators` e reusada nas mutations do Convex e nos forms dos apps.
- **Permissões nunca no client.** Toda checagem de papel (AG/AC/membro) é feita dentro
  da function do Convex (`packages/backend`), usando helpers de
  `packages/domain/permissions.ts`. O client só *esconde* UI que o usuário não pode
  usar — ele nunca é a barreira de segurança.
- **Nomenclatura em português para conteúdo de domínio** (ex: `devotionals.scripture`,
  mensagens de erro voltadas ao usuário), **inglês para código de infraestrutura**
  (nomes de função, variáveis técnicas). Não misture os dois no mesmo identificador.
- **Sem dependências pesadas de UI dentro de `packages/domain`.** Esse pacote não
  importa React DOM nem React Native — só `react` (para hooks) e `convex/react` puro,
  para poder ser consumido pelos dois apps sem conflito de bundler.

## 5. O que um agente NUNCA deve fazer neste projeto

- Adicionar gamificação, streaks, ranking ou qualquer mecanismo de engajamento
  comportamental não pedido na spec — viola o princípio de "reverência sobre
  engajamento" da constituição.
- Tornar um comentário de `bibleMarkings` visível além do escopo definido em
  `visibility` sem uma spec explícita autorizando.
- Criar tabela nova no schema do Convex sem atualizar `packages/backend/schema.ts`
  E documentar a decisão em `docs/architecture.md § Modelo de Dados`.
- Duplicar uma regra de negócio em `apps/web` e `apps/mobile` "pra ir mais rápido".
  Sempre subir a regra para `packages/domain` primeiro.

## 6. Definição de pronto (Definition of Done)

Uma task só é considerada concluída quando:

- [ ] Typecheck e lint passam no monorepo inteiro.
- [ ] Regra de negócio nova tem teste em `packages/domain`.
- [ ] Funciona igual (ou com a diferença documentada) em web e mobile.
- [ ] Nenhuma checagem de permissão foi feita só no client.
- [ ] `tasks.md` da feature foi atualizado marcando o item concluído.

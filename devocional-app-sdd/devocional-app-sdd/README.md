# Devocional App — Spec-Driven Development

Este repositório usa **Spec-Driven Development (SDD)**: nenhuma feature é
codificada sem antes existir como `spec.md` → `plan.md` → `tasks.md` em `/specs`.

## Por onde começar

1. **`AGENTS.md`** — regras que qualquer agente de IA (ou dev humano) segue para
   trabalhar neste repo.
2. **`docs/constitution.md`** — princípios de produto inegociáveis.
3. **`docs/architecture.md`** — como o núcleo agnóstico (Convex + domain) se
   relaciona com as duas cascas de plataforma (web/TanStack Start e
   mobile/Expo), e o que é compartilhado vs. específico.
4. **`specs/`** — uma pasta por feature. `001-devocional-diario` e
   `002-comunidade-v1` são o MVP e servem de referência de qualidade para as
   próximas specs (`_templates/` tem os modelos em branco).

## Estrutura

```
├── AGENTS.md                 # regras gerais de desenvolvimento agêntico
├── docs/
│   ├── constitution.md       # princípios de produto
│   └── architecture.md       # arquitetura agnóstica vs. específica de plataforma
├── specs/
│   ├── _templates/           # spec/plan/tasks em branco
│   ├── 001-devocional-diario/
│   └── 002-comunidade-v1/
├── packages/
│   ├── backend/               # Convex — schema, queries, mutations, cron
│   ├── domain/                 # regras de negócio, permissões, hooks — TS puro
│   └── ui-kit/                 # design tokens compartilhados
└── apps/
    ├── web/                    # TanStack Start + Tailwind/shadcn (+ AGENTS.md próprio)
    └── mobile/                 # Expo + NativeWind (+ AGENTS.md próprio)
```

## Escopo do MVP (v1)

Aba Devocional (completa) + Aba Comunidade (funções base do AG). Clubes e Fé
Madura ficam para v2/v3 — ver `docs/constitution.md §VIII`.

## Próximos passos sugeridos

- Validar o risco técnico de Better Auth em Expo antes de iniciar `apps/mobile`
  (`docs/architecture.md §5`).
- Criar a spec `003-` para o fluxo editorial de publicação de devocionais (hoje
  fora de escopo em `001-devocional-diario §7`).
- Quando Clubes entrar em pauta, escrever `specs/00X-clubes-v2/spec.md` usando o
  template — não implementar nada de Clubes dentro de tasks do MVP.

# Plano Técnico: [Nome da Feature]

**Spec relacionada:** ./spec.md
**Status:** rascunho | aprovado | em execução

## 1. Impacto no schema (`packages/backend/schema.ts`)

- Tabelas novas / campos novos / índices novos, com justificativa de cada índice.

## 2. Funções Convex necessárias

| Função | Tipo | Descrição | Quem pode chamar |
|---|---|---|---|
| | query/mutation/action | | |

## 3. Regras de negócio → `packages/domain`

Lista de validators, permission-checkers e hooks novos ou alterados. Referenciar a
seção 6 da spec (visibilidade/permissão) linha a linha.

## 4. Impacto em `apps/web`

Rotas/telas afetadas, componentes novos, dependências de UI (shadcn) necessárias.

## 5. Impacto em `apps/mobile`

Telas afetadas, componentes novos, dependências específicas (ex: expo-audio,
expo-notifications), e qualquer diferença de comportamento vs. web que a spec não
previu — se houver diferença, ela precisa ser justificada aqui, não silenciosa.

## 6. Riscos técnicos e decisões a validar

Referenciar `docs/architecture.md §5` se aplicável, ou registrar risco novo.

## 7. Plano de testes

- Testes de `packages/domain` (obrigatório para toda regra de permissão/validação).
- Casos manuais críticos em web e mobile antes de considerar concluído.

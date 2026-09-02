# AGENTS.md — apps/web

> Estende `/AGENTS.md` e `/docs/architecture.md`. Leia os dois primeiro.

## Stack

TanStack Start (React 19 + Vite, SSR) + Tailwind CSS + shadcn/ui.

## Regras específicas deste app

- Nenhum componente aqui contém lógica de negócio ou permissão — ele só chama hooks
  de `packages/domain` e renderiza o resultado. Se você precisa de um `if` de
  permissão para decidir *o que renderizar*, tudo bem; se precisa dele para decidir
  *o que é permitido fazer*, a checagem real já deveria estar na mutation do
  Convex.
- Componentes shadcn/ui são copiados para o repo (não é uma lib instalada) — ao
  adicionar um novo, use `npx shadcn add [componente]` a partir de `apps/web`, não
  copie manualmente de outro projeto.
- SSR: nenhuma chamada a `window`, `localStorage` ou APIs de browser fora de um
  efeito client-side (`useEffect` ou equivalente do TanStack Start) — vai quebrar o
  render no servidor.
- Áudio: usar `<audio>` HTML5 nativo. Não introduzir uma lib de player só para o
  devocional diário — é um caso simples e a constituição pede minimalismo também no
  código.
- Tokens de design vêm de `packages/ui-kit/tokens.ts` e são mapeados em
  `tailwind.config.ts` — não hardcode cor/spacing direto em className com valores
  arbitrários (`text-[#123456]`) sem antes checar se o token já existe.

## Comandos

```bash
pnpm --filter=web dev
pnpm --filter=web build
pnpm --filter=web typecheck
```

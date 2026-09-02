# AGENTS.md — apps/mobile

> Estende `/AGENTS.md` e `/docs/architecture.md`. Leia os dois primeiro.

## Stack

Expo (React Native) + Expo Router + NativeWind.

## Regras específicas deste app

- Mesma regra de ouro do web: nenhuma lógica de negócio ou permissão aqui. Hooks
  vêm de `packages/domain`, que já funciona com `convex/react` neste runtime — não
  reimplementar queries direto no componente.
- Áudio: `expo-audio` (ou `expo-av` caso o projeto ainda dependa dele), sempre com
  `app.json` configurado para `UIBackgroundModes: ["audio"]` no iOS. Testar
  play/pause/lockscreen em device físico antes de marcar qualquer task de áudio
  como concluída — simulador não reflete o comportamento de background real.
- Sessão de autenticação: token armazenado via `expo-secure-store`, nunca em
  `AsyncStorage` puro (dado sensível). Ver risco técnico documentado em
  `docs/architecture.md §5` sobre maturidade do Better Auth em Expo — validar
  antes de implementar o fluxo de login aqui.
- NativeWind consome os mesmos tokens de `packages/ui-kit/tokens.ts` via preset —
  não duplicar valores de cor/espaçamento manualmente no `tailwind.config` deste
  app.
- Antes de submeter build para revisão de loja (App Store/Play Store), confirmar
  que nenhuma feature de v2/v3 (Clubes, Fé Madura) está acessível na UI — o ciclo
  de revisão de loja é mais lento que o deploy do backend, então feature flags são
  preferíveis a remover código depois.

## Comandos

```bash
pnpm --filter=mobile dev          # abre o Expo Dev Client / Metro
pnpm --filter=mobile ios          # simulador iOS
pnpm --filter=mobile android      # emulador Android
pnpm --filter=mobile typecheck
```

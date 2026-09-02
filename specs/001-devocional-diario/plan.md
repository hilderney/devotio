# Plano Técnico: Devocional Diário

**Spec relacionada:** ./spec.md
**Status:** aprovado

## 1. Impacto no schema (`packages/backend/schema.ts`)

Nenhuma alteração — `globalSettings` e `devotionals` (com índice `by_date`) já
cobrem os requisitos.

## 2. Funções Convex necessárias

| Função | Tipo | Descrição | Quem pode chamar |
|---|---|---|---|
| `globalSettings.get` | query | retorna o singleton (monthlyVerse, weeklyVerse) | qualquer usuário autenticado |
| `devotionals.getByDate` | query | recebe `date: string (YYYY-MM-DD)`, retorna o devocional ou `null` | qualquer usuário autenticado |

Resolve a pergunta em aberto da spec: `date` é **parâmetro obrigatório** calculado
no client a partir do timezone local do dispositivo (`Intl.DateTimeFormat` no web,
equivalente no Expo), nunca calculado no servidor — evita o devocional trocar no
meio da noite local de usuários fora do timezone do servidor.

## 3. Regras de negócio → `packages/domain`

- `packages/domain/hooks/useMonthlyAndWeeklyVerse.ts` — encapsula
  `useQuery(api.globalSettings.get)`.
- `packages/domain/hooks/useDailyDevotional.ts` — encapsula
  `useQuery(api.devotionals.getByDate, { date: todayLocalISODate() })`, expõe
  `{ data, isLoading, isEmpty }`.
- `packages/domain/date/todayLocalISODate.ts` — util pura, sem dependência de
  plataforma (usa `Date` nativo do JS), retorna `YYYY-MM-DD` do dispositivo.
- Nenhuma regra de permissão nova — leitura é aberta a qualquer usuário autenticado.

## 4. Impacto em `apps/web`

- Rota `apps/web/routes/devocional.tsx` (ou `index.tsx` se for a tela inicial).
- Componentes: `MonthlyVerseBanner`, `WeeklyVerseBanner`, `DevotionalScripture`,
  `DevotionalReflection`, `PrayerSuggestionCard`, `AudioPlayerWeb` (`<audio>` nativo
  do HTML, streaming direto da URL do R2).
- Estado vazio: componente `EmptyDevotionalState` compartilhando o mesmo texto do
  mobile (string vive em `packages/domain`, não duplicar a mensagem).

## 5. Impacto em `apps/mobile`

- Tela `apps/mobile/app/(tabs)/index.tsx`.
- Mesmos componentes de conteúdo (podem até ter o mesmo nome, mas são implementações
  React Native separadas — ver `architecture.md §7`, não compartilhar componente
  renderizado).
- `AudioPlayerMobile` usando `expo-audio`, com `app.json` configurado para
  `UIBackgroundModes: ["audio"]` no iOS e integração com
  `expo-notifications`/media controls para exibir controle na lockscreen.

## 6. Riscos técnicos e decisões a validar

- Background audio no iOS (`docs/architecture.md §5`) — validar em device físico
  antes de considerar a task de mobile concluída, simulador não é confiável para
  isso.
- Tamanho dos arquivos de áudio no R2: garantir que o bitrate escolhido mantenha o
  app dentro do free tier de egresso (R2 tem egresso gratuito, então o risco real é
  apenas storage — 10GB no free tier, monitorar conforme o catálogo de devocionais
  cresce).

## 7. Plano de testes

- `packages/domain`: teste de `todayLocalISODate()` cobrindo virada de dia em pelo
  menos dois timezones diferentes (ex: UTC-3 e UTC+9).
- `packages/domain`: teste de `useDailyDevotional` retornando `isEmpty: true`
  quando a query resolve `null`.
- Manual: abrir o app pouco antes e pouco depois da meia-noite local e confirmar
  que o devocional não troca durante o dia (só na virada correta).
- Manual: tocar áudio no mobile, minimizar o app, confirmar que o áudio continua e
  os controles aparecem na lockscreen.

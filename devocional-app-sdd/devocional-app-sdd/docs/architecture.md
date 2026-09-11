# Arquitetura — Núcleo Agnóstico + Cascas de Plataforma

## 1. Visão geral

```
                         ┌─────────────────────────────┐
                         │        packages/backend       │
                         │  (Convex: schema, queries,    │
                         │  mutations, actions, cron)    │
                         │  100% agnóstico — roda no      │
                         │  edge, nunca no device         │
                         └───────────────┬───────────────┘
                                         │ convex/react (web) e
                                         │ convex/react (RN funciona igual)
                         ┌───────────────┴───────────────┐
                         │        packages/domain         │
                         │  tipos, zod validators,        │
                         │  regras de permissão AG/AC,     │
                         │  hooks reativos (useDevotional, │
                         │  useCommunity...) — TS puro     │
                         │  100% agnóstico                 │
                         └───────┬───────────────┬─────────┘
                                 │               │
                 ┌───────────────┘               └───────────────┐
                 │                                                │
        ┌────────┴────────┐                              ┌────────┴────────┐
        │    apps/web      │                              │   apps/mobile    │
        │ TanStack Start   │                              │      Expo        │
        │ Tailwind+shadcn  │                              │    NativeWind    │
        │ Player HTML5     │                              │  expo-audio      │
        │ TanStack Router  │                              │  Expo Router      │
        └──────────────────┘                              └──────────────────┘
```

O princípio é simples: **quanto mais perto do "o que o app faz", mais agnóstico;
quanto mais perto do "como o dedo/mouse interage", mais específico**.

## 2. O que é 100% compartilhado

| Camada | Onde vive | Por quê pode ser 100% igual |
|---|---|---|
| Schema de dados | `packages/backend/schema.ts` | Convex é o backend único; não existe "schema do mobile" |
| Regras de negócio / permissões (AG, AC, membro) | `packages/domain/permissions.ts` | Regra de quem vê o quê não muda por dispositivo |
| Validação de input (zod) | `packages/domain/validators/*.ts` | Mesma validação usada nas mutations do Convex e nos forms de ambos os apps |
| Hooks de dados reativos (`useDailyDevotional`, `useCommunityFeed`, `useChecklist`) | `packages/domain/hooks/*.ts` | `convex/react` e `convex/react-native` expõem a mesma API de hooks (`useQuery`, `useMutation`); o hook de domínio só encapsula a query, então funciona nos dois runtimes sem alteração |
| Design tokens (cor, espaçamento, tipografia, raio) | `packages/ui-kit/tokens.ts` | Definidos uma vez em TS/JSON puro; consumidos pelo `tailwind.config` do web e por um preset do NativeWind no mobile |
| Autenticação — modelo de sessão e regras de acesso | `packages/backend` (Better Auth core + `convex-gate`) | A lógica de "quem está logado, qual o papel" é backend, não depende de plataforma |

## 3. O que é necessariamente específico — e por quê

| Preocupação | Web | Mobile | Motivo da divergência |
|---|---|---|---|
| Roteamento | TanStack Router (file-based, SSR) | Expo Router (file-based, nativo) | APIs de navegação nativa (gestos, stack nativo) não existem no browser |
| Renderização de áudio | `<audio>` HTML5 + streaming direto do R2 | `expo-audio` (ou `expo-av`) com controle de background/lockscreen | Mobile precisa tocar em segundo plano e integrar com os controles de mídia do sistema operacional — não existe equivalente web |
| Estilização | Tailwind CSS + shadcn/ui (componentes DOM) | NativeWind (Tailwind-like sobre RN) + componentes nativos | shadcn/ui é baseado em Radix/DOM, não roda em React Native |
| Armazenamento local/offline | Cache do browser (leve, opcional) | SQLite/AsyncStorage para leitura offline do devocional do dia (recomendado para v1.1) | Mobile tem expectativa de funcionar em conexão instável; web pode assumir conexão presente |
| Notificações | Web Push (opcional, v2) | Push nativo via Expo Notifications (recomendado desde v1 para "Mural do AG") | Mecanismos de entrega totalmente diferentes na origem |
| Sessão de auth no client | Cookie de sessão (Better Auth padrão web) | Token seguro em `expo-secure-store` | Mobile não tem cookie de browser; **ver risco técnico na seção 5** |
| Distribuição | Deploy contínuo (Vercel/Cloudflare Pages) | Build + submissão a App Store/Play Store (ciclo de revisão) | Isso muda o *cadence* de release: mobile precisa de feature flags para desacoplar deploy de backend de liberação de UI |

## 4. Fluxo de dados (exemplo: Devocional Diário)

1. `packages/backend/devotionals.ts` expõe `getByDate(date)` (query) e
   `markAudioPlayed` (mutation, se você quiser telemetria simples no futuro).
2. `packages/domain/hooks/useDailyDevotional.ts` encapsula
   `useQuery(api.devotionals.getByDate, { date: today() })` e devolve um objeto
   tipado (`{ scripture, reflection, audioUrl, prayerSuggestion, isLoading }`).
3. `apps/web/routes/devocional.tsx` chama `useDailyDevotional()` e renderiza com
   `<audio src={audioUrl} />` dentro do layout TanStack Start.
4. `apps/mobile/app/(tabs)/devocional.tsx` chama o **mesmo** `useDailyDevotional()`
   e renderiza com um componente `<AudioPlayer />` baseado em `expo-audio`.

Zero lógica duplicada — a única coisa que muda é o componente de apresentação do
áudio.

## 5. Riscos técnicos a validar antes de codar (registrar como ADR quando resolvidos)

- **Better Auth em React Native/Expo**: a integração web (cookie + `convex-gate`) é
  madura; o suporte a Expo é uma área que muda rápido no ecossistema Better Auth.
  Antes de iniciar `apps/mobile`, validar a versão atual da documentação oficial do
  Better Auth para Expo/React Native e do Convex Auth como alternativa nativa, caso
  o suporte não esteja maduro o suficiente. Isso é uma decisão de `plan.md`, não da
  spec de produto.
- **Streaming de áudio do R2 em background no iOS**: exige configuração de
  `UIBackgroundModes: audio` no `app.json` do Expo — tratar como task explícita em
  `apps/mobile`, não assumir que "funciona igual ao web".
- **Convex file storage vs R2 direto**: o schema já referencia `audioUrl` como
  string (URL), o que é compatível com servir os áudios diretamente do Cloudflare
  R2 (bucket público ou signed URL) sem passar pelo file storage do Convex — mantém
  o uso dentro do free tier de ambos os serviços.

## 6. Convenção de pastas dentro de `packages/domain`

```
packages/domain/
├── validators/       # zod schemas (fonte única de validação)
├── permissions/       # canUserSeeComment(), isAdminOf(), etc.
├── hooks/             # useDailyDevotional, useCommunity, useChecklist...
└── types/             # tipos derivados do schema Convex (Doc<"devotionals"> etc.)
```

## 7. O que NÃO agnosticizar (armadilha comum)

Não tente forçar componentes de UI compartilhados via React Native Web ou similar
neste projeto. O princípio de minimalismo (constituição §I) e a diferença de
affordances entre toque e mouse tornam mais barato manter duas implementações de UI
finas do que manter uma camada de abstração de componente cross-platform. O que se
compartilha são **tokens de design**, não **componentes renderizados**.

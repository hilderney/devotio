# Stack do piloto

**Atualização: 03/10/2026.** Implementação local; [estado e pendências](status.md).

| Camada | Escolha | Situação |
|---|---|---|
| Linguagem | TypeScript estrito | Typecheck nos quatro workspaces |
| Monorepo | npm 11.6.2 + Turborepo | Lockfile único; Node 24.19.0 |
| Web | React 19 + Vite 6, SPA | Sem SSR; build estático |
| Rotas | TanStack Router | Rotas de leitura, comunidade, acesso e ajuda |
| Visual | Tailwind 3, CSS e tokens ui-kit | DOM semântico, dialogs nativos, Lucide |
| Fontes | Lora + Inter via Fontsource | Locais; licenças OFL em public/licenses |
| PWA | vite-plugin-pwa + Workbox | Shell estático; conteúdo privado exige rede |
| Backend | Convex 1.45 | Builders oficiais, schema e transações; deployment pendente |
| Autenticação | Better Auth ~1.6.15 + integração Convex 0.12 | Google único; credenciais e OAuth real pendentes |
| Validação | Zod 3 em domain/core | Forms e servidor compartilham contratos |
| Client de dados | domain/react + domain/convex | Subscriptions oficiais, sem cache adicional |
| Áudio | HTMLAudioElement, URL HTTPS opcional | Sem autoplay; preload none; hospedagem autorizada a definir |
| Qualidade | ESLint 9, TypeScript, Vitest 3 + convex-test | Regras e autorização verificadas localmente |
| Hosting previsto | Cloudflare Pages Free | _redirects e _headers prontos; sem deploy efetuado |
| Nativo futuro | Expo + NativeWind | Sem workspace executável nesta etapa |

O package-lock.json fixa as resoluções. Better Auth permanece na faixa compatível com @convex-dev/better-auth. A integração usa CORS, trustedOrigins, crossDomain e provider oficial. [Guia React/Vite](https://labs.convex.dev/better-auth/framework-guides/react).

Sem backend paralelo, ORM, API bíblica na leitura, e-mail transacional, push, analytics ou geração editorial automática. O orçamento depende de acompanhar [cotas e limites gratuitos](../operations/free-launch.md).

Expo deverá validar versões e sessão própria quando priorizado; não há equivalência nativa já entregue.

# AGENTS.md — apps/web

Estende [regras gerais](../../AGENTS.md) e [arquitetura](../../docs/architecture.md).

React 19 + Vite SPA + TanStack Router + Tailwind 3. Sem SSR. PWA guarda somente shell estático; dados autenticados exigem rede.

- Componentes consomem domain/react; contratos e validações vêm de domain/core. Regras e autorização continuam no núcleo.
- Seguir [UI/UX](../../docs/design/experience.md) e tokens de ui-kit.
- Preferir HTML semântico e componentes locais.
- Áudio HTML5 sem autoplay; preload none.
- Prévia somente importada sob import.meta.env.DEV. Nunca expor fixtures no build público.
- APIs de navegador ficam em apps/web, nunca no núcleo puro.
- Auth real exige credenciais e verificação em homologação; não introduzir bypass.
- Executar lint, typecheck, testes e build na raiz após mudanças pertinentes.

Comandos: npm run dev --workspace=web, npm run build --workspace=web, npm run typecheck --workspace=web, npm run lint --workspace=web e npm run preview --workspace=web.

Consulte o [estado real](../../docs/engineering/status.md) antes de declarar prontidão.

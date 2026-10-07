# AGENTS.md — apps/web

Estende [regras gerais](../../AGENTS.md) e [arquitetura](../../docs/architecture.md).

React 19 + Vite SPA + TanStack Router + Tailwind 3. Sem SSR. Service worker guarda somente shell estático; cache de leitura local abaixo é separado.

Exceção de desenvolvimento autorizada em 04/10/2026: [spec 006](../../specs/006-desenvolvimento-local/spec.md)
usa SQLite em backend/local e login mockado somente no Vite DEV sem Convex.
Revisão autorizada em 05/10/2026: oito devocionais, favoritos e seis capítulos LRU
persistem por conta no navegador; limpeza no logout/troca/expiração, não na recarga.
Sem polling HTTP. Relógio local e eventos de identidade não são consultas de rede.
Isso não autoriza bypass de Google/Convex em produção nem cache privado no service worker.

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

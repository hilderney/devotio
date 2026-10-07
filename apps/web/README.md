# Devotio — Web

React 19 + Vite, TanStack Router e Tailwind 3. Interface em português, fontes locais Lora/Inter e tokens compartilhados.

Na raiz: npm ci, npm run setup:local e npm run dev. Abra http://127.0.0.1:3000.

Sem configuração, desenvolvimento usa login mockado e SQLite persistente;
produção mostra acesso indisponível. Veja [perfis e banco local](../../docs/engineering/local-development.md).
Configure Convex/Google somente para homologação separada, conforme o [guia](../../docs/engineering/development.md).

## Estrutura

- src/main.tsx: entrada, providers e seleção de ambiente.
- src/router.tsx: rotas públicas, layout de leitura e shell responsivo.
- src/redirect.tsx: transições com destino estável, sem redirecionamento repetido.
- src/pages: devocional/favoritos, Bíblia, comunidade, editorial local, acesso, ajuda e privacidade.
- src/components.tsx: apresentação e áudio HTML5.
- src/pwa.tsx: atualização opcional.
- public: ícones, licenças e fallback para Pages.
- vite.config.ts: build, servidor e PWA sem cache privado.

Build: npm run build. Preview: npm run preview --workspace=web.

Testes integrados: `npm run test --workspace=web`. Exercitam entrada, sessão,
login/logout e navegação com React StrictMode/jsdom. A suíte completa na raiz
(`npm run test`) também executa os testes de domínio e backend.

Referências: [UI/UX](../../docs/design/experience.md), [stack](../../docs/engineering/stack.md), [status](../../docs/engineering/status.md), [regras web](AGENTS.md). OAuth e instalação real ainda exigem homologação.

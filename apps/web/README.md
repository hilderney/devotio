# Devotio — Web

React 19 + Vite, TanStack Router e Tailwind 3. Interface em português, fontes locais Lora/Inter e tokens compartilhados.

Na raiz: npm ci e npm run dev --workspace=web. Abra http://127.0.0.1:3000.

Sem configuração, desenvolvimento abre uma prévia efêmera; produção mostra acesso indisponível. Configure Convex/Google conforme o [guia](../../docs/engineering/development.md).

## Estrutura

- src/main.tsx: entrada, providers e seleção de ambiente.
- src/router.tsx: rotas reais e shell responsivo.
- src/pages: devocional, comunidade, acesso, ajuda e privacidade.
- src/components.tsx: apresentação e áudio HTML5.
- src/pwa.tsx: atualização opcional.
- public: ícones, licenças e fallback para Pages.
- vite.config.ts: build, servidor e PWA sem cache privado.

Build: npm run build. Preview: npm run preview --workspace=web.

Referências: [UI/UX](../../docs/design/experience.md), [stack](../../docs/engineering/stack.md), [status](../../docs/engineering/status.md), [regras web](AGENTS.md). OAuth e instalação real ainda exigem homologação.

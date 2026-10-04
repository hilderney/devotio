# Desenvolvimento e verificação

Leia [AGENTS.md](../../AGENTS.md), [constituição](../constitution.md) e a spec antes de alterar código.

## Executar

Node **24.19.0** em .node-version e npm **11.6.2**. Na raiz:

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:3000. Sem configuração Convex, desenvolvimento abre uma **prévia local** com dados ilustrativos em memória. Recarregar descarta alterações. Criar comunidade permite experimentar a liderança; a comunidade inicial representa um membro. Código ilustrativo: ESPERANC.

Em produção, a prévia é eliminada do bundle. Sem configuração, o acesso fica indisponível.

| Comando na raiz | Finalidade |
|---|---|
| npm run dev | Web em 127.0.0.1:3000 |
| npm run dev --workspace=backend | Convex dev; requer conta e projeto |
| npm run build | Domain/ui-kit e web/PWA; não implanta Convex |
| npm run verify:web | Build e inspeção de PWA, licenças, ícones e exclusão de fixtures |
| npm run lint | ESLint real nos quatro workspaces |
| npm run typecheck | TypeScript estrito nos quatro workspaces |
| npm run test | Testes domain e backend |
| npm run preview --workspace=web | Build de produção na porta 4173 |

Nesta máquina, npm foi disponibilizado em .tools/bin usando o runtime Node do ambiente. Essa pasta é ignorada e não é requisito em outras máquinas.

## Configurar ambiente real

1. Criar/selecionar Convex de desenvolvimento conforme o [guia oficial React](https://labs.convex.dev/better-auth/framework-guides/react). convex.json aponta para packages/backend.
2. No Convex, configurar SITE_URL (origem exata da web), BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET. CONVEX_SITE_URL é fornecida pelo deployment.
3. No Google, cadastrar callback https://SEU-DEPLOYMENT.convex.site/api/auth/callback/google e a origem web.
4. Copiar apps/web/.env.example para apps/web/.env.local e preencher VITE_CONVEX_URL (.convex.cloud) e VITE_CONVEX_SITE_URL (.convex.site). Nenhum segredo usa prefixo VITE.
5. Rodar backend e web em terminais separados. Não importar fixtures no banco real.
6. Verificar login/logout e duas sessões em grupos distintos antes de publicar.

Os dois endereços públicos precisam ser HTTPS e pertencer ao mesmo deployment
Convex hospedado (.convex.cloud/.convex.site). Configuração parcial ou inválida
mostra acesso indisponível; em DEV também há diagnóstico no console. Para usar a
prévia, deixe ambos sem valor. A configuração atual não cobre Convex self-hosted.
Turbo repassa essas duas variáveis ao build e as inclui na chave de cache;
arquivos .env do workspace também participam dessa chave. Alterar os endereços
exige um novo build da web.

Para homologar retorno, abra um link de comunidade com a sessão encerrada: após
login, ele deve retornar à mesma comunidade. Cancele o consentimento Google para
conferir o aviso e tentar novamente. Verifique expiração de sessão e logout em
duas contas distintas. Parâmetros externos de retorno são descartados.

server.ts usa builders oficiais tipados, sem stub em _generated. A primeira configuração pode gerar artefatos oficiais Convex; não editá-los manualmente.

## Editorial

Executar editorial:publish pelo painel autenticado ou CLI autorizado do Convex. Exige date YYYY-MM-DD, reference, translation, scripture, reflection, prayerSuggestion, credit, licenseEvidence, reviewedBy, reason e publishedAt (epoch em milissegundos). audioUrl HTTPS é opcional.

A mesma data corrige o registro existente e gera novo evento de auditoria. Retirada: editorial:withdraw com id, actor e reason. Temas: editorial:setThemes. São funções internas, inacessíveis ao usuário comum da SPA. Preencher reviewedBy não substitui a revisão humana.

## Organização

- domain/core: tipos, regras e Zod; subpath evita colisão com o módulo nativo Node domain.
- domain/react: provider e hooks sem DOM.
- domain/convex: subscriptions/mutations reais.
- domain/preview: adaptador efêmero exclusivo de DEV.
- apps/web/src: apresentação, rotas e APIs do navegador.
- packages/backend: identidade, autorização, schema, transações e editorial.

Expo adiado. Ver [status](status.md) e [release](../operations/release.md).

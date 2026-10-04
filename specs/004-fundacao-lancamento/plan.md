# Plano técnico — nova aplicação web

**Spec:** [spec.md](spec.md). **Status:** em execução, autorizado em 02/10/2026.

## 1. Reconstrução e fronteiras

Reconstruir a apresentação em apps/web/src com React/Vite, TanStack Router,
Tailwind e CSS orientado pelos tokens. Retirar o código legado das áreas ativas,
preservando-o no histórico Git. Nenhuma migração de dados externos nesta etapa.
Domain oferece contratos, validação, permissões puras e hooks por entrypoints
separados. Adaptador local de prévia fica no domain e nunca substitui auth real.

## 2. Backend e dados

Recriar as funções com os builders oficiais Convex, schema tipado e configuração
de auth Better Auth/Google. Manter apenas funcionalidades da v1 expostas.
Modelo principal: users, devotionals, globalSettings, communities,
communityMembers, communityMessages, checklists, checklistItems e checklistTicks.
Novos metadados editoriais: referência, tradução, licença, publishedAt e revisão;
registro de correções em editorialEvents. Atualizar arquitetura antes do schema.

Leituras por índice e checks de associação em toda função comunitária. Saídas de
membros não incluem e-mail. Alterar tick usa estado booleano explícito, nunca
inversão cega. Identidade vem da sessão. Publicação é operação interna com revisor
humano obrigatório, data única e auditoria de correção/retirada.

## 3. Web

Shell com duas abas, conta/ajuda, rotas reais e navegação histórica. Leitura
editorial, temas, estados de carregamento/vazio/falha e áudio opcional persistente
no shell. Comunidades: entrada/criação, seletor, mural, listas e gestão de membros.
Validação vem de domain; UI só apresenta resultados. Login Google por provider
oficial. Sem credenciais, prévia apenas em desenvolvimento e aviso honesto na
produção.

## 4. PWA e custo

Manifest, ícones, service worker com precache apenas do shell estático; nunca
cachear Convex/auth, conteúdo privado ou gravações. Atualização mediante escolha
do leitor. Fontes locais. Build estático compatível com Pages e fallback de SPA.
Sem push, analytics, serviço de e-mail ou dependência de áudio externo.

## 5. Testes e entrega

ESLint real em cada workspace, TypeScript estrito, testes de regras em domain e
testes de isolamento/autorização no backend com convex-test. Validar navegador em
desktop e celular, links, formulários, refresh, modo offline e build sem fixtures.
Validar auth real, publicação e restauração com credenciais quando disponíveis.

## 6. Mobile e limitações

Expo não será criado nesta etapa. Contratos/regras/tokens permanecem reutilizáveis.
Não marcar tasks mobile como feitas. Não publicar textos editoriais gerados nem
dados reais sem revisão/autorizações; a demonstração local é identificada.

## 7. Continuação — acesso e preparação para homologação

Concluir RF3/RF4: preservar o destino interno no login, validar o parâmetro com
Zod em domain/core e recusar URLs externas. O callback de erro retorna ao acesso
com mensagem recuperável. Logout só navega após resposta bem-sucedida.
Configuração parcial/inválida não pode selecionar a prévia DEV; validar o par
de endereços públicos antes de criar clients. Testar essas decisões no domain.
Automatizar a inspeção do build para fixtures, manifest e ausência de cache de
APIs, sem publicar ou exigir credenciais para executar os checks locais.

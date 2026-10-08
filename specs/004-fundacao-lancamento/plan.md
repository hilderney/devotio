# Plano técnico — nova aplicação web

Cabeçalho desktop: agrupar cabeçalho/faixas na casca comum. Acima de 900 px, fixar o grupo no topo com espaço reservado pela altura completa medida; reduzir após 64 px de rolagem e expandir ao retornar até 16 px. Listener passivo com requestAnimationFrame agrupado; observar altura completa via ResizeObserver e viewport via matchMedia, removendo listeners ao desmontar. Reutilizar os mesmos links, sino e perfil, ocultando somente rótulos visuais na versão compacta. CSS nos tokens, transições curtas e prefers-reduced-motion. Mobile mantém o tema sticky e navegação existentes; CRUD editorial independente preservado. Sem mudanças de domínio, banco ou rede.

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

## 8. Consolidação da interface para testes — 08/10/2026

Revisão de manutenção solicitada pelo usuário: padronizar botões, reduzir estilos
repetidos e tornar os componentes semânticos e legíveis. Executa os requisitos
visuais/acessíveis existentes de 004 e preserva os fluxos aprovados de 001/006–009;
não implementa a proposta 010 nem migra funcionalidades locais para produção.

1. Inventariar controles e regras CSS. Consolidar ações em `Button`/`IconButton`,
   com variantes explícitas primária, secundária e discreta, tamanho consistente,
   foco visível, estados desabilitado/selecionado e redução de movimento.
   Links continuam links; selects, listas de opções e seleção bíblica preservam
   suas semânticas próprias. Reaproveitar o botão de retorno à Bíblia.
2. Separar casca de leitura e menu da conta da definição das rotas. Erros de
   atualização/logout devem continuar visíveis depois de o menu fechar; retornar
   foco de Configurações a um acionador visível.
3. Organizar CSS por responsabilidade (base, controles, casca e áreas), remover
   regras obsoletas e sobrescritas concorrentes. Usar tokens existentes, preservar
   temas/fonte e corrigir estouros em navegação/ações em telas pequenas.
4. Unificar formulários e modais: ação principal distinguível, campo de data
   utilizável, fechamento apenas no backdrop e preservação de foco/diálogos filhos.
5. Executar testes existentes e regressões dos comportamentos corrigidos,
   lint/typecheck do monorepo e build/PWA. Inspecionar navegador quando disponível,
   registrando dimensões e limitações sem confundir DOM simulado com teste físico.
6. Entregar roteiro de homologação local e matriz explícita de pendências para
   publicação: paridade Convex, autenticação real, conteúdo e operação. Mobile
   continua adiado. Não declarar a publicação pronta apenas porque o build passa.

Evitar novas bibliotecas, abstrações genéricas de formulários/negócio e alterações
de schema. Cada componente deve resolver repetição existente, com API curta e
nomes de intenção; classes de página ficam responsáveis pelo layout.

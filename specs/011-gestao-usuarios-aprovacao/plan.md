# Plano — Gestão de usuários e aprovação

Spec aprovada em 09/10/2026. Implementação na branch
`codex/gestao-usuarios-aprovacao`; web conectada ao Convex. SQLite e Expo não recebem
este painel. Não publicar automaticamente no ambiente compartilhado.

## Backend/domain

- Validadores Zod, contratos, regras de situação e hooks em domain. Regras de
  autorização repetidas no servidor, nunca delegadas à casca web.
- `users`: tornar authId opcional para pré-cadastro; acrescentar situação opcional
  (ausente = legado aprovado), e-mail normalizado, capacidade editorial e índices
  de listagem/busca. E-mail de conta vinculada não editável no painel.
- Bootstrap autenticado idempotente vincula pré-cadastro apenas por e-mail
  verificado; demais usuários novos entram pendentes por padrão. Contas antigas
  somente no Better Auth são reconhecidas por data de criação anterior ao marco
  de ativação configurado em `PILOT_EXISTING_USERS_BEFORE` (ISO UTC). Isso preserva
  leitores que nunca criaram comunidades e ainda não têm registro em users.
- Toda operação pública de conteúdo exige usuário aprovado; identidade básica
  fica separada da autorização de produto. Consulta de situação e bootstrap são
  as únicas exceções autenticadas para pendentes/desativados.
- Superusuário operacional independente da tabela de participantes: login,
  hash scrypt e segredo TOTP configurados somente no servidor. Script local
  interativo prepara credenciais; não receber segredos pelo chat.
- Login em action Node usa utilitários criptográficos existentes do Better Auth;
  consumo de limite via componente oficial rate-limiter em transação independente
  antes da verificação, evitando rollback das falhas. Janela TOTP de ±30 segundos,
  contador utilizado consumido atomicamente para impedir replay concorrente.
- Token administrativo aleatório de 256 bits só em memória no navegador;
  hash SHA-256 no banco. Sessão de 30 minutos, validada em cada operação,
  revogável no logout e invalidada por rotação de credenciais. Sem cookies de
  terceiros, sem token em URL/localStorage. Recarga requer nova entrada.
- `adminSessions`, `adminSecurity`, `accessSettings`, `userAdminEvents`: sessão,
  prevenção de replay, exigência de aprovação e histórico sem segredos.
- CRUD administrativo por mutations autorizadas, páginas de 25, busca por prefixo
  de nome/e-mail e situação. Pré-cadastro idempotente; nome editável, aprovação,
  desativação e capacidade editorial; associações admin/member por comunidade.
  Proteger último administrador ativo ao rebaixar/remover ou desativar conta.
- Gestão editorial conectada separada: listar, publicar/corrigir e retirar com
  capacidade conferida no servidor e autoria derivada da sessão. Reusar validação
  e operações editoriais existentes, sem migrar o corpus bíblico local nesta feature.

## Web

- Rota `/gestao-acesso`, sem menus públicos; robots noindex e cabeçalho de resposta.
  Formulário login/senha/código; lista, filtros, paginação, cadastro e edição simples.
- Confirmação explícita de desativação; aviso de preservação de dados.
- Fluxo Google aguarda bootstrap e autorização antes de montar qualquer tela
  protegida. Estado pendente/desativado com sair/consultar; atualização reativa
  retira o conteúdo ao revogar acesso. Nenhum polling.
- Concessão de gestão editorial permite rota editorial conectada e link no menu
  da conta. Permissões comunitárias respeitam a associação já usada pelo app.

## Verificação e operação

- Testes domain para regras/validação; convex-test para barreira de conteúdo,
  preservação de legados, bootstrap, CRUD, permissões, replay e sessão expirada;
  testes web para entrada, espera, desativação e estados de erro.
- Lint, typecheck, testes do monorepo e build/PWA. Documentar esquema, limitações e
  roteiro de setup/deploy. Antes de publicar: identificar deployment, configurar
  segredos e marco de usuários existentes; aprovação operacional ao final.
- Teste de autenticação Google real e aplicativo autenticador em dispositivo
  dependem de homologação no ambiente conectado. Não declarar isso validado por mocks.

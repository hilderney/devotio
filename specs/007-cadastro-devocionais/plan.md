# Plano: Cadastro de devocionais

## Revisão 07/10/2026 — Palavra por seleção

Palavra somente leitura, busca e botão de retorno à Bíblia. Estado do formulário
e snapshot bíblico no AppProvider por conta e cadastro, sem requests por tecla.
Parâmetro validado `pick` distingue seleção contextual da leitura principal.
Schedule exige seleção na criação e reconstrói corpo/referência/versão no servidor;
registros legados continuam editáveis sem exigir nova seleção. Cancelar/programar
limpam o estado; navegar para Bíblia preserva todos os campos e versos.
Expo segue adiado. Testes cobrem ida/volta, metadados e persistência da programação.

**Spec:** [007](spec.md). **Status:** implementado localmente; revisão visual física pendente.

## Backend e modelo de dados

Entrega somente no ambiente local 006. Sem alterações em `packages/backend/schema.ts`
ou novas tabelas Convex. Reutilizar SQLite devotionals/audit/users. A capacidade
`editorial` já independente das comunidades representa Gestor do sistema. Atualizar
o nome/descrição de Ester de forma não destrutiva no banco existente.

Adicionar comando `schedule` com modo `create` ou `update`, validação Zod e
autorização de sistema no servidor. Create exige data livre em transação; update
exige registro existente e mantém a data. O legado publish passa a corrigir apenas
registros existentes. Exclusão lógica com auditoria preserva favoritos e a reserva
da data. Instante de disponibilização é calculado pelo servidor à meia-noite em
America/Sao_Paulo; não confiar em publishedAt/autoria enviados pelo navegador.

## Domain

Contrato de agendamento com campos de conteúdo, referência, fonte e data; helpers
para meia-noite de Brasília e limites de data. Reutilizar permissão canPublish.
Invalidação apenas da data afetada e listagem editorial, sem polling. Dados de
seleção bíblica validados no domain e transferidos em memória por conta.

## Web

Listagem /editorial: criar, editar, retirar com confirmação. Formulário próprio
/editorial/cadastro fora do ReaderShell: fundo branco, fonte uniforme, ações
Programar/Cancelar/Auxílio, busca e botão de escolha/revisita da Palavra.
Data/referência/versão/fonte são metadados do agendamento;
edição carrega o registro pela data, mantendo-a imutável. Falhas preservam campos.
Auxílio apenas alterna mensagem Peregrino na tela. Seleção nativa de texto no
capítulo bíblico identifica os versículos interceptados; enviar trecho mantém
versos completos numerados, referência e versão. Formulário em memória preservado
durante a navegação, descartado ao cancelar/salvar/trocar conta; sem autosave HTTP.

## Mobile

Somente navegador responsivo nesta entrega. Expo adiado; tarefas nativas abertas.

## Validação, operação e limites

Testes domain de calendário/validação; backend de papel, conflito, edição,
retirada, disponibilidade e preservação/reabertura; web de Palavra readonly, transferência,
cancelamento e erros. Lint/typecheck/test/build monorepo. Sem novas dependências,
serviços pagos ou chamadas de IA. Listagem mantém limite existente de 100 registros;
dimensionamento público fora de escopo. Revisão visual física permanece pendente
se o controle de navegador não estiver disponível.

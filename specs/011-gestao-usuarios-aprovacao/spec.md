# Spec: Gestão de usuários e aprovação do piloto

**ID:** 011-gestao-usuarios-aprovacao
**Status:** aprovada em 09/10/2026 — implementada na branch; configuração e homologação publicadas pendentes
**Versão alvo:** piloto v1 na web
**Criada:** 09/10/2026
**Relacionadas:** [004](../004-fundacao-lancamento/spec.md), [005](../005-piloto-publicacao/spec.md).

## 1. Contexto e problema

O responsável informa que o aplicativo já está publicado para testes e precisa
controlar quem participa. Uma página discreta deve permitir administrar usuários
e aprovar novos cadastros sem operar manualmente o banco. O estado publicado
informado não foi verificado nesta revisão; os registros históricos de publicação
nas specs anteriores não comprovam a situação atual.

## 2. Papéis envolvidos

- Superusuário: proprietário do piloto, único autorizado a administrar o acesso
  global e as permissões pelo novo painel.
- Pessoa pendente: autenticou com Google, mas ainda aguarda autorização de entrada.
- Pessoa aprovada: usa as funcionalidades e permissões já concedidas.
- Pessoa bloqueada/excluída: não pode usar as funcionalidades protegidas.
- Administradores de comunidade não recebem acesso ao painel automaticamente.

## 3. Histórias de usuário

- Como proprietário, quero entrar em uma página não listada e administrar os
  participantes com poucas ações.
- Como proprietário, quero criar cadastros, listar, editar, excluir, aprovar e
  revogar acesso de usuários e conceder as permissões permitidas.
- Como novo participante, quero saber que meu cadastro aguarda aprovação.
- Como proprietário, quero encerrar a exigência de aprovação quando terminar o
  período de testes, por uma ação explícita.

## 4. Requisitos funcionais

1. Disponibilizar página web acessível por endereço direto, sem links nos menus
   públicos ou inclusão em sitemap, e com indicação de não indexação.
2. Exigir autenticação exclusiva do proprietário com login, senha e código
   temporário de aplicativo autenticador (TOTP), conforme decisão da seção 9.
   O endereço não listado, sozinho, não concede acesso.
3. Exibir lista paginada de usuários com nome, e-mail, situação e permissões,
   busca por nome/e-mail e filtro por situação.
4. Permitir criar um cadastro por nome/e-mail. Proposta: pré-cadastro vinculado
   somente após login Google com e-mail verificado correspondente, sem senha
   própria para participantes e sem envio automático de mensagens.
5. Permitir editar nome, aprovar, desativar e alterar permissões de gestão
   editorial e administração por comunidade. Aprovação de entrada e papel
   administrativo são decisões distintas.
6. Durante a fase fechada, o primeiro login Google registra a pessoa como
   pendente e mostra “Seu cadastro está aguardando aprovação”, com opção de sair
   e consultar novamente a situação. Repetir login não duplica cadastro nem aprova.
7. Pessoas pendentes, bloqueadas ou excluídas não podem consultar nem alterar
   conteúdo protegido, inclusive por acesso direto às operações do servidor.
8. Aprovar permite entrada sem novo cadastro. Bloquear revoga acesso nas próximas
   operações e retira conteúdo protegido da interface quando detectado; dados
   anteriormente visualizados não podem ser apagados retroativamente de cópias externas.
9. Desativar exige confirmação que identifique o usuário e explique a preservação
   dos dados. A ação não pode liberar reentrada automática no próximo login nem
   deixar referências quebradas. Reativação é explícita; não há apagamento definitivo.
10. Impedir autoexclusão e remoção do único superusuário por este painel.
11. Proposta para contas existentes: preservar acesso atual, apresentando-as para
    revisão do proprietário; aplicar espera apenas a novos cadastros.
12. Permitir ao superusuário desativar a exigência de aprovação para novos
    cadastros. Isso não aprova pendentes nem desbloqueia pessoas automaticamente.
13. Registrar autor, data, alvo e ação das alterações administrativas, sem senhas.

## 5. Requisitos não-funcionais

- Interface simples, em português, acessível por teclado e em telas pequenas.
- Operações administrativas exigem conexão; falhas não devem indicar sucesso.
- Verificações de acesso obrigatórias no servidor; segredos nunca incluídos no
  código público, logs, repositório ou armazenamento legível do navegador.
- Limitar tentativas de entrada e expirar sessões administrativas; erros de login
  não revelam qual segredo estava correto.
- Lista limitada e operações idempotentes para evitar duplicações ao tentar novamente.

## 6. Regras de visibilidade/permissão

| Papel | Pode ver | Pode criar | Pode editar/remover |
|---|---|---|---|
| Visitante | Entrada e informações públicas | Não pelo painel | Não |
| Pendente | Própria situação de aprovação | Próprio cadastro via login | Sair da sessão |
| Aprovado | Conteúdo conforme permissões existentes | Conforme specs existentes | Conforme specs existentes |
| Bloqueado/excluído | Aviso de acesso indisponível | Não | Não |
| Admin de comunidade | Apenas seu escopo existente | Conforme spec 002 | Sem gestão global de contas |
| Superusuário | Dados cadastrais, situação, permissões e histórico administrativo | Pré-cadastros | Aprovar, editar, bloquear e excluir conforme política aprovada |

O painel não autoriza leitura de orações, favoritos, progresso ou comentários
privados e não altera `bibleMarkings.visibility`. Gestão editorial e de comunidade
continuam com escopos próprios.

## 7. Fora de escopo

- CRUD genérico de tabelas ou acesso irrestrito ao banco pelo navegador.
- Cadastro público por senha, novos provedores sociais e mensagens automáticas.
- Múltiplos superusuários gerenciáveis pela interface nesta primeira versão.
- Novas funcionalidades editoriais, comunitárias ou leitura de dados privados.
- App nativo e implementação equivalente no modo SQLite local neste ciclo.

## 8. Dados envolvidos

O backend conectado usa Convex, conforme solicitação. Hoje `users` registra
identidade, nome e e-mail; o código consultado não possui situação de aprovação.
Será necessário representar situação, permissões autorizadas, pré-cadastros,
configuração de entrada no piloto, autenticação administrativa e histórico mínimo.
As associações, mensagens e marcações de listas vinculadas a usuários devem ser
consideradas na exclusão. Nenhuma alteração de schema é feita nesta revisão;
campos/tabelas e atualização de arquitetura serão definidos no plano após aprovação.

## 9. Perguntas em aberto

### Decisões aprovadas em 09/10/2026

O usuário confirmou senha + código temporário de autenticador (TOTP), concessão
de acesso, gestão editorial e administração de comunidades, desativação em vez de
apagamento e manutenção do acesso dos usuários atuais. Essas decisões substituem
as alternativas abaixo: exclusão significa desativação reversível com preservação
dos dados; o painel usa esse nome explicitamente. Administração comunitária será
concedida por comunidade, sem acesso global a conteúdo privado. Criação segue a
proposta de pré-cadastro por e-mail verificado, sem senha para participantes.
O desligamento da espera afeta novos cadastros, preservando pendentes/desativados.

As perguntas originais ficam abaixo como histórico resolvido, não como bloqueio.

1. “Login e 2 senhas” significa identificador + duas senhas fixas, ou identificador
   + senha + código temporário de autenticador? Não fornecer segredos na conversa.
2. Quais permissões o painel deve conceder: acesso de participante, gestão editorial
   e/ou administração de comunidades específicas?
3. Exclusão deve apagar a conta e dados pessoais, anonimizando autoria compartilhada,
   ou apenas desativar e ocultar o cadastro? Definir retenção mínima e como impedir
   reentrada sem autorização; não tratar desativação como apagamento definitivo.
4. Confirmar as propostas: criação como pré-cadastro por e-mail; contas existentes
   continuam aprovadas; desligar a espera afeta somente novos cadastros.

## 10. Aprovação e lançamento

- Responsável e data de aprovação: usuário responsável pelo piloto, em 09/10/2026,
  conforme confirmação explícita das decisões acima.
- Canal inicial: web publicada/PWA; Expo adiado, sem marcar entrega nativa concluída.
- Requisitos liberados para plano e implementação com as decisões da seção 9.
- Critério de liberação: provar autenticação administrativa, CRUD aprovado,
  isolamento de dados, aprovação/bloqueio no servidor e proteção contra reentrada;
  validar com identidades distintas e conta existente no ambiente de testes.
- Publicação, configuração de credenciais e alterações em dados reais pertencem
  à etapa operacional posterior; a implementação está na branch, sem rollout.

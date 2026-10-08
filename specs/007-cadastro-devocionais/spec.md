# Spec: Cadastro de devocionais pelo Gestor do sistema

**ID:** 007-cadastro-devocionais
**Status:** aprovada para o CRUD web local em 07/10/2026 pelo usuário, com criação somente em datas livres e edição por opção própria.
**Versão alvo:** web de desenvolvimento local. Publicação e aplicativo nativo adiados.

## 1. Contexto e problema

O Gestor do sistema precisa preparar e programar devocionais em um espaço limpo,
centrado na Palavra, na Meditação e na Oração. A leitura bíblica deve permitir
iniciar esse trabalho com um trecho selecionado, sem copiar e colar manualmente.

Esta tela complementa o produto local da [spec 006](../006-desenvolvimento-local/spec.md).
Não representa a entrega do assistente de IA nem autorização para publicação pública.

## 2. Papéis envolvidos

- **Gestor do sistema:** acesso ao cadastro e ao envio de trechos bíblicos para ele.
- **Gestor de comunidade:** seu papel comunitário não concede acesso editorial.
- **Membro ou leitor sem comunidade:** continuam lendo os devocionais disponíveis.

Uma pessoa pode acumular papéis. O acesso depende de ser Gestor do sistema,
independentemente de suas comunidades; esse papel não concede, por si só, gestão
das comunidades de outras pessoas.

## 3. Histórias de usuário

- Como Gestor do sistema, quero montar Palavra, Meditação e Oração sem distrações.
- Como Gestor do sistema, quero enviar um trecho da Bíblia para preencher Palavra.
- Como Gestor do sistema, quero programar a disponibilidade do texto aos leitores.
- Como Gestor do sistema, quero cancelar e descartar o conteúdo ainda não salvo.
- Como Gestor do sistema, quero conhecer o futuro auxílio Peregrino sem executar IA.

## 4. Requisitos funcionais

1. Disponibilizar uma entrada para o cadastro somente ao Gestor do sistema.
   Acesso direto à tela e tentativas de gravação também devem ser protegidos.
2. Apresentar uma tela de fundo branco, com tipografia uniforme. A revisão de
   07/10/2026 autoriza ícones nos controles de escolha/retorno à Bíblia.
   Rótulos, campos e mensagens devem ser legíveis e acessíveis, sem hierarquia
   tipográfica elaborada. A tela não deve herdar botões e ícones da navegação geral.
3. Exibir três campos de conteúdo: **Palavra**, **Meditação** e **Oração**.
   Palavra mostra somente o trecho escolhido na leitura bíblica, sem edição manual.
   Meditação e Oração aceitam texto corrido. Os três conteúdos são obrigatórios.
4. Manter **Programar**, **Cancelar** e **Auxílio**, acrescentando busca textual e
   botão para escolher/rever a Palavra na Bíblia, conforme revisão do usuário.
5. Na leitura bíblica, permitir ao Gestor do sistema selecionar um trecho do
   capítulo aberto e enviá-lo ao cadastro. Preservar o trecho e sua referência,
   incluindo a tradução AA. Leitores sem esse papel não recebem essa ação.
6. O envio do trecho não grava nem publica um devocional. A seleção não inclui
   marcações, comentários ou orações privados do leitor.
7. **Programar** valida o conteúdo e os dados de agendamento, salva e confirma
   a operação. O gestor escolhe uma data; o conteúdo fica disponível à meia-noite
   dessa data no horário de Brasília, conforme decisão do usuário em 07/10/2026.
   Uma falha mantém os textos preenchidos e permite tentar novamente; tentativas
   repetidas não devem gerar publicações duplicadas.
8. **Cancelar** descarta o conteúdo não salvo e retorna à leitura bíblica quando
   ela originou o cadastro; nos demais casos, retorna à área de origem.
   Cancelar não retira nem altera devocionais previamente gravados.
9. **Auxílio** abre uma mensagem dentro da própria tela sobre o **Peregrino**,
   futuro assistente para criação de devocionais. O mesmo botão pode recolher a
   mensagem. Nesta etapa não há geração, envio de textos a terceiros ou chamada
   a modelos. A mensagem deixa explícito que o auxílio ainda não está disponível.
10. A autoria e a responsabilidade pela programação devem ser associadas à
    identidade autenticada do gestor. Nenhuma geração ou publicação autônoma.
11. Preservar os devocionais programados após recarga e reinício do ambiente local.
    A programação não deve introduzir consultas periódicas de rede nem invalidar
    capítulos bíblicos ou dados de comunidades sem relação com a operação.

### Decisões do fluxo local

- A etapa Programar pode revelar campos de agendamento sem acrescentar botões.
- Manter um devocional por data e bloquear uma data já ocupada, inclusive retirada.
  Alterações passam exclusivamente pela opção Editar existente. Novos cadastros
  aceitam hoje ou datas futuras; editar preserva a data original.
- Usar Ester como perfil mock de Gestor do sistema, nomeando a capacidade editorial já existente; gestores de comunidade
  permanecem sem acesso por esse papel. A migração não deve apagar dados existentes.
- Capturar corpo numerado, referência e versão da seleção; não permitir digitar
  Palavra ou alterar sua referência manualmente. Registrar o gestor como autor/revisor da operação,
  preservando a identificação da fonte e as exigências de licença do produto local.
- A listagem permite consultar, editar e excluir/retirar uma publicação com
  confirmação. Exclusão é lógica: preserva auditoria, reserva da data e snapshots
  favoritos. Uma edição pode restaurar um texto retirado. Metadados de fonte são
  editáveis e não representam autorização automática de publicação pública.

## 5. Requisitos não-funcionais

- Navegação por teclado, rótulos associados aos campos, foco visível e mensagens
  de validação compreensíveis em português; tipografia uniforme não elimina esses recursos.
- Layout utilizável em navegador de computador e celular. Aplicativo nativo fora desta entrega.
- Sem chamadas de IA e sem dependência de serviços pagos nesta etapa local.
- Não alterar a janela de oito dias dos devocionais nem o cache dos seis capítulos.
- Gravação requer conexão com o servidor local; escrita offline não faz parte do escopo.

## 6. Regras de visibilidade/permissão

| Papel | Pode acessar cadastro e enviar trecho | Pode programar | Pode ler conteúdo programado |
|---|---|---|---|
| Gestor do sistema | Sim | Sim | Conforme as regras da área editorial |
| Gestor de comunidade sem papel de sistema | Não | Não | Somente após disponibilização aos leitores |
| Membro / leitor sem comunidade | Não | Não | Somente após disponibilização aos leitores |
| Não autenticado | Não | Não | Conforme os requisitos de acesso do produto local |

A autorização deve ser aplicada na gravação e em qualquer leitura administrativa;
ocultar a entrada no navegador não é suficiente. Um texto em preparação não ganha
visibilidade pública pelo envio da Bíblia ou pelo uso de Auxílio.

## 7. Fora de escopo

- Implementar o Peregrino: modelos, prompts, regras, workflows e integrações.
- Novos poderes administrativos sobre comunidades.
- Publicação do ambiente, autenticação pública ou implantação do aplicativo nativo.
- Biblioteca de rascunhos, edição colaborativa e autosave, não solicitados nesta tela.
- Redesenhar toda a gestão editorial existente, anexar áudio ou criar novos campos
  de conteúdo além de Palavra, Meditação e Oração.

## 8. Dados envolvidos

- Identidade: papel/capacidade explícita de Gestor do sistema, separado dos papéis comunitários.
- Devocional: Palavra, Meditação, Oração, referência e fonte bíblica, data/momento
  de disponibilização, autoria e dados editoriais necessários à rastreabilidade.
- Auditoria: gestor responsável e registro da programação.
- Seleção bíblica: trecho e referência para preenchimento, sem publicar dados privados.

Reutilizar os conceitos de usuários, devocionais e auditoria existentes. O plano
deverá definir a compatibilidade com os registros atuais e documentar qualquer
alteração no modelo de dados, sem confundir o banco local com o backend público.

### Revisão autorizada em 07/10/2026 — escolha da Palavra

A busca do cadastro abre a Bíblia com o texto pesquisado ou em branco. Nesse
fluxo a seleção não abre o menu lateral: um botão flutuante inferior direito
retorna ao formulário com o trecho. Preservar meditação, oração, programação,
pesquisa, capítulo e versos selecionados durante as idas e voltas. O cadastro
mostra corpo numerado, endereço e versão separados. Envio pelo menu da Bíblia
inicia um novo cadastro. O acesso pelo menu principal continua leitura normal.
Cancelar descarta o formulário; navegar para escolher Palavra não o descarta.
O formulário em preparação fica por conta na sessão do navegador, sem autosave
HTTP a cada tecla; gravar o devocional permanece na ação Programar.

## 9. Perguntas em aberto

Nenhuma decisão bloqueante para o CRUD local. Peregrino terá uma spec própria na
próxima tarefa; nenhuma decisão sobre provedor, prompts ou workflows nesta entrega.

## 10. Aprovação e lançamento

- Responsável e data de aprovação: usuário, 07/10/2026. Pedido original e resposta
  sobre datas livres/edição autorizam o CRUD; demais escolhas locais seguem a
  delegação anterior para decidir com base na documentação existente.
- Canal inicial: web local, com banco persistente e login mock existente.
- Diferença de plataforma: nenhuma implementação nativa nesta etapa.
- Liberação: aprovação das decisões abertas; plano e tasks; implementação;
  validação das permissões no servidor, do fluxo bíblico, da programação, do
  cancelamento, da persistência e da ausência de chamadas de IA/polling.
- Conteúdo destinado a publicação real continua sujeito às condições editoriais
  e de licença das specs 004/005; não inferir autorização de distribuição a partir
  de uma gravação no ambiente de desenvolvimento.

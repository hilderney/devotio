# Spec: Escolha da versão bíblica e Almeida 1911

**ID:** 012-versoes-biblia
**Status:** aprovada pelo usuário em 09/10/2026 — em implementação
**Versão alvo:** web local e web conectada do piloto
**Revisão:** 09/10/2026

## 1. Contexto e problema

O usuário forneceu uma Bíblia em JSON identificada como Almeida 1911 e pediu sua
inclusão, com escolha da versão nas Configurações, diretamente na branch `main`.
Hoje, as configurações oferecem tema, fonte e modo de leitura. A leitura local
usa somente AA; a web conectada ainda exibe “Leitura bíblica em preparação”.

A pessoa deve escolher uma edição disponível e ler seu texto, pesquisar e copiar
versículos dessa mesma edição, sem misturar traduções nem perder suas outras
preferências. A inclusão da Almeida 1911 complementa a spec 009 e a leitura da
spec 003; não autoriza automaticamente outras edições candidatas do plano do corpus.

## 2. Papéis envolvidos

Sem diferenciação de papel para escolher a edição. Usuários com acesso à leitura
alteram a própria preferência. O mantenedor prepara as fontes bíblicas; a escolha
de edição não concede gestão editorial nem administração de comunidades.

## 3. Histórias de usuário

- Como leitor, quero escolher a versão da Bíblia nas Configurações e ver o texto
  correspondente ao voltar à leitura.
- Como leitor, quero que minha escolha seja lembrada no meu perfil e aparelho.
- Como leitor, quero pesquisar e copiar trechos com o nome correto da edição.
- Como mantenedor, quero incluir o arquivo fornecido sem modificar sua grafia nem
  substituir silenciosamente o texto AA existente.

## 4. Requisitos funcionais

1. Configurações ganha o campo **Versão da Bíblia**, com o mesmo modal de opções
   utilizado pelos demais campos. Listar somente edições disponíveis naquele
   ambiente, incluindo **Almeida 1911 (ALM1911)** após a preparação do arquivo.
2. Preservar AA onde seu corpus já está disponível. Não oferecer AA na web
   publicada se ela não tiver um corpus preparado para esse ambiente. Não trocar
   nem renomear uma tradução como se fosse outra.
3. O padrão preserva a edição previamente utilizada quando disponível; na ausência
   de preferência válida, usa uma edição disponível. Uma preferência indisponível
   informa a situação e permite escolher outra, sem apresentar texto com rótulo falso.
4. A escolha aplica imediatamente, sem botão Salvar, e persiste por perfil neste
   aparelho. Preferências antigas continuam válidas; tema, fonte e modo permanecem
   intactos. Não há sincronização entre aparelhos nesta entrega.
5. Leitura, catálogo, navegação e busca usam a versão escolhida. A Almeida 1911
   funciona também na web conectada, encerrando o estado “em preparação” para essa
   edição. Não depender de uma API bíblica externa durante a leitura.
6. Ao trocar de versão, manter livro e capítulo quando existentes na edição de
   destino. Limpar a seleção de versículos da edição anterior e apresentar a edição
   atual. Respostas atrasadas da versão anterior não podem substituir a leitura nova.
7. Manter os modos Paginado/Contínuo e a preparação de capítulos vizinhos. Caches
   distinguem edição e conteúdo, sem devolver capítulo ou resultado de outra versão.
8. A busca retorna trechos somente da edição selecionada. Ao trocar de versão,
   reiniciar a paginação e atualizar os resultados do termo atual.
9. Cópias e novas citações indicam **Almeida 1911 (ALM1911)** ao usar essa edição.
   Favoritos, devocionais publicados, mensagens e rascunhos já existentes conservam
   seu texto e sua identificação originais; não são retraduzidos pela preferência.
10. Preparar o JSON fornecido de forma reexecutável, validar sua estrutura e registrar
    identificação, contagens e hash. Preservar grafia, pontuação e numeração da fonte;
    adaptar identificadores de livros sem reescrever o texto bíblico.

## 5. Requisitos não-funcionais

- Carregar apenas o conteúdo necessário à leitura e reutilizar capítulos já obtidos.
  Não acrescentar o corpus inteiro ao JavaScript inicial da aplicação.
- Manter a janela de três capítulos e o cache recente limitado da spec 009, com
  isolamento por edição e perfil. Troca de edição não inicia downloads integrais.
- Sem polling, importação automática de fontes externas ou alteração de contas.
- Erros de carregamento e conteúdo ausente têm recuperação explícita. Um capítulo
  já armazenado pode ser reutilizado sem rede; não prometer Bíblia integral offline.
- Controle acessível por teclado, foco de retorno e compatibilidade com os temas.
- Validação e políticas de versão pertencem ao núcleo compartilhado.

## 6. Regras de visibilidade/permissão

| Papel | Pode ver | Pode criar | Pode editar/remover |
|---|---|---|---|
| Gestor do sistema | Edições disponíveis e própria preferência | Própria preferência | Própria preferência |
| Gestor de comunidade | Edições disponíveis e própria preferência | Própria preferência | Própria preferência |
| Membro / sem comunidade | Edições disponíveis e própria preferência | Própria preferência | Própria preferência |

Preferências e leitura não são compartilhadas com comunidades. Permissões de
publicação, envio e acesso continuam sendo verificadas no servidor. A disponibilidade
de um corpus não torna dados privados ou operações editoriais públicos.

## 7. Fora de escopo

- Outras traduções além de AA existente e ALM1911 fornecida.
- Comparação de versões lado a lado, áudio ou modernização da grafia de 1911.
- Download integral offline, sincronização de preferência entre aparelhos e Expo.
- Reconstrução geral do banco de contas/comunidades ou do painel de usuários.
- Merge de outra branch ou mudança nas credenciais.

## 8. Dados envolvidos

- Preferência da edição, catálogo e metadados do corpus; capítulos e resultados
  passam a identificar explicitamente a edição.
- Fonte fornecida: `docs/bibles/ALM1911.json`; lista de livros com `abbrev`, `name`
  e `chapters`, cada capítulo contendo textos na ordem dos versículos.
- Inspeção inicial: 66 livros, 1.189 capítulos, 31.101 versículos; nenhum texto vazio
  encontrado. Essas contagens são do arquivo, não prova de autenticidade editorial.
- SHA256: `a47705dc5637daaa2e65160c9fe9aadb70edbdda855179045dbaf288f6aff795`.
- Citações preservam a edição de origem. A preferência não modifica os snapshots.
- Armazenamento será definido no plano; qualquer alteração de tabelas deve atualizar
  o modelo de dados em `docs/architecture.md`.

## 9. Perguntas em aberto

- Escopo aprovado explicitamente pelo usuário, incluindo a ALM1911 na versão publicada.
- Fonte: arquivo fornecido pelo usuário, que autoriza sua inclusão e informa domínio
  público da edição histórica. Registrar essa declaração e o hash, sem atribuir
  à data do arquivo uma certificação jurídica automática. A regra brasileira geral
  de prazo se refere ao falecimento do autor (art. 41), com regras próprias para
  outras categorias (arts. 43/44), conforme a
  [Lei 9.610/1998](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm).

## 10. Aprovação e lançamento

- Pedido e aprovação explícita do usuário em 09/10/2026: “Aprovado pode implementar”,
  com inclusão da edição no ambiente publicado.
- Trabalho na branch `main`, conforme solicitação explícita do usuário.
- Canal inicial: web local e conectada; mobile permanece adiado, sem task concluída.
- Critérios: edição correta em leitura/busca/cópia, persistência isolada, compatibilidade
  com preferências antigas, preservação de snapshots e respostas em voo, validação do
  corpus e checks do monorepo. Homologação visual e publicação registradas separadamente.
- Preparar o artefato público e validar antes da etapa de deploy; não alterar o Convex
  para armazenar conteúdo estático que não depende de contas.

# Usar o produto local

**05/10/2026 — escopo da [spec 006](../../specs/006-desenvolvimento-local/spec.md).**
Web com SQLite persistente, identidade simulada e Bíblia AA importada. Não exige
Convex, Google, Docker ou conta externa para usar depois da preparação inicial.

## Iniciar

Com Node 24.19.0 e npm 11.6.2, na raiz:

```sh
npm ci
npm run setup:local
npm run dev
```

Abra [Devotio local](http://127.0.0.1:3000/). `setup:local` precisa de rede e baixa
somente AA do repositório oficial da ABíbliaDigital e o catálogo de livros da API.
Nesta máquina os arquivos e o banco já estão preparados: basta `npm run dev`.
Não preencha as variáveis Convex para este modo. Configuração Convex parcial não
ativa o mock; `npm run preview -w web` serve produção e também não ativa o mock.

O mesmo processo Vite monta a interface e o backend em `packages/backend/local`.
Fechar o terminal encerra o servidor; reiniciar o comando preserva os dados.
Não usar `--host 0.0.0.0`: o backend simulado só aceita loopback.

## Perfis e roteiro

| Perfil | Experiência |
|---|---|
| Daniel Almeida — AG | Administra Esperança; publica no mural, cria listas e remove membros |
| Marina Oliveira — membro | Participa de Esperança; lê e marca seus próprios itens |
| Lucas Santos — leitor | Começa sem comunidade; pode entrar por código ou criar um grupo |
| Ester Costa — editorial | Menu de conta → Editorial local; também é administradora da comunidade de teste Caminho |

AG é associação por comunidade; editorial é uma capacidade independente. Ester
tem uma associação inicial explícita em Caminho, não acesso a todos os grupos.
AC/clube continua adiado pela spec 002. Todos podem ler e guardar favoritos pessoais.

1. Entre como Marina; alterne os oito dias e salve um favorito.
2. Abra Bíblia: escolha livro/capítulo, busque “oração” e abra um resultado.
   Um número de versículo é um link para aquela referência.
3. Abra Esperança: consulte mural/listas/membros e marque um item.
4. No menu da conta, use **Sair / trocar perfil**. Entre como Daniel para testar
   gestão. Lucas pode entrar com **ESPERANC**, após confirmar o nome do grupo.
5. Entre como Ester e abra **Editorial local** para criar/corrigir/retirar um
   devocional. Use textos de teste; revisão, licença e motivo são obrigatórios.
6. Recarregue e reinicie o servidor: dados persistem. Volte à Marina para conferir
   que a cópia favorita permaneceu igual após a edição editorial.

## Dados locais e privacidade

- `.data/devotio.sqlite`: contas/sessões fictícias, conteúdo, grupos e Bíblia.
- `.data/devotio.sqlite-wal` / `-shm`: arquivos auxiliares enquanto o banco está aberto.
- `.data/bible/`: AA, catálogo e commit da origem. Não estão no Git nem no build.
- `localStorage`, prefixo `devotio:cache:v1:`: cache JSON versionado por perfil,
  validado com Zod. Guarda oito devocionais, favoritos, catálogo e seis capítulos
  AA. Sobrevive à recarga; limpo no logout, troca ou expiração. O prefixo antigo
  `devotio:favorites:` é removido ao encerrar/trocar identidade.
- Favoritos são snapshots por usuário/data. Repetir favorito não altera a cópia;
  remover e favoritar novamente captura o conteúdo então disponível.
- Sem rede com a sessão já aberta, leituras guardadas continuam legíveis. Nova abertura
  requer validar a sessão; não há alterações offline ou download de áudio.
- O arquivo do banco é bloqueado pelo servidor de arquivos do Vite. Endpoints
  exigem sessão/associação, origem local e identidade esperada pelo adaptador.

O login simulado permite escolher qualquer perfil fictício na máquina. Não é uma
barreira de autenticação adequada para publicação. Não insira dados pessoais reais.

Para backup, pare o servidor antes de copiar `.data` para outro diretório. Para
recomeçar sem perder o estado anterior, pare o servidor e renomeie o banco e seus
auxiliares; uma nova base é criada na próxima inicialização. Não apague o backup
até conferir o novo ambiente.

## Cache e orçamento de chamadas

| Situação | Consultas esperadas de leitura |
|---|---|
| Primeira entrada no Devocional | Um lote com até oito datas e uma consulta dos favoritos |
| Outra data já guardada / shell e leitor simultâneos | Nenhuma consulta adicional dos textos |
| Página aberta sem interação, no mesmo dia | Zero chamadas periódicas |
| Novo dia com os oito textos anteriores disponíveis | Um lote contendo somente a nova data; exclui a mais antiga |
| Retorno após vários dias | Um lote com as datas faltantes, no máximo oito |
| Primeiro acesso à Bíblia | Catálogo uma vez e somente o capítulo solicitado |
| Revisitar um dos seis capítulos guardados | Zero chamadas de capítulo, inclusive após recarga |
| Sétimo capítulo diferente | Uma consulta; remove o menos recentemente acessado |
| Salvar favorito | Uma escrita e uma consulta dos favoritos, se a tela estiver observando |
| Marcar item de uma lista | Uma escrita e atualização somente das páginas abertas daquele grupo |

Além da leitura, há uma verificação de sessão por abertura, compartilhada por
chamadas simultâneas. Login gera token opaco aleatório em cookie HttpOnly/SameSite
com validade de 30 dias; sessões antigas mantêm o prazo original até novo login.
O servidor verifica a identidade nas operações reais. Não há JWT nem renovação
periódica. Eventos do navegador sincronizam troca/logout entre abas sem polling.
O temporizador de 30 segundos consulta apenas o relógio do dispositivo para
detectar expiração e mudança de dia; não envia requisições no mesmo dia.

O cache usa a data do fuso do dispositivo; o servidor valida cada data contra sua
própria janela. Dias sem publicação também ficam lembrados; são tentados novamente
no próximo dia ou por atualização manual. O seed cria textos de demonstração ao
iniciar o servidor, não gera novas publicações automaticamente à meia-noite.

**Menu da conta → Atualizar conteúdo** consulta novamente os oito dias e as áreas
abertas para buscar correções editoriais, favoritos e novidades comunitárias.
Textos bíblicos já guardados são reutilizados (corpus AA fixado nesta versão).
Comunidades e resultados de busca não ficam persistidos; ao sair e reentrar na
área há nova consulta. Não há sincronização em tempo real entre dispositivos.
Uma correção/retirada editorial invalida apenas sua data na sessão que a realizou;
outras sessões precisam atualizar o conteúdo para recebê-la. Favoritos não mudam.

Se o navegador bloquear ou esgotar armazenamento, o app avisa e mantém o cache em
memória até fechar a página. Se atualizar sem servidor, as cópias existentes não
são apagadas. Escritas continuam exigindo servidor; não há fila offline.

## Bíblia e validação

AA: **66 livros, 1.189 capítulos e 31.104 versículos**. Importação atômica,
idempotente, busca FTS5 com acentos normalizados e páginas de 40 resultados.
O texto é servido exclusivamente do SQLite, não da API durante a leitura.
Fonte, commit e SHA256 estão no banco; detalhes e correções de catálogo na
[nota do provedor](bible-provider.md). Redistribuição pública exige a etapa editorial posterior.

```sh
npm run verify:local   # com npm run dev aberto em outro terminal
npm run test
npm run lint
npm run typecheck
npm run verify:web
```

Os dois testes do corpus AA exigem `setup:local`; em checkout sem os arquivos são
explicitamente ignorados. Não reportar o corpus validado quando esses testes pularem.

## Limites da entrega

Google real/Convex permanecem separados e pendentes de homologação. Janela,
favoritos e Bíblia desta entrega estão implementados no SQLite; portar suas
queries/mutations ao Convex é trabalho futuro antes de publicar. Mobile adiado.
Revisão visual automatizada ficou bloqueada pela política de URL da ferramenta;
não há nova evidência de auditoria visual em aparelhos nesta rodada.

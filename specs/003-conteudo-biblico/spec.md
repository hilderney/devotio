# Spec: Conteúdo Bíblico — Importação, Cache e Leitura

> Revisão de 04/10/2026: leitura bíblica incluída no marco local das três áreas.
> Fonte escolhida pelo usuário: ABíbliaDigital em `abibliadigital.api.br`.
> O usuário confirmou importação para o banco e versão inicial **AA** em 04/10/2026.
> Identificação da edição, condições de cópia e demais pontos de §9 continuam
> pendentes. As tabelas bíblicas ainda não existem no schema ativo.

**ID:** 003-conteudo-biblico
**Status:** rascunho (depende de decisões em §9 antes de virar "aprovada")
**Versão alvo:** produto web local completo, antes de planejar publicação ([ADR 002](../../docs/adr/002-local-complete-product.md))

## 1. Contexto e problema

O app precisa de texto bíblico confiável em dois lugares:

1. **Leitura direta** — a área de Bíblia da versão local, onde o usuário
   navega por livro/capítulo/versículo.
2. **Fonte de conteúdo** — hoje, `devotionals.scripture`, `globalSettings.monthlyVerse`
   e `globalSettings.weeklyVerse` são digitados manualmente pela equipe editorial.
   Ter uma fonte de texto bíblico oficial reduz erro de digitação/citação e permite,
   no futuro, uma ferramenta de apoio ao publicador que busca o versículo em vez de
   copiar/colar de outro lugar.

Este documento cobre como o conteúdo bíblico entra no sistema (importação), onde
fica armazenado, e como é consumido — não cobre a UI de um painel editorial
completo (isso é uma spec futura que pode reusar as funções descritas aqui).

### Risco de arquitetura que motiva o desenho abaixo

A fonte selecionada é a [ABíbliaDigital](https://abibliadigital.api.br), cuja
[documentação](https://github.com/omarcoscardoso/abibliadigital-api-br) descreve
uma continuação do projeto anterior. O encerramento histórico da API no domínio
`.com.br` não determina a disponibilidade do novo `.api.br`. Ver
[verificação do provedor](../../docs/engineering/bible-provider.md).

O desenho atual desta spec trata qualquer fonte de texto bíblico (API oficial, instância
self-hosted, ou dataset estático) como **fonte de importação**, não como
dependência de runtime. O app nunca chama uma API bíblica externa a partir do
client (web ou mobile) — ele lê de uma cópia própria dentro do Convex.
Esse modelo foi confirmado pelo usuário (D4 do plano do produto): importar AA
para o banco. Não implementar consulta externa sob demanda durante a leitura.

## 2. Papéis envolvidos

- **AG / equipe editorial**: dispara ou agenda a importação/atualização do
  conteúdo bíblico (via script administrativo — não há UI de admin nesta spec).
- **Membro / qualquer usuário autenticado**: consome o conteúdo já importado
  (leitura na aba Bíblia Online).

Não há diferenciação de visibilidade por comunidade/clube — o texto bíblico é o
mesmo para todos os usuários do app. Comentários pessoais sobre versículos são
fora de escopo; `bibleMarkings` não existe no schema ativo.

## 3. Histórias de usuário

- Como usuário, eu quero navegar pelos livros e capítulos da Bíblia, para ler um
  capítulo inteiro dentro do próprio app.
- Como usuário, eu quero abrir um versículo específico (ex: a partir de um link
  interno do app, como o devocional do dia), para ler o texto completo em contexto.
- Como membro da equipe editorial, eu quero que o texto de `devotionals.scripture`
  e dos temas do mês/semana venha de uma fonte confiável e citável, para reduzir
  erro de transcrição manual.
- Como mantenedor técnico, eu quero que a importação do texto bíblico seja
  independente da disponibilidade de uma API externa específica, para não ficar
  bloqueado se a fonte escolhida sair do ar (como já aconteceu com a
  abibliadigital.com.br).

## 4. Requisitos funcionais

1. **Fonte de dados desacoplada.** O sistema deve importar o texto bíblico através
   de uma interface `BibleContentProvider`, com pelo menos uma implementação
   concreta funcional no momento da entrega (ver §9 sobre qual implementação sai
   primeiro).
   - Critério de aceite: trocar de provider (ex: de dataset estático para API,
     se houver uma mudança futura de fonte) não exige alterar nenhuma função pública
     de `bibleContent` nem nenhum componente de UI — só a implementação interna do
     provider.

2. **Importação/sincronização.** O sistema deve popular as tabelas
   `bibleBooks` e `bibleVerses` a partir do provider configurado, para uma ou mais
   versões da Bíblia, começando exclusivamente pela **AA**, conforme escolha
   do usuário. Outras traduções não entram automaticamente nesta entrega.
   - Critério de aceite: a importação é idempotente — rodar duas vezes não duplica
     livros/versículos (upsert por chave natural: versão + abreviação do livro +
     capítulo + número do versículo).
   - Critério de aceite: a importação registra um resumo (versão, quantidade de
     livros, quantidade de versículos, timestamp) para auditoria simples — sem
     necessidade de uma tabela de log dedicada além de um retorno estruturado da
     action.

3. **Listagem de livros.** O sistema deve expor a lista dos 66 livros (nome,
   abreviação, testamento, quantidade de capítulos, grupo/gênero) para montar a
   navegação da Bíblia Online.

4. **Leitura de capítulo.** O sistema deve retornar todos os versículos de um
   capítulo (livro + número do capítulo + versão), na ordem correta.

5. **Leitura de versículo único.** O sistema deve retornar o texto de um único
   versículo (livro + capítulo + número + versão) — usado tanto pela navegação
   detalhada quanto por qualquer feature que precise citar um versículo específico
   (ex: um link direto a partir do devocional do dia, se essa integração vier a
   ser construída depois).

6. **Busca por palavra-chave.** O sistema deve permitir buscar versículos que
   contenham um termo, dentro de uma versão, retornando referência + trecho.
   - Fora de escopo desta spec: destaque do termo buscado no texto (highlight) —
     fica a critério da implementação de UI, não é um requisito de dado.

7. **Múltiplas versões (extensível, não obrigatório no lançamento).** O modelo de
   dados deve suportar mais de uma versão simultaneamente (schema já particiona
   por `version`), mas o lançamento desta feature pode ir ao ar com apenas uma
   versão importada — ver §9.

8. **Fallback de indisponibilidade de dado.** Se um capítulo/versículo solicitado
   não existir na base local (import incompleto ou referência inválida), o
   sistema deve retornar `null`/lista vazia de forma explícita, nunca lançar erro
   não tratado — a UI decide como comunicar isso (ex: "capítulo não encontrado").

## 5. Requisitos não-funcionais

- **Sem chamada de API externa em tempo de leitura.** Toda leitura feita pelo
  app (web ou mobile) consulta exclusivamente o Convex — nenhuma requisição
  direta do client a `abibliadigital.api.br`, a uma instância self-hosted, ou a
  qualquer outro provedor. O provider só é acionado durante a importação
  administrativa.
- **Custo de armazenamento dentro do free tier.** Uma versão completa da Bíblia
  tem ~31.000 versículos. O volume estimado por versão importada deve ser
  verificado contra o limite de 0.5GB do plano gratuito do Convex antes de
  importar múltiplas versões (ver `plan.md §7`).
- **Import não bloqueia o app em produção.** A sincronização roda como uma
  Convex action separada (disparada manualmente ou por cron), nunca como parte
  do caminho de uma query/mutation acionada por usuário final.
- **Idioma e citação.** Toda referência exibida ao usuário segue o padrão
  `Livro Capítulo:Versículo` (ex: "João 3:16"), consistente com o restante do
  produto.

## 6. Regras de visibilidade/permissão

| Papel | Pode ver | Pode disparar importação |
|---|---|---|
| AG | Todo o conteúdo bíblico importado | Sim (via script administrativo) |
| Membro | Todo o conteúdo bíblico importado | Não |

O conteúdo bíblico em si não é sensível nem específico de comunidade/clube — a
única ação restrita é a importação/sincronização, que não é uma operação exposta
a usuários finais em nenhum papel.

## 7. Fora de escopo

- UI de painel administrativo para disparar a importação por botão (v1 desta
  feature usa script/CLI administrativo, rodado manualmente ou via Convex Cron —
  ver `plan.md`).
- Ferramenta editorial de "buscar e inserir versículo" dentro do formulário de
  criação de devocional — as funções de leitura descritas aqui ficam prontas para
  essa ferramenta, mas construir a UI é uma spec futura (depende do "Painel
  Editorial" já citado como fora de escopo em `specs/001-devocional-diario §7`).
- Comentários/anotações sobre versículos (`bibleMarkings`) — exigem spec própria
  e não estão implementados na base atual.
- Destaque visual de termo buscado (highlight) dentro do texto retornado pela
  busca.
- Áudio da Bíblia (fora do escopo desta feature).

## 8. Dados envolvidos

Tabelas novas no schema (`packages/backend/schema.ts`):

- `bibleBooks` — um documento por (livro, versão): nome, abreviação, testamento,
  quantidade de capítulos, grupo/gênero, autor.
- `bibleVerses` — um documento por (versão, livro, capítulo, versículo): texto.

Essas tabelas são propostas, não implementação existente. Atualizar o modelo de
dados em `docs/architecture.md` junto com qualquer alteração futura do schema.

## 9. Perguntas em aberto

Estas precisam de decisão humana antes de `spec.md` passar de "rascunho" para
"aprovada":

1. **Provider e consumo definidos.** O usuário escolheu
   `https://abibliadigital.api.br` e confirmou importação para o banco em
   04/10/2026. Não implementar cache sob demanda, consulta externa durante a
   leitura, dataset de outro projeto ou hospedagem própria do provedor.

2. **Licenciamento de cada versão.** Não presumir domínio público de ACF,
   NVI ou qualquer edição por estar disponível no GitHub. A SBTB publica
   condições específicas para ACF; citações e distribuição integral são usos
   distintos. Confirmar licença/autorizações de texto, áudio e distribuição
   digital antes de importar qualquer versão. [Fonte oficial SBTB, consultada em
   02/10/2026](https://www.biblias.com.br/direitos-autorais).

3. **Identificação de versão.** Escolher tradução, edição e fonte com a equipe
   editorial. A versão inicial escolhida é **AA**. ACF,
   ARC e AA não são identificadores intercambiáveis; não mapear uma tradução
   para outra silenciosamente. Registrar edição e hash do dataset aprovado.
   Confirmar o identificador `aa` e a edição na resposta real do provedor;
   nenhuma substituição por NVI, NVT, ACF ou ARC é autorizada.

4. **Frequência de atualização.** O texto bíblico não muda — a importação é
   majoritariamente um evento único (seed inicial). Faz sentido manter um cron
   recorrente, ou a importação deve ser tratada como uma migração pontual, rodada
   uma vez e versionada como parte do deploy? Recomendação: tratar como seed
   pontual por versão, reexecutável manualmente se o dataset de origem for
   corrigido — não precisa de cron recorrente.

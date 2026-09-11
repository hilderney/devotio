# Spec: Devocional Diário

**ID:** 001-devocional-diario
**Status:** aprovada
**Versão alvo:** v1 (lançamento)

## 1. Contexto e problema

O usuário abre o app e precisa, em um único olhar, encontrar o texto e a reflexão
do dia sem navegar por menus. Esta é a tela principal do app e define a primeira
impressão de "sobriedade" que o produto se propõe a ter.

## 2. Papéis envolvidos

- **AG / equipe editorial**: publica o devocional do dia (via painel administrativo
  ou script — fora de escopo desta spec, ver §7).
- **Membro / usuário sem comunidade**: apenas consome. Sem diferenciação entre eles
  nesta feature — o devocional diário é o mesmo para todo usuário autenticado.

## 3. Histórias de usuário

- Como usuário, eu quero ver o versículo do mês fixo no topo, para meditar nele ao
  longo de todo o mês.
- Como usuário, eu quero ver o devocional do dia (texto + reflexão) sem precisar
  navegar, para manter a leitura como primeira ação ao abrir o app.
- Como usuário, eu quero ouvir o áudio do devocional, para poder consumir enquanto
  faço outra atividade.
- Como usuário, eu quero uma sugestão de oração curta ligada ao tema do dia, para
  direcionar minha oração pessoal.

## 4. Requisitos funcionais

1. **Tema do mês.** O sistema deve exibir `globalSettings.monthlyVerse` fixo no
   topo da tela, para todo usuário autenticado.
   - Critério de aceite: o bloco permanece visível ao rolar a tela até o segundo
     dia de conteúdo (ex: sticky header ou reafixado no topo), pois a spec de
     produto exige meditação "contínua" ao longo do mês.
   - Se `globalSettings` ainda não tiver sido configurado (documento inexistente),
     o bloco não deve renderizar (nem placeholder vazio) — tratar como ausência
     silenciosa, não como erro.

2. **Tema da semana.** O sistema deve exibir `globalSettings.weeklyVerse` logo
   abaixo do tema do mês, visualmente hierarquizado como secundário (menor
   destaque que o tema do mês, maior destaque que o corpo do devocional).

3. **Busca do devocional do dia.** O sistema deve buscar o documento de
   `devotionals` cujo `date` seja igual à data local do dispositivo, no formato
   `YYYY-MM-DD`, via índice `by_date`.
   - Critério de aceite: a busca nunca varre a tabela inteira — sempre via índice.
   - Critério de aceite: a data usada é recalculada sempre que o app volta ao
     primeiro plano (foreground), não apenas no primeiro carregamento — cobre o
     caso de o usuário deixar o app aberto passando da meia-noite.

4. **Estado vazio (sem publicação).** Se não existir devocional para a data atual,
   o sistema deve exibir um estado vazio sóbrio, com uma frase fixa definida em
   `packages/domain` (ex.: "O devocional de hoje ainda não foi publicado.
   Volte em breve."), nunca um erro técnico, stack trace ou tela em branco.
   - Este estado é visualmente distinto do estado de carregamento (§ item 8) —
     um usuário não pode confundir "ainda carregando" com "não publicado hoje".

5. **Devocional (texto bíblico).** O sistema deve exibir `devotionals.scripture`
   como texto corrido, sem truncamento, "leia mais" ou paginação — o conteúdo é
   curto (3–5 versículos) por definição de produto (constituição §I).

6. **Reflexão.** O sistema deve exibir `devotionals.reflection` na íntegra,
   imediatamente após o texto bíblico, sem exigir interação adicional do usuário
   para revelar o conteúdo.

7. **Áudio.** O sistema deve permitir tocar `devotionals.audioUrl` quando o campo
   estiver presente.
   - Critério de aceite: se `audioUrl` for `undefined`, o player não é renderizado
     — nunca um player desabilitado ou com erro de carregamento visível.
   - Critério de aceite: falha de rede ao carregar o áudio (URL presente mas
     inacessível) exibe um estado de erro discreto no player (ex: ícone +
     "não foi possível carregar o áudio"), sem quebrar o restante da tela.
   - O player não inicia reprodução automaticamente ao abrir a tela (sem
     autoplay) — respeita o contexto de uso do usuário.

8. **Estado de carregamento.** Enquanto a query de `devotionals`/`globalSettings`
   está em voo, o sistema deve exibir um estado de carregamento que não desloque
   o layout quando o conteúdo chegar (evitar "layout shift" abrupto).

9. **Sugestão de oração.** O sistema deve exibir `devotionals.prayerSuggestion`
   como um bloco visualmente distinto (cor de fundo ou borda diferenciada) do
   texto bíblico e da reflexão, sinalizando que é uma instrução de ação, não
   texto de leitura.

10. **Usuário não autenticado.** Se o usuário não estiver autenticado, o sistema
    não deve tentar buscar `devotionals`/`globalSettings` — redireciona para o
    fluxo de autenticação antes de montar esta tela (comportamento herdado do
    roteamento protegido do app, não implementado dentro desta feature).

## 5. Requisitos não-funcionais

- **Resiliência de rede.** A tela deve ser utilizável com conexão lenta: o texto
  (scripture, reflection, prayerSuggestion) deve renderizar antes do áudio
  carregar — áudio é progressivamente aprimorado, nunca bloqueante para o texto.
- **Minimalismo visual.** Sem carrossel, sem paginação horizontal, sem elementos
  que sugiram "mais conteúdo para deslizar" (constituição §I). Um único scroll
  vertical contínuo.
- **Áudio em background (mobile).** O áudio deve continuar tocando com o app em
  segundo plano e aparecer nos controles de mídia do sistema
  (lockscreen/central de controle), incluindo capa/título mínimos (ex: "Devocional
  de [data]").
- **Performance percebida.** Tempo entre abrir a tela e o texto do devocional
  estar visível deve ser dominado pela latência da query do Convex, não por
  processamento no client — nenhuma transformação pesada de dados deve rodar no
  componente de UI.
- **Acessibilidade.** Contraste mínimo AA para todo texto sobre os blocos de tema
  do mês/semana e sugestão de oração (frequentemente coloridos); tamanho de fonte
  do corpo não deve ser fixado abaixo do padrão de acessibilidade do sistema
  operacional (respeitar escala de fonte do dispositivo).
- **Idempotência de leitura.** Reabrir a tela ou trocar de aba e voltar não deve
  reiniciar o áudio já em reprodução (o player mantém estado de reprodução
  independente de remontagem de tela, quando tecnicamente viável na plataforma).

## 6. Regras de visibilidade/permissão

| Papel | Pode ver | Pode criar | Pode editar/remover |
|---|---|---|---|
| AG / editorial | Devocional do dia e histórico | Devocional (via processo fora desta spec) | Sim |
| AC | Devocional do dia | Não | Não |
| Membro | Devocional do dia | Não | Não |

Não há visibilidade diferenciada por comunidade/clube nesta feature — o devocional
diário é global para todos os usuários do app.

## 7. Fora de escopo

- Painel/fluxo de publicação do devocional pelo AG (assumir, para v1, publicação
  via Convex Dashboard ou script interno — uma spec de "Painel Editorial" fica para
  depois se necessário).
- Histórico navegável de devocionais passados (v1 mostra apenas o dia atual).
- Notificação push lembrando de ler o devocional (v2, ver risco de notificações em
  `docs/architecture.md §3`).

## 8. Dados envolvidos

- `globalSettings` (singleton) — leitura.
- `devotionals`, índice `by_date` — leitura.
- Nenhuma tabela nova necessária; schema atual já cobre a feature.

## 9. Perguntas em aberto

- Timezone: a data "de hoje" deve ser calculada com base no timezone do servidor
  (Convex, UTC) ou no timezone do dispositivo? Recomendação: calcular no client
  (dispositivo) e enviar a data como parâmetro da query, para evitar que o
  devocional troque no meio da noite local do usuário em fuso diferente do
  servidor. Decisão a confirmar no `plan.md`.

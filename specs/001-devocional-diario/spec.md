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

1. O sistema deve exibir o versículo/tema do mês (`globalSettings.monthlyVerse`)
   fixo no topo da tela, para todo usuário autenticado.
2. O sistema deve exibir o versículo/tema da semana (`globalSettings.weeklyVerse`)
   abaixo do tema do mês.
3. O sistema deve buscar e exibir o devocional cujo `date` corresponda à data atual
   do dispositivo/servidor (`devotionals` por `by_date`).
4. Se não existir devocional publicado para a data atual, o sistema deve exibir um
   estado vazio sóbrio (ex: "o devocional de hoje ainda não foi publicado"), nunca
   um erro técnico.
5. O sistema deve exibir a reflexão (`devotionals.reflection`) como texto corrido,
   sem truncamento nem "leia mais" — é conteúdo curto por definição de produto.
6. O sistema deve permitir tocar o áudio (`devotionals.audioUrl`) quando presente;
   se ausente, o player não é exibido (não mostrar player quebrado).
7. O sistema deve exibir a sugestão de oração (`devotionals.prayerSuggestion`) como
   um bloco visualmente distinto do texto bíblico e da reflexão.

## 5. Requisitos não-funcionais

- A tela deve ser utilizável com conexão lenta: o texto (scripture, reflection,
  prayerSuggestion) deve renderizar antes do áudio carregar — áudio é
  progressivamente aprimorado, nunca bloqueante.
- Sem carrossel, sem paginação horizontal, sem elementos que sugiram "mais conteúdo
  para deslizar" (constituição §I).
- No mobile, o áudio deve continuar tocando em segundo plano e aparecer nos
  controles de mídia do sistema (lockscreen/central de controle).

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

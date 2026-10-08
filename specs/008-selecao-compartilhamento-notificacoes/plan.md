# Plano: Seleção, compartilhamento e notificações

## Menu expansível — revisão 07/10/2026

Estado visual local expandido/compacto no SelectionMenu, sem regras novas de negócio.
CSS fixed inset-block:0/right:0, largura total/rail de 64px em todas as telas,
safe-area e redução de movimento. Botões com aria-label/title e textos ocultos
somente no estado compacto. Hook web de Pointer Events separa swipe horizontal de
rolagem vertical; drawer aceita mouse/toque e tela aceita swipe rápido por toque
apenas quando compacto. Não capturar cliques normais nem controles de formulário;
suprimir click posterior a swipe e impedir seleção nativa no painel. Gestos da
Bíblia permanecem próprios; seleção contextual continua sem drawer.
Teste DOM de seta, swipe em ambas direções, preservação da seleção e ações.
Verificação física de swipe/rolagem continua necessária; Expo permanece adiado.

## Revisão 07/10/2026 — rascunhos e seleção contextual

Payload numerado em domain; clipboard como ação principal. SQLite v3 adiciona
quoteDrafts privado por autor/destino e chave idempotente de envio. Lote multi-select
atômico: validar gestão de todos os destinos antes de commit; falha não envia parte.
Até 100 rascunhos por conta/comunidade, sem sobrescrever os anteriores. Consultas,
atualização, publicação e descarte conferem autor e gestão no servidor. Publicar
retira rascunho da lista e cria mensagem/notificações na mesma transação. Tombstone
mantém chave idempotente após publicar/descartar, sem recriar por retry.
Não alterar schema Convex: este CRUD é apenas local, migração pública pendente.

Escrever carrega rascunhos persistentes, oferece escolha dos anteriores e editor
com busca bíblica. Estado do comentário e capítulo/seleção por fluxo/conta no
AppProvider; botão flutuante retorna ao destino original. A Bíblia pelo menu
principal nunca assume um fluxo anterior. Invalidação somente de rascunhos do
destino e, na publicação, mural afetado. Nenhum polling/HTTP por tecla.
Notificações existentes permanecem; não acrescentar Lida ao menu de seleção.
Testes: isolamento/reabertura SQLite, lote com destino proibido, idempotência,
formulários preservados e leitura principal separada; gestos físicos pendentes.

**Spec:** [008](spec.md). **Status:** implementado e verificado localmente; revisão visual/gestos físicos pendente.

## Backend e dados

Somente SQLite local, sem alteração de `packages/backend/schema.ts`. Migração
não destrutiva: `messages.quote` JSON opcional; `notifications` com destinatário,
tipo, entidade, destino/mensagem, instante/readAt e sequência para paginação.
Índices por destinatário/sequência e mensagem. Aviso inicial idempotente por conta.
Snapshots de trechos conferidos a partir de identificadores AA, não texto do client.
Envio de mensagem e avisos aos demais membros atuais na mesma transação. Permissões
em consulta, escrita, marcação lida e abertura da mensagem alvo. Remoção de membro
revoga também avisos desse grupo; grupos antigos não concedem novos poderes.

Eventos SSE em HTTP local autenticado por cookie e conta esperada, conexão por
sessão, heartbeat de transporte sem consultas; expiração encerra conexão. Após
commit, informar resumo de não lidas e mudança aos destinatários conectados.
Não usar serviços pagos. Resumo entra direto no adaptador; lista é consultada
somente ao abrir/atualizar modal. Reconexão recompõe resumo e lista aberta.

## Domain

Tipos/validadores de seleção, quote, notificação e leitura. Regras de intervalo
contíguo, referência/versão/payload externo e link para primeiro verso. Extensão
opcional dos contratos de Repository para manter Convex/prévia existentes válidos.
Comandos validados; observações deduplicadas; invalidação direcionada. Busca FTS
com termos normalizados e prefixos, mínimo quatro caracteres; resultados em memória
por sessão, sem ampliar cache persistente de seis capítulos/oito devocionais.

## Web

Seleção por clique, Shift+clique, teclado e long-press/arraste; seleção nativa
continua compatível. Menu lateral com X/Limpar e ações condicionadas por papel.
Compartilhar via clipboard/texto copiável com versos numerados.
Rascunho comunitário no SQLite por autor/destino, comentário separado; confirmar
publica, descartar retira da lista. Mural mostra quote e link bíblico. Abrir mensagem alvo
por consulta autorizada dedicada, sem varrer páginas antigas.

Sino no ReaderShell, ao lado da conta; badge numérico sem som/animação. Modal
paginado, entidade em strong, data dd/MM/aaaa Brasília. Botão Lida por item; abrir
destino não marca lida. Busca após debounce, sem resultado obsoleto enquanto digita.
SSE permanece no adaptador web, limpo no logout/dispose; nenhuma API DOM em domain.

## Plataformas, testes e riscos

Expo adiado, navegador responsivo nesta entrega. Testes domain de intervalos,
payload, entrada e permissão; backend de snapshot, isolamento, notificações,
persistência, paginação e mensagem antiga; HTTP eventos reais; web seleção/menu,
busca, rascunho e sino. Lint/typecheck/build; revisão física de gestos permanece
pendente se navegador indisponível. Sem publicação/IA. Falha de SSE preserva
leitura e oferece atualização manual; não substituir por polling oculto.

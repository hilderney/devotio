# Plano técnico: configurações e leitura

Menu da conta mantém details nativo com ref e listeners de pointerdown externo/Escape, removidos ao desmontar; captura de clique nas ações internas fecha antes da ação. Sem polling ou regra de domínio.

**Spec:** [009](spec.md). **Estado:** em execução, 08/10/2026.

## 1. Schema e backend

Sem alteração de tabelas SQLite/Convex, permissões ou funções remotas. AA permanece local e o isolamento do corpus é outra entrega.

## 2. Domain

Validator único de preferências (tema, escala, modo), resolução de tema pelo horário e janela válida de capítulos. Adapter local deduplica carregamentos, fixa janela ativa no cache de seis e separa antecipação de visitas. Observação dos vizinhos começa depois do capítulo atual e termina ao sair da leitura; falhas não bloqueiam o atual. Nenhum timer de rede.

## 3. Web

Provider de preferências por userKey acima das rotas, persistência local separada do cache, gravação agrupada e tema por atributos/tokens CSS. Um timer até a próxima transição, reavaliação em foco/visibilidade. Configurações usa modal acessível existente, slider de oito posições e selects. Converter tamanhos tipográficos existentes em unidades relativas, mantendo layout e escolhas do usuário. Bíblia prepara vizinhos nos dois modos; contínuo renderiza só janela de três, com âncora e compensação ao trocar capítulos. Paginação usa gesto horizontal grande, suspenso por seleção/menu/controles; long-press preservado.

Revisão dos selects: componente compartilhado Dropdown conserva os contratos dos campos e abre Modal/dialog nativo em portal no body. Mesma superfície/backdrop e fechamento dos devocionais recentes, com título do campo, lista rolável e check atual. Remover posicionamento ancorado/Popover API/listeners de scroll. Modal usa IDs únicos e foco inicial opcional para suportar opções sobre Configurações. Combobox anuncia popup dialog; opções recebem foco real, teclado e busca por prefixo; Tab é contido pelo dialog nativo. Substituir automaticamente tema, modo, livro, capítulo, data favorita e rascunho comunitário; validações permanecem. Testar seleção, cancelamento, foco, modal pai e integrações.

## 4. Mobile

Adiado, sem workspace Expo. Reusar políticas domain; armazenamento e gestos exigirão adaptadores nativos. Não marcar entrega nativa.

## 5. Verificação

Testes domain de validação/horário/limites/cache; integração web de modal, persistência, isolamento, troca imediata sem consultas extras, paginação e janela limitada. Lint/typecheck/test/build no monorepo. Gestos e contraste em aparelho físico permanecem sujeitos a homologação, distinta das simulações.

## 6. Operação

Sem dependências novas, API externa, migração, segredo ou deploy. Preferências persistem por perfil/aparelho; logout deixa de aplicá-las sem apagar escolhas. Cache de conteúdo continua descartado no logout. Não prometer corpus inteiro offline. Falha de storage mantém uso em memória.

# ADR 003 — SQLite e identidade simulada no desenvolvimento

04/10/2026 — implementação autorizada pelo pedido explícito de banco local e login mockado.

SQLite no backend local substitui a prévia em memória; não substitui Convex em
produção. Reutilizar regras/validadores/contratos de domain. O servidor de
desenvolvimento verifica sessão e autorização em cada operação. O navegador só
apresenta dados e chama o adaptador HTTP. Perfis fictícios são selecionáveis por
quem usa a máquina, com sinalização explícita de ambiente DEV.

A extensão está na [spec 006](../../specs/006-desenvolvimento-local/spec.md).
Endpoints locais existem apenas no Vite dev sem configuração Convex; o build
público não contém o login mockado. A implementação de 001/003 em SQLite não
significa implementação equivalente no Convex nem aprovação de publicação.

AA será importada do arquivo oficial do provedor, com commit e hash registrados;
o processo não consulta fontes alternativas. Sem rede após preparação inicial.
Dados gerados localmente ficam ignorados no Git e fora do diretório público.

Os módulos de servidor usam `.local.ts`, excluído dos entry points pelo CLI
Convex instalado. Essa separação foi conferida no código do bundler local;
produção não importa esses módulos. A preparação utiliza o arquivo AA do mesmo
provedor e o catálogo da API, evitando consultas externas durante a leitura.

Revisão autorizada em 05/10/2026: remover polling HTTP e manter cache de oito
devocionais (incremental por dia), catálogo e seis capítulos LRU no dispositivo,
além dos favoritos. Reusar token opaco em cookie persistente por 30 dias; JWT não
traria benefício necessário para este ambiente. As regras vivem no domínio;
storage e eventos entre abas são adaptadores web. Detalhes de invalidação,
limitações e orçamento de chamadas no [guia local](../engineering/local-development.md).

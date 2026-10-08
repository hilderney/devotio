# Fonte bíblica — ABíbliaDigital

**Revisão documental:** 08/10/2026. **Verificação da importação:** 04/10/2026. **Escolha do provedor:** feita pelo usuário.

## Estado atual e destino proposto

| Camada | Disponível hoje | Proposta |
|---|---|---|
| Fonte | AA importada do arquivo oficial identificado abaixo | Preservar essa fonte congelada; outras edições exigem identificação e condições de uso próprias |
| Servidor local | Corpus no mesmo SQLite das contas; leitura e busca sem API externa | SQLite bíblico separado, conforme [plano do corpus](bible-corpus-plan.md) |
| Navegador | Cache de seis por perfil, incluindo atual/anterior/próximo preparados nos dois modos (08/10/2026) | Pacote offline integral em migração separada |
| Preferências | Modal com tema/fonte/modo aplicado na hora, conforme [spec 009](../../specs/009-configuracoes-leitura/spec.md), implementada localmente em 08/10/2026; não aciona o provedor | Seletor de outras edições somente após validação/migração |

O contrato abaixo documenta a fonte de importação. Não é uma lista de chamadas que a tela deve executar. A revisão de hoje consultou os READMEs oficiais; não repetiu a importação nem os testes de endpoints de 04/10.

O [site indicado](https://abibliadigital.api.br) aponta para a
[documentação oficial](https://github.com/omarcoscardoso/abibliadigital-api-br).
Esse projeto dá continuidade ao anterior; a referência histórica ao encerramento
do domínio `.com.br` não descreve a disponibilidade do novo `.api.br`.

## Contrato documentado da fonte

Base: `https://abibliadigital.api.br/api/`.

| Método | Caminho | Uso |
|---|---|---|
| GET | `check` | Saúde |
| GET | `books` e `books/:abbrev` | Catálogo e detalhes |
| GET | `versions` | Versões disponíveis |
| GET | `verses/:version/:abbrev/:chapter` | Capítulo |
| GET | `verses/:version/:abbrev/:chapter/:number` | Versículo |
| POST | `verses/search` | Busca; corpo com `version` e `search` |

A apresentação menciona 26 versões, mas a descrição de `versions` menciona 19.
O usuário escolheu **AA** e informou ter conferido sua presença no Swagger; o
README também a lista. O identificador `aa` foi confirmado na importação de
04/10/2026, registrada abaixo. A identificação editorial exata continua pendente;
divergências de quantidade no README não devem substituir as contagens verificadas.

## Levantamento inicial — histórico anterior à importação

O site e o README foram consultados. A ferramenta de pesquisa não conseguiu
acessar `check` e `versions`; isso não comprova indisponibilidade da API.
Não foram validados payloads reais, autenticação, cotas ou comportamento de erros.
O README consultado não detalha token obrigatório nem limites de requisição.
A licença de software informada não esclarece as condições de cópia de cada edição.

## Pendências vigentes

- Registrar edição AA e condições de redistribuição com o contato do usuário, antes da publicação.
- Na migração do corpus, validar hash, contagens e geração atômica a partir da cópia congelada; não depender de novo download externo.
- Para cada edição candidata, fixar arquivo, tag/commit, hash e condições de uso antes de habilitá-la. Uma indicação no README de terceiros não substitui esse registro.

Importação, normalização e consumo local já foram implementados. Regras e validações permanecem em backend/domain. Concorrência, cache e carregamento dos vizinhos foram implementados pela spec 009 em 08/10/2026; suas diretrizes estão no [plano do corpus, §5](bible-corpus-plan.md#5-configurações-de-leitura). A migração do corpus continua proposta separada.

O levantamento inicial não importou conteúdo. A implementação local subsequente,
autorizada pelo usuário em 04/10/2026, está registrada abaixo. Não houve criação
de conta ou contato com terceiros.

## Importação local executada — 04/10/2026

- Fonte: [arquivo AA no repositório oficial](https://github.com/omarcoscardoso/abibliadigital-api-br/blob/97f6803414d9aa0de570f11ffea9d46e7aff9df6/data/json/pt_aa.json).
- Commit: `97f6803414d9aa0de570f11ffea9d46e7aff9df6`.
- SHA256 do texto JSON sem BOM: `7be3e6409ea1f042f9fc4b6a7c38b5e153e524a0794bd16bd99082d89b4fd496`.
- API `versions` confirmou `aa` com 31.104 versículos. SQLite importou 66 livros,
  1.189 capítulos e 31.104 versículos. Base medida: aproximadamente 8,99 MB
  naquele momento; WAL/SHM e crescimento de dados não entram nessa medida.
- GETs públicos funcionaram sem token nesta verificação. Isso não estabelece cota
  ilimitada, SLA ou ausência futura de autenticação.
- Dez referências coincidiram exatamente com a API: Gn 1:1; Ex 3:14; Sl 23:1;
  Pv 3:5; Is 40:31; Mt 5:9; Jo 3:16; Rm 8:28; Tt 3:15; Ap 22:21.
- Normalizações explícitas do próprio provedor: `jó` → `job`, `atos` → `at`.
  O catálogo informa 2 capítulos para Tito e 4 para Filemom; o corpus AA tem 3
  e 1. O importador valida os capítulos reais e mantém esses dois casos documentados.
- Importação manual atômica e idempotente. Falha valida/aborta; a versão anterior
  permanece intacta. Nenhuma requisição externa ocorre durante leitura/busca.

Identificação editorial exata e condições para redistribuição pública continuam
na etapa posterior de publicação. Não inferir autorização pública pela licença de software.

A proposta de 07/10/2026 para congelar a fonte também no processo de preparação, separar o corpus do banco de contas e entregar pacotes offline está no [plano do corpus bíblico](bible-corpus-plan.md). Essa migração ainda não está implementada. A ausência de chamadas externas durante leitura/busca já é comportamento atual; não deve ser anunciada como novidade da migração.

## Configurações e desempenho

Tema e tamanho da fonte alteram somente a apresentação. Trocar o modo de leitura reutiliza capítulos disponíveis e solicita apenas vizinhos ausentes à nossa própria fonte local. Prefetch não chama `books`, `verses` ou `search` da ABíbliaDigital, não refaz importação e não consulta o servidor repetidamente quando o usuário permanece no mesmo capítulo.

A primeira entrega de configurações mantém AA. A lista de edições do plano do corpus é uma proposta posterior; não anuncia traduções já instaladas. O README de [damarals/biblias](https://github.com/damarals/biblias), consultado em 07/10/2026, identifica três candidatas com †; sua classificação e a rastreabilidade de cada arquivo devem ser verificadas antes de distribuição.

# Fonte bíblica — ABíbliaDigital

**Consulta:** 04/10/2026. **Escolha do provedor:** feita pelo usuário.

O [site indicado](https://abibliadigital.api.br) aponta para a
[documentação oficial](https://github.com/omarcoscardoso/abibliadigital-api-br).
Esse projeto dá continuidade ao anterior; a referência histórica ao encerramento
do domínio `.com.br` não descreve a disponibilidade do novo `.api.br`.

## Contrato documentado

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
Validar o catálogo real na integração. O usuário escolheu **AA** e informou ter
conferido sua presença no Swagger; o README também a lista. Registrar a edição
exata e confirmar o identificador `aa` na resposta real antes da importação.

## Verificação inicial da documentação

O site e o README foram consultados. A ferramenta de pesquisa não conseguiu
acessar `check` e `versions`; isso não comprova indisponibilidade da API.
Não foram validados payloads reais, autenticação, cotas ou comportamento de erros.
O README consultado não detalha token obrigatório nem limites de requisição.
A licença de software informada não esclarece as condições de cópia de cada edição.

## Pendências para o nosso plano

- Registrar edição AA e condições aplicáveis com o contato do usuário.
- Detalhar importação de AA para o banco, opção confirmada pelo usuário.
- Validar respostas, identificadores e erros antes de escrever o adaptador.
- Definir limites de concorrência, timeout, retomada e tratamento de indisponibilidade.
- Manter integração e validação em backend/domain, conforme a arquitetura do projeto.

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

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

## Limites desta verificação

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

Não houve importação de conteúdo, criação de conta ou contato com terceiros.

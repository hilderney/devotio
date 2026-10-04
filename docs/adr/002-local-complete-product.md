# ADR 002 — Três áreas locais antes da publicação

**Data:** 04/10/2026. **Status:** decisão do usuário registrada.

## Decisão

Concluir primeiro a versão web local com Devocional, leitura bíblica e Comunidades.
Retomar o planejamento de publicação somente depois desse marco. A ABíbliaDigital,
em `https://abibliadigital.api.br`, é a fonte escolhida para a integração bíblica.

## Efeito no escopo

A restrição anterior da constituição §VIII é atualizada para permitir as três
áreas neste ciclo local. Isso não antecipa clubes, anotações bíblicas, diário,
gamificação ou aplicativo nativo. Requisitos ainda em rascunho seguem sujeitos à
aprovação da respectiva spec antes de implementar.

O marco local exige dados persistentes e verificação das regras no backend;
a prévia efêmera atual não comprova produto completo. O modo de executar o backend
de desenvolvimento e a homologação de identidade ainda devem ser detalhados;
“local” não significa automaticamente operação integral sem internet.

Na continuação de 04/10/2026, o usuário confirmou importação para o nosso banco
e versão inicial **AA**. Isso preserva o modelo da spec 003: leitura pelo backend,
sem consultar o provedor durante a leitura. Identificação exata da edição e
condições de importação serão registradas na integração. Demais pendências estão
no [plano do produto](../product/development-plan.md).

## Publicação posterior

Preservar Pages + Convex e as decisões de ambiente da spec 005 como referência
para a próxima etapa. Não criar contas, contratar serviços, publicar ou iniciar
convites como parte deste marco. Retomar as condições de operação gratuita,
OAuth público e homologação quando o produto local estiver validado.

## Aceite do marco local

- Devocional: janela recente, favoritos privados e processo editorial conforme 001.
- Bíblia: livros, capítulos, versículos e busca conforme revisão aprovada da 003.
- Comunidades: convite, membros, mural e listas conforme 002/004.
- Integração: navegação, persistência após recarga, isolamento entre usuários,
  estados de rede e acessibilidade verificados com evidências nas tasks.
- Mobile permanece adiado; nenhuma task nativa é considerada concluída.

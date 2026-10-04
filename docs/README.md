# Documentação do Devotio

**Revisão:** 02/10/2026. A leitura é organizada por decisão, separando intenção de produto de capacidades implementadas.

## Produto

- [Constituição](constitution.md): princípios permanentes; alterações exigem ADR.
- [Visão e MVP](product/vision.md): público, proposta, escopo e critérios de sucesso.
- [Roadmap](product/roadmap.md): etapas, dependências e decisões pendentes.
- [Plano do produto completo](product/development-plan.md): levantamento de Devocional, Bíblia e Comunidades; decisões e dependências para aprovação.
- [Catálogo de specs](../specs/README.md): contratos de cada funcionalidade.

## Design

- [Experiência e sistema visual](design/experience.md): navegação, telas, tokens, conteúdo, acessibilidade e avaliação de usabilidade.

## Engenharia

- [Stack](engineering/stack.md): escolha por camada; existente versus planejado.
- [Arquitetura](architecture.md): fronteiras, fluxos, permissões e modelo de dados.
- [Estado real](engineering/status.md): evidências no repositório e bloqueios.
- [Fonte bíblica](engineering/bible-provider.md): documentação da ABíbliaDigital e pendências da integração.
- [Desenvolvimento](engineering/development.md): instalação, comandos e validação.

## Operação

- [Lançamento gratuito](operations/free-launch.md): fornecedores, cotas e capacidade.
- [Publicação e operação](operations/release.md): checklist, deploy e recuperação.
- [Conteúdo e privacidade](operations/content-privacy.md): revisão humana, licenças e dados.

## Decisões

- [ADR 001 — Web primeiro e stack do piloto](adr/001-web-first-free-launch.md).
- [ADR 002 — Três áreas locais antes da publicação](adr/002-local-complete-product.md).

## Como manter os documentos

| Informação | Fonte de verdade | Responsável pela revisão |
|---|---|---|
| Princípios | Constituição | Produto / liderança pastoral |
| Comportamento e visibilidade | Spec aprovada | Produto / responsável da feature |
| Decisão técnica transversal | ADR + stack + arquitetura | Engenharia |
| Aparência e interação | Guia de experiência | Design |
| Implementação disponível | Código + evidência de validação | Engenharia |
| Conclusão da entrega | Tasks + evidência do aceite | Responsável da feature |
| Preços e limites | Custos + fonte oficial datada | Operação |

Uma proposta não substitui uma spec aprovada. Em caso de conflito, registre a divergência e atualize a spec antes de implementar o novo comportamento. Arquivos existentes e checkboxes antigos não comprovam entrega.

Manter os caminhos `docs/constitution.md`, `docs/architecture.md` e IDs das specs estáveis. Novos documentos entram neste índice. Valores de serviços exigem data e fonte; não são promessas permanentes.

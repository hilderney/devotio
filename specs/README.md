# Catálogo de especificações

Requisitos aprovados orientam código; planos orientam implementação; tasks registram evidência. **Aprovação de spec não significa funcionalidade concluída.**

| ID | Feature | Situação | Papel no lançamento |
|---|---|---|---|
| [001](001-devocional-diario/spec.md) | Devocional diário | Spec aprovada historicamente; integração e aceites pendentes | Núcleo da v1 |
| [002](002-comunidade-v1/spec.md) | Comunidade base | Spec aprovada historicamente; integração e divergências pendentes | Núcleo da v1 |
| [003](003-conteudo-biblico/spec.md) | Importação e leitura bíblica | ABíbliaDigital, importação para o banco e AA inicial escolhidas | Integra o marco local das três áreas; spec em revisão |
| [004](004-fundacao-lancamento/spec.md) | Fundação do lançamento web | Reconstrução autorizada e implementada localmente; homologação pendente | Auth, operação editorial, instalação e condições do piloto |
| [005](005-piloto-publicacao/spec.md) | Publicação do piloto gratuito | Rascunho; escolhas anteriores preservadas | Planejamento retomado após o produto local completo, conforme ADR 002 |

[Roadmap](../docs/product/roadmap.md) determina a ordem proposta. A [ADR 001](../docs/adr/001-web-first-free-launch.md) registra distribuição web primeiro; tasks nativas permanecem abertas e adiadas.

## Navegação

- 001: [spec](001-devocional-diario/spec.md), [plano](001-devocional-diario/plan.md), [tasks](001-devocional-diario/tasks.md).
- 002: [spec](002-comunidade-v1/spec.md), [plano](002-comunidade-v1/plan.md), [tasks](002-comunidade-v1/tasks.md).
- 003: [spec](003-conteudo-biblico/spec.md), [plano em rascunho](003-conteudo-biblico/plan.md), [tasks](003-conteudo-biblico/tasks.md).
- 004: [spec](004-fundacao-lancamento/spec.md), [plano](004-fundacao-lancamento/plan.md), [tasks](004-fundacao-lancamento/tasks.md).
- 005: [spec](005-piloto-publicacao/spec.md), [plano](005-piloto-publicacao/plan.md), [tasks](005-piloto-publicacao/tasks.md).

## Convenções

Estados: rascunho → aprovada → em desenvolvimento → concluída. Registrar data, responsável pela aprovação e escopo da revisão; não inventar aprovação retroativa. Reabrir task quando a evidência não satisfizer o aceite, preservando uma nota sobre a marcação anterior.

Usar os [templates de spec](_templates/spec-template.md), [plano](_templates/plan-template.md) e [tasks](_templates/tasks-template.md). Uma mudança de visibilidade exige revisão explícita da spec, mesmo que tecnicamente pequena.

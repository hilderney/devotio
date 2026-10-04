# Arquitetura

**Atualização: 03/10/2026.** Base web implementada; deployment e OAuth reais pendentes. Ver [status](engineering/status.md) e [ADR 001](adr/001-web-first-free-launch.md).

## Fronteiras

Pages (destino) entrega apps/web, uma SPA/PWA. A apresentação consome domain/react e domain/convex. Convex executa identidade, autorização e transações. domain/core reúne contratos, Zod e regras puras; ui-kit fornece tokens. Expo permanece reservado.

Domain não importa DOM/React Native. Backend importa apenas domain/core. server.ts usa builders oficiais tipados com DataModel derivado do schema; não é arquivo gerado nem stub. Referências do client ficam em domain/convex e são exercitadas pelos testes contra as funções reais no convex-test.

## Fluxos

Leitura resolve sessão, calcula data local e consulta by_date. Conteúdo só aparece se não retirado e publishedAt atingido. Data é reavaliada periodicamente e ao retornar ao primeiro plano. O scheduler invalida subscriptions no instante da liberação.

Auth usa Better Auth/Google no Convex, plugins crossDomain e provider oficial. Segredos ficam no servidor. Editorial usa funções internas com reviewedBy humano, licença, motivo e auditoria. Liderança de comunidade não equivale a editor global.

Toda consulta/operação comunitária verifica associação. Mural usa páginas de 50 por cursor. Ticks expressam estado desejado, derivam usuário da sessão e têm contagem apenas de membros atuais. Criar/entrar em grupo verifica unicidade transacional.

## Permissões

| Recurso | Leitura | Escrita |
|---|---|---|
| Devocional/temas | Autenticado, conteúdo liberado | Operação editorial interna |
| Grupo/mural/listas/membros | Associado ao grupo | Liderança do próprio grupo |
| Tick | Próprio estado e agregado | Próprio usuário |
| Convite | Nome para autenticado com código | Entrada transacional |

Membros não recebem emails ou autores dos ticks. Contagens pequenas podem permitir inferências. IDs relacionados são conferidos dentro do grupo. O último administrador não pode ser removido. Não existe bypass de auth no backend.

## Modelo de Dados

[Schema v1](../packages/backend/schema.ts):

| Tabela | Responsabilidade | Índices |
|---|---|---|
| users | authId, name, email | by_authId |
| devotionals | date, reference, translation, scripture, reflection, prayerSuggestion, credit, licenseEvidence, reviewedBy, publishedAt, audioUrl opcional, withdrawn, updatedAt | by_date |
| editorialEvents | devotionalId, actor, reason, action, at | by_devotional |
| globalSettings | Singleton main com temas e referências | by_key |
| communities | Nome, descrição, escritura, convite, criação | by_invite |
| communityMembers | Usuário, grupo, papel admin/member | by_user, by_community, by_pair |
| communityMessages | Grupo, autor, conteúdo, instante | by_community_time |
| checklists | Grupo e nome | by_community |
| checklistItems | Lista, texto, ordem | by_checklist |
| checklistTicks | Item e usuário | by_item, by_pair |

Índice não impõe unicidade sozinho: as operações consultam e alteram na mesma transação. Auth mantém tabelas no componente Better Auth. editorialEvents foi introduzida pela spec 004 para rastreabilidade, sem telemetria de leitores.

Bíblia completa, clubes, orações privadas e marcações futuras não integram o schema reconstruído. A mudança foi local; não migrar deployment existente sem plano próprio.

## Cache e plataformas

PWA precacheia shell/fontes, sem runtime cache de Convex, sessão, áudio ou dados pessoais. Conteúdo autenticado exige rede. Player HTML5 permanece no shell durante navegação, sem autoplay.

Expo reutilizará regras/contratos/tokens com apresentação própria. OAuth, áudio, instalação e atualização precisam de testes físicos antes do piloto. Listas e membros ainda carregam o grupo inteiro: manter o piloto pequeno.

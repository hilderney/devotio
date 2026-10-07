# Arquitetura

**Atualização: 03/10/2026.** Base web implementada; deployment e OAuth reais pendentes. Ver [status](engineering/status.md) e [ADR 001](adr/001-web-first-free-launch.md).

**Extensão local de 04/10/2026:** [ADR 003](adr/003-local-sqlite-mock.md) e
[spec 006](../specs/006-desenvolvimento-local/spec.md) adicionam backend SQLite
apenas em desenvolvimento. Web → domain/local → HTTP local → backend/local → SQLite.
As fronteiras de regras e autorização continuam no backend/domain. A descrição
Convex abaixo continua sendo o caminho de produção, ainda não homologado.

## Fronteiras

Pages (destino) entrega apps/web, uma SPA/PWA. A apresentação consome domain/react e domain/convex. Convex executa identidade, autorização e transações. domain/core reúne contratos, Zod e regras puras; ui-kit fornece tokens. Expo permanece reservado.

Domain não importa DOM/React Native. Backend importa apenas domain/core. server.ts usa builders oficiais tipados com DataModel derivado do schema; não é arquivo gerado nem stub. Referências do client ficam em domain/convex e são exercitadas pelos testes contra as funções reais no convex-test.

## Fluxos

Na web, a raiz apresenta páginas públicas e estados de carregamento/offline. Um
layout de leitura sem caminho agrupa as rotas de produto e seu RepositoryProvider.
O redirecionamento de acesso usa o destino do match apresentado, com efeito estável;
uma página pública pode concluir sua navegação sem depender da localização anterior.
Devocional, Bíblia e Comunidades compartilham o shell e o player nesse layout.

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

### Modelo SQLite do desenvolvimento (spec 006)

O schema está em `packages/backend/local/database.local.ts`, versão 1. Não são tabelas
adicionadas ao deployment Convex; seu schema permanece inalterado nesta entrega.

| Tabelas locais | Responsabilidade / unicidade |
|---|---|
| users, sessions | Perfis fictícios; token opaco, expiração, revogação |
| communities, members | Grupos; código único; associação única grupo/usuário |
| messages | Mural; cursor por sequência, índice grupo/seq |
| checklists, items, ticks | Listas e ordem; tick único item/usuário |
| devotionals, audit | Publicação única por data, revisão/retirada e trilha editorial |
| favorites | Snapshot JSON privado único usuário/data, sem dependência de retenção do original |
| bibleBooks, bibleVerses, bibleSearch | AA; chave natural livro/capítulo/versículo; FTS5; importação atômica |
| metadata | Versão do seed, fonte, commit, hash e instante da importação |

Transações SQLite e validações Zod protegem todas as escritas. Sessão/associação
são verificadas no servidor; dados não são confiados ao papel enviado pelo client.
O header de conta esperada impede respostas de outra conta após troca de cookie
em outra aba. Banco e arquivos de origem não são servidos pelo Vite nem incluídos
no Git/build. FTS5 retorna até 40 resultados por página; mural até 50.
Módulos locais usam o sufixo `.local.ts`, excluído dos entry points pelo CLI Convex
instalado (arquivos com múltiplos pontos); nenhum módulo Convex os importa.

## Cache e plataformas

PWA precacheia shell/fontes, sem runtime cache de Convex, sessão, áudio ou dados pessoais. Conteúdo autenticado exige rede. Player HTML5 permanece no shell durante navegação, sem autoplay.

No modo local 006 (revisão autorizada em 05/10/2026), `domain/local` mantém cache
validado/versionado por usuário: janela de oito devocionais, snapshots favoritos,
catálogo AA e LRU dos seis capítulos mais recentemente acessados. O adaptador web
persiste via localStorage, separado do service worker. Lote `devotionals` recebe
até oito datas validadas com Zod e autorizadas pela janela calculada no servidor.
Na troca de dia, somente datas ausentes são transferidas; datas antigas são
removidas. Assinaturas simultâneas compartilham resultados e requisições em voo.

Não há polling HTTP. Mutações invalidam a área afetada; comunidades ficam apenas
em memória enquanto observadas e são consultadas novamente ao entrar. Atualização
manual busca a janela inteira e leituras dinâmicas abertas; Bíblia fixa reutiliza
cache. Correções editoriais em outro dispositivo exigem atualização manual.
Cookie opaco dura 30 dias, com expiração/revogação no SQLite e validação uma vez
ao abrir. Eventos de storage propagam logout/troca entre abas; timer lê somente
o relógio local. Requisições reais continuam validando identidade no servidor.

Cache sobrevive a desmontagem/recarga e é limpo no logout/troca/expiração. Leitura
offline só em sessão já aberta; reabrir exige validá-la no servidor. Sem escrita
offline e sem áudio baixado. Falha de armazenamento usa memória e mostra aviso.
Não houve alteração de tabelas nesta revisão de cache.

Expo reutilizará regras/contratos/tokens com apresentação própria. OAuth, áudio, instalação e atualização precisam de testes físicos antes do piloto. Listas e membros ainda carregam o grupo inteiro: manter o piloto pequeno.

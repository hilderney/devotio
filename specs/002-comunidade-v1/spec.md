# Spec: Comunidade (v1 — funcionalidades base)

**ID:** 002-comunidade-v1
**Status:** aprovada
**Versão alvo:** v1 (lançamento)

## 1. Contexto e problema

Usuários de uma mesma igreja/comunidade precisam de um espaço de edificação mútua
sob supervisão pastoral, sem virar uma rede social genérica. O AG (pastor/líder)
precisa de controle direto sobre quem entra e o que é comunicado ao grupo.

## 2. Papéis envolvidos

- **AG (Administrador Geral)**: cria a comunidade, gerencia membros, define a
  escritura da comunidade, publica mensagens no mural, cria listas.
- **Membro**: participa da comunidade, lê o mural e a escritura fixada, marca itens
  das listas ("tica" seu próprio progresso).

Clubes e AC (Administrador de Clube) são v2 — **fora de escopo desta spec**, ver §7.

## 3. Histórias de usuário

- Como AG, eu quero criar uma comunidade, para reunir os membros da minha
  igreja/grupo em um espaço próprio.
- Como AG, eu quero fixar um versículo/tema que guie espiritualmente a comunidade,
  para dar direção comum ao grupo.
- Como AG, eu quero enviar mensagens para todos os membros, para comunicar avisos
  pastorais e convocações de oração.
- Como AG, eu quero adicionar e remover membros, para manter a comunidade composta
  só por quem deve estar nela.
- Como AG, eu quero criar uma lista de itens para a comunidade "ticar" (motivos de
  oração, desafio de leitura), para acompanhar metas coletivas.
- Como membro, eu quero ver a escritura fixada e o mural de mensagens do AG, para
  me manter alinhado espiritualmente com o grupo.
- Como membro, eu quero marcar meu próprio progresso em uma lista compartilhada,
  sem que isso apague ou altere o progresso de outra pessoa.

## 4. Requisitos funcionais

1. O sistema deve permitir que um usuário crie uma `community`, tornando-se
   automaticamente `admin` (AG) dela via `communityMembers`.
2. O sistema deve permitir que o AG edite o campo `scripture` da comunidade a
   qualquer momento.
3. O sistema deve permitir que o AG envie mensagens (`communityMessages`) visíveis
   a todos os membros da comunidade, em ordem cronológica.
4. O sistema deve impedir que um membro comum (role `member`) envie mensagens no
   mural — apenas leitura.
5. O sistema deve permitir que o AG adicione um usuário existente como membro
   (`communityMembers`, role `member`) e remova qualquer membro, exceto a si mesmo
   se for o único admin (não pode deixar a comunidade órfã de AG).
6. O sistema deve permitir que o AG crie uma `checklist` vinculada à comunidade
   (`communityId` preenchido, `clubId` vazio) com itens (`checklistItems`).
7. O sistema deve permitir que qualquer membro marque/desmarque (`checklistTicks`)
   um item para si mesmo, sem afetar o tick de outro usuário no mesmo item.
8. O sistema deve exibir, para cada item de checklist, quantos membros já
   marcaram (contagem agregada), sem expor a lista nominal de quem marcou (ver
   §6 — privacidade de progresso individual).

## 5. Requisitos não-funcionais

- Um usuário pode pertencer a mais de uma comunidade (o schema já suporta via
  `communityMembers` indexado por `userId`).
- Ações de gestão (adicionar/remover membro, editar escritura, criar lista) devem
  ser instantaneamente refletidas para todos os membros conectados, aproveitando a
  reatividade do Convex — sem necessidade de "puxar para atualizar".

## 6. Regras de visibilidade/permissão

| Papel | Pode ver | Pode criar | Pode editar/remover |
|---|---|---|---|
| AG | Escritura, mural, membros, listas, contagem agregada de ticks | Comunidade, mensagens, listas/itens | Escritura, membros (adicionar/remover), mensagens próprias |
| Membro | Escritura, mural, lista de membros (nomes), listas/itens, contagem agregada de ticks | Seu próprio tick em cada item | Seu próprio tick (marcar/desmarcar) |

Decisão explícita de privacidade: **quem marcou o quê em uma checklist não é
exposto nominalmente a outros membros** — apenas a contagem agregada. Isso evita
constranger alguém que não orou ou não leu o capítulo daquela semana (alinhado à
constituição §V).

## 7. Fora de escopo

- Clubes/subgrupos e AC (v2 — spec própria quando priorizada).
- Edição/remoção de mensagens do mural após o envio.
- Notificação push quando o AG publica no mural (v2, ver `architecture.md §3`).
- Transferência de papel de AG para outro usuário (v1 assume que o criador
  permanece AG; mecanismo de sucessão fica para depois se necessário).

## 8. Dados envolvidos

- `communities`, `communityMembers` — leitura/escrita.
- `communityMessages` — leitura/escrita (escrita só por AG).
- `checklists`, `checklistItems`, `checklistTicks` — leitura/escrita, com
  `communityId` preenchido e `clubId` sempre vazio nesta spec.

## 9. Perguntas em aberto

- Como um AG "adiciona um usuário existente"? Precisa de busca por e-mail/nome, ou
  o fluxo v1 é só por convite (link/código)? Recomendação: convite por código simples
  para v1 (menor superfície de busca de usuários por terceiros), busca fica para v2 —
  confirmar com o dono do produto antes do `plan.md`.

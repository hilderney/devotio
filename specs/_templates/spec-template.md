# Spec: [Nome da Feature]

**ID:** NNN-nome-curto
**Status:** rascunho | aprovada | em desenvolvimento | concluída
**Versão alvo:** v1 | v2 | v3

## 1. Contexto e problema

O quê estamos resolvendo, para quem, e por quê agora. Sem menção a tecnologia.

## 2. Papéis envolvidos

Quais papéis (AG, AC, membro, usuário sem comunidade) interagem com esta feature e
o que cada um pode fazer. Se a feature não toca em permissão, diga explicitamente
"sem diferenciação de papel".

## 3. Histórias de usuário

- Como [papel], eu quero [ação], para que [resultado].
- ...

## 4. Requisitos funcionais

1. O sistema deve...
2. O sistema deve...

## 5. Requisitos não-funcionais

- Performance, privacidade, disponibilidade offline, etc. — só o que for relevante.

## 6. Regras de visibilidade/permissão

Preencher sempre, mesmo que a resposta seja "tudo privado por padrão" (constituição §IV/§V).

| Papel | Pode ver | Pode criar | Pode editar/remover |
|---|---|---|---|
| AG | | | |
| AC | | | |
| Membro | | | |

## 7. Fora de escopo

O que explicitamente NÃO está sendo construído nesta spec (evita scope creep de agente).

## 8. Dados envolvidos

Quais tabelas do schema (`packages/backend/schema.ts`) esta feature usa ou requer
alterar. Se precisa de tabela/campo novo, listar aqui — a alteração de schema em si
vai para o `plan.md`.

## 9. Perguntas em aberto

Qualquer decisão que precisa de dono humano antes do plano técnico.

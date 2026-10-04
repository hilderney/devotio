# Plano Técnico: Devocional Diário

> Revisão técnica de 02/10/2026: a base aprovada foi preservada, com correções documentais para a SPA atual. Ver [stack](../../docs/engineering/stack.md) e [estado real](../../docs/engineering/status.md). Integração e aceites não estão concluídos; nativo fica para etapa posterior.  
> **Revisão de 04/10/2026:** janela `[hoje−7, hoje]` e favoritos com snapshot (banco + JSON local) — spec §4 itens 11–13. Schema e funções abaixo ainda não implementados.

**Spec relacionada:** ./spec.md
**Status:** aprovado (delta 04/10/2026 em documentação; implementação pendente)

## 1. Impacto no schema (`packages/backend/schema.ts`)

- `globalSettings` e `devotionals` (`by_date`) permanecem para leitura da janela.
- **Nova tabela** `devotionalFavorites` (nome canônico):

| Campo | Tipo | Notas |
|---|---|---|
| `userId` | id de usuário / subject estável da auth | titular da cópia |
| `sourceDate` | string `YYYY-MM-DD` | data de origem do editorial |
| `scripture`, `reflection`, `prayerSuggestion` | string | snapshot no ato do favorito |
| `reference`, `credit` | string opcional | se existirem no original |
| `audioUrl` | string opcional | URL no momento do favorito; sem download de arquivo |
| `favoritedAt` | number (epoch ms) | |
| `sourceDevotionalId` | id opcional | auditoria; leitura do favorito **não** depende deste id |

Índices: `by_user` (`userId`), `by_user_sourceDate` (`userId`, `sourceDate`) único por par.  
Na implementação: atualizar também `docs/architecture.md § Modelo de Dados`.

## 2. Funções Convex necessárias

| Função | Tipo | Descrição | Quem pode chamar |
|---|---|---|---|
| `globalSettings.get` | query | singleton (monthlyVerse, weeklyVerse) ou `null` | autenticado |
| `devotionals.getByDate` | query | `date` na janela local; retorna devocional ou `null` | autenticado |
| `devotionalFavorites.listMine` | query | lista cópias do titular | autenticado (só as próprias) |
| `devotionalFavorites.add` | mutation | cria snapshot a partir do editorial da data (se na janela e publicado) | autenticado |
| `devotionalFavorites.remove` | mutation | remove cópia do titular por `sourceDate` ou id | autenticado (só a própria) |

`date` / `sourceDate` são **parâmetros** calculados no client a partir do timezone
local (`Intl.DateTimeFormat` / equivalente), nunca “hoje” implícito no servidor.

### Janela no servidor

- Validator Zod em `packages/domain`: data `YYYY-MM-DD` e pertencimento ao intervalo
  `[todayLocal − 7, todayLocal]` **usando o `todayLocal` enviado e validado** (ou
  equivalente acordado), rejeitando datas fora da janela em `getByDate` e em `add`.
- Não expor listagem global de datas editoriais além do necessário; a UI monta as
  oito datas locais e consulta por data.
- Sem endpoint de “buscar histórico” ou range aberto.

### Contrato de `devotionals.getByDate`

```ts
// args
{ date: string }  // /^\d{4}-\d{2}-\d{2}$/ + dentro da janela de 7 dias

// retorno (campos de leitura; alinhados ao schema editorial atual)
{
  scripture: string;
  reflection: string;
  audioUrl?: string;
  prayerSuggestion: string;
  reference?: string;
  credit?: string;
} | null
```

- Autenticação obrigatória no início da query/mutation.
- Duplicata por `date` no editorial: retornar o vigente mais recente e tratar como
  bug operacional (como já previsto).

### Contrato de favorito (snapshot)

```ts
// add: server carrega devotionals da sourceDate, copia campos, upsert por
// (userId, sourceDate). Falha se fora da janela ou sem publicação.
// listMine / remove: filtrar sempre por identidade do caller.
```

JSON local (web: `localStorage` ou equivalente; mobile: storage seguro do app):
estrutura tipada em `packages/domain`, espelho de `listMine`. Escrita local só
após sucesso da mutation; ao login/reconciliar, servidor vence.

## 3. Regras de negócio → `packages/domain`

- Util de datas: `todayLocalISODate` e helper de janela
  (`listLocalDatesInReadingWindow` / `isDateInReadingWindow`) com testes.
- Validators Zod para data, janela e payload de favorito.
- Hooks (entrypoints react): leitura do dia/seleção na janela; listagem e
  add/remove de favoritos; sincronização do espelho JSON sem lógica de permissão
  no app.
- Leitura do editorial na janela: qualquer autenticado. Favoritos: só o titular
  (checagem no Convex).

## 4. Impacto em `apps/web`

- Tela de leitura em `apps/web/src` (rota de devocional da SPA atual).
- Seletor sóbrio das datas da janela (hoje … hoje−7); sem calendário aberto nem
  input livre de data.
- Ação de favoritar/desfavoritar no dia com publicação; lista/acesso às cópias
  favoritadas (fora da janela só via essa lista).
- Player, vazio e skeleton como já previstos; textos em `packages/domain`.
- Espelho JSON local após mutations bem-sucedidas; limpar espelho no logout /
  troca de conta (alinhado à 004).
- SPA: queries só após sessão; sem SSR.

## 5. Impacto em `apps/mobile`

- Mesma janela e favoritos via hooks de domain; UI nativa separada (Expo adiado
  no piloto web-first — tasks mobile permanecem abertas).
- Recalcular `todayLocal` e a janela ao `AppState` → `active`.
- JSON local no storage do app; limpar na troca de conta.
- Áudio em background / lockscreen permanece como já planejado para quando o
  workspace mobile existir.

## 6. Riscos técnicos e decisões a validar

- Background audio no iOS — validar em device quando mobile voltar ao escopo.
- Áudio e egresso no piloto: [free-launch](../../docs/operations/free-launch.md).
- Cliente malicioso enviando `date` fora da janela: rejeição obrigatória no
  Convex (não confiar só na UI).
- Crescimento de `devotionalFavorites`: se cotas apertarem, definir teto por conta
  (pergunta em aberto na spec).
- Retirada editorial global não apaga snapshots; comunicar na política se
  necessário (conteúdo pessoal retido pelo titular).

## 7. Plano de testes

- Domain: `todayLocalISODate`, pertencimento à janela de 7 dias, virada de dia em
  ≥2 timezones.
- Domain: validators de favorito; regras de “só titular”.
- Backend (convex-test): `getByDate` rejeita fora da janela; `add` copia campos e
  nega outro usuário em `listMine`/`remove`; desfavoritar é idempotente.
- Manual web: navegar só nas oito datas; favoritar; sair da janela após virada e
  ainda ler a cópia; logout limpa JSON local; segundo usuário não vê favoritos
  alheios.
- Manual mobile (quando aplicável): áudio em background + mesma janela/favoritos.

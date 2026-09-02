# Tasks: Devocional Diário

**Plano relacionado:** ./plan.md

## Backend / Domain (`packages/backend`, `packages/domain`)

- [x] T1 — Implementar `globalSettings.get` (query) — critério: retorna o único
      documento da tabela ou `null` se ainda não configurado.
- [x] T2 — Implementar `devotionals.getByDate` (query, arg `date: v.string()`) —
      critério: usa índice `by_date`, retorna `null` se não encontrado, nunca lança
      erro por ausência de dado.
- [x] T3 — Criar `packages/domain/date/todayLocalISODate.ts` com testes cobrindo
      virada de dia em dois timezones.
- [x] T4 — Criar `useMonthlyAndWeeklyVerse` e `useDailyDevotional` em
      `packages/domain/hooks`.

## Web (`apps/web`)

- [x] T-W1 — Criar rota `devocional` (ou tela inicial) consumindo os hooks de T4.
- [x] T-W2 — Implementar `AudioPlayerWeb` com `<audio>` nativo, sem carregar áudio
      antes do texto renderizar.
- [x] T-W3 — Implementar `EmptyDevotionalState` para quando não há devocional do
      dia.

## Mobile (`apps/mobile`)

- [x] T-M1 — Criar tela inicial consumindo os mesmos hooks de T4.
- [x] T-M2 — Implementar `AudioPlayerMobile` com `expo-av` + configuração de
      `UIBackgroundModes: audio` no `app.json`.
- [ ] T-M3 — Validar em device físico iOS e Android que o áudio toca em background
      e aparece nos controles de mídia do sistema.

## Cross-cutting

- [x] Atualizar `docs/architecture.md` caso a decisão de background audio mude algo
      além do já documentado em §5.
- [x] Testes de `packages/domain` passando (T3, T4).
- [ ] Validação manual da virada de dia em dois timezones (web e mobile).
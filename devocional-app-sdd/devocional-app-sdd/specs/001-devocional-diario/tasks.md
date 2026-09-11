# Tasks: Devocional Diário

**Plano relacionado:** ./plan.md

## Backend / Domain (`packages/backend`, `packages/domain`)

- [ ] T1 — Implementar `globalSettings.get` (query).
      Critério de aceite: retorna o único documento da tabela ou `null` se ainda
      não configurado; verifica autenticação via `ctx.auth.getUserIdentity()` e
      lança erro se ausente.
- [ ] T2 — Implementar `devotionals.getByDate` (query, arg `date: v.string()`).
      Critério de aceite: usa índice `by_date`; retorna `null` se não encontrado
      (nunca lança erro por ausência de dado); valida formato `YYYY-MM-DD` com
      zod antes de consultar; verifica autenticação.
- [ ] T3 — Criar `packages/domain/date/todayLocalISODate.ts`.
      Critério de aceite: função pura (sem I/O), com testes cobrindo (a) virada de
      dia em pelo menos dois timezones diferentes, (b) horário de verão, se
      aplicável ao timezone testado, (c) formato de saída sempre `YYYY-MM-DD` com
      zero-padding.
- [ ] T4 — Criar `useMonthlyAndWeeklyVerse` e `useDailyDevotional` em
      `packages/domain/hooks`.
      Critério de aceite: `useDailyDevotional` expõe `{ data, isLoading, isEmpty,
      audioError, setAudioError }` (ou equivalente) para que os dois apps
      controlem o estado de erro de áudio de forma consistente; hook recalcula a
      query quando a data local muda (não apenas na montagem).
- [ ] T5 — Definir em `packages/domain/copy/devotionalMessages.ts` os textos fixos
      de estado vazio e de erro de áudio, usados por ambos os apps (evita
      divergência de texto entre plataformas).

## Web (`apps/web`)

- [ ] T-W1 — Criar rota `devocional` (ou tela inicial) consumindo os hooks de T4.
      Critério de aceite: `MonthlyVerseBanner`/`WeeklyVerseBanner` renderizam no
      servidor (SSR); demais blocos disparam a query só após hidratação.
- [ ] T-W2 — Implementar `AudioPlayerWeb` com `<audio>` nativo.
      Critério de aceite: sem `autoPlay`; player não é renderizado se `audioUrl`
      ausente; `onError` aciona o texto de erro de `devotionalMessages.ts`; áudio
      não recomeça ao trocar de rota e voltar, se tecnicamente viável.
- [ ] T-W3 — Implementar `EmptyDevotionalState` e skeleton de carregamento.
      Critério de aceite: skeleton tem altura aproximada do conteúdo final (sem
      layout shift perceptível ao trocar de loading para conteúdo).

## Mobile (`apps/mobile`)

- [ ] T-M1 — Criar tela inicial consumindo os mesmos hooks de T4.
      Critério de aceite: escuta `AppState` e recalcula `date` local ao voltar
      para `active`.
- [ ] T-M2 — Implementar `AudioPlayerMobile` com `expo-audio`.
      Critério de aceite: `app.json` configurado com `UIBackgroundModes: ["audio"]`
      no iOS; media controls exibem título "Devocional de [data]"; erro de
      carregamento aciona o mesmo texto de `devotionalMessages.ts`.
- [ ] T-M3 — Validar em device físico iOS e Android.
      Critério de aceite: áudio toca em background, aparece nos controles de
      mídia do sistema (lockscreen/central de controle), e sobrevive a
      minimizar/restaurar o app sem reiniciar do zero.

## Cross-cutting

- [ ] Atualizar `docs/architecture.md` caso a decisão de background audio mude algo
      além do já documentado em §5.
- [ ] Testes de `packages/domain` passando (T3, T4).
- [ ] Validação manual da virada de dia em dois timezones (web e mobile), incluindo
      o cenário de app aberto passando da meia-noite (T-W1/T-M1).
- [ ] Checar contraste AA dos blocos de tema do mês/semana e sugestão de oração
      (requisito não-funcional de acessibilidade da spec §5).

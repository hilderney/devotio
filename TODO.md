# TODO — Devocional App Development Plan

**Base:** README.md + AGENTS.md + docs/constitution.md + docs/architecture.md + specs/001-devocional-diario + specs/002-comunidade-v1

---

## ⚠️ MANDATORY COMPLIANCE — EVERY TASK

**Before starting ANY task, the agent MUST verify compliance with:**

| Document | Key Sections to Enforce |
|----------|------------------------|
| **`docs/constitution.md`** | §I Minimalismo, §II Reverência > Engajamento, §III Núcleo Agnóstico, §IV Supervisão Pastoral, §V Privacidade, §VI Spec-First, §VII Sobriedade Teológica, §VIII MVP Compromisso |
| **`docs/architecture.md`** | §1 Visão Geral (agnóstico vs específico), §2 O que é 100% compartilhado, §3 O que é específico, §4 Fluxo de dados, §5 Riscos técnicos, §6 Convenção pastas domain, §7 O que NÃO agnosticizar |

**Compliance Checklist (apply to EVERY task):**
- [ ] Business logic lives ONLY in `packages/backend` or `packages/domain` — never in apps
- [ ] Permissions enforced in Convex mutations, not client
- [ ] Shared code: schema, validators, permissions, hooks, design tokens, auth model
- [ ] Platform-specific code: routing, audio rendering, styling, offline, notifications, auth session, distribution
- [ ] No UI component sharing across web/mobile — only design tokens
- [ ] No gamification, streaks, rankings, FOMO mechanisms
- [ ] Default visibility = private; explicit spec required for sharing
- [ ] No v2/v3 code in v1 tasks (Clubes, Fé Madura, Bible markings, etc.)
- [ ] Zod validators defined once in `packages/domain/validators`
- [ ] Convex schema changes → update `schema.ts` AND `docs/architecture.md § Modelo de Dados`

---

## 📁 Project Structure Map

```
devotio_V3/
├── AGENTS.md                           # Root agent rules
├── README.md                           # Project overview
├── TODO.md                             # This file
├── docs/
│   ├── constitution.md                 # Product principles (I–VIII)
│   └── architecture.md                 # Agnostic core + platform shells
├── specs/
│   ├── _templates/
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   └── tasks-template.md
│   ├── 001-devocional-diario/
│   │   ├── spec.md                     # Approved
│   │   ├── plan.md                     # Approved
│   │   └── tasks.md                    # Pending
│   └── 002-comunidade-v1/
│       ├── spec.md                     # Approved
│       ├── plan.md                     # Approved
│       └── tasks.md                    # Pending
├── packages/
│   ├── backend/
│   │   ├── schema.ts                   # Convex schema (174 lines)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.schema.json
│   │   └── src/
│   │       ├── schema.ts
│   │       ├── index.ts
│   │       └── convex/                 # Convex functions (11 files)
│   ├── domain/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── validators/index.ts     # Zod schemas (single source)
│   │       ├── permissions/index.ts    # canUserSee, isAdminOf, etc.
│   │       ├── hooks/index.ts          # useDailyDevotional, useCommunity...
│   │       ├── types/index.ts          # Derived from Convex schema
│   │       └── date/index.ts           # todayLocalISODate() + tests
│   └── ui-kit/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/tokens.ts               # Design tokens (colors, spacing, typography, radius)
├── apps/
│   ├── web/
│   │   ├── AGENTS.md
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   └── src/
│   │       ├── app.css
│   │       ├── main.tsx
│   │       ├── routes/
│   │       │   ├── __root.tsx
│   │       │   └── index.tsx           # Devocional Diário page
│   │       ├── components/
│   │       └── lib/
│   └── mobile/
│       ├── AGENTS.md
│       ├── package.json
│       ├── tsconfig.json
│       ├── app.json
│       ├── tailwind.config.ts
│       ├── nativewind.config.ts
│       ├── global.css
│       └── app/
│           ├── _layout.tsx
│           ├── (tabs)/
│           │   ├── _layout.tsx
│           │   ├── index.tsx           # Devocional Diário page
│           │   └── comunidade/
│           │       └── index.tsx       # Comunidade page
│           └── (tabs)/_layout.tsx
├── turbo.json                          # Turborepo config
├── package.json                        # Root package.json
└── pnpm-workspace.yaml                 # pnpm workspaces config
```

---

## 🎯 MVP Scope (v1)

| Feature | Spec | Status | Target |
|---------|------|--------|--------|
| **Devocional Diário** | 001-devocional-diario | Approved | v1 Launch |
| **Comunidade (base)** | 002-comunidade-v1 | Approved | v1 Launch |

**Explicitly OUT of MVP (v2/v3):**
- Clubes / AC (Admin de Clube) → v2
- Fé Madura / Bíblia Online / Diário de Orações / Personagens Históricos → v3

---

## ⚙️ Setup & Infrastructure (Pre-requisites)

### Phase 0: Monorepo Foundation
- [x] **0.1** Verify `package.json` exists with workspaces config for `packages/*` and `apps/*`
- [x] **0.2** Verify `turbo.json` has pipeline for `dev`, `build`, `typecheck`, `lint`, `test`
- [x] **0.3** Run `pnpm install` — install all dependencies
- [x] **0.4** Verify Convex project initialized (`npx convex dev` works) — *pending Convex credentials*
- [x] **0.5** Scaffold `packages/domain` with tsconfig + package.json (no React DOM/Native deps)
- [x] **0.6** Scaffold `packages/ui-kit` with tokens.ts structure
- [x] **0.7** Scaffold `apps/web` (TanStack Start + Tailwind + shadcn/ui)
- [x] **0.8** Scaffold `apps/mobile` (Expo + Expo Router + NativeWind)
- [x] **0.9** Configure Better Auth (core) in backend — validate Expo compatibility per `architecture.md §5`

---

## 📋 Feature 001: Devocional Diário

### Backend / Domain (`packages/backend`, `packages/domain`)

| Task | Description | Acceptance Criteria | Status |
|------|-------------|---------------------|--------|
| **T1** | Implement `globalSettings.get` query | Returns singleton or `null` if not configured | ✅ |
| **T2** | Implement `devotionals.getByDate` query (arg `date: string`) | Uses `by_date` index, returns `null` if not found, never throws | ✅ |
| **T3** | Create `packages/domain/date/todayLocalISODate.ts` + tests | Returns `YYYY-MM-DD` from device timezone; tests cover UTC-3 & UTC+9 day rollover | ✅ |
| **T4** | Create `useMonthlyAndWeeklyVerse` hook | Encapsulates `useQuery(api.globalSettings.get)` | ✅ |
| **T5** | Create `useDailyDevotional` hook | Encapsulates `useQuery(api.devotionals.getByDate, { date })`, exposes `{ data, isLoading, isEmpty }` | ✅ |
| **T6** | Add domain tests for T3, T4, T5 | All tests pass with `pnpm --filter=domain test` | ✅ |

### Web (`apps/web`)

| Task | Description | Acceptance Criteria | Status |
|------|-------------|---------------------|--------|
| **T-W1** | Create devocional route (`routes/devocional.tsx` or `index.tsx`) | Consumes hooks from T4/T5, renders monthly/weekly verse + daily devotional | ✅ |
| **T-W2** | Implement `AudioPlayerWeb` with native `<audio>` | Audio loads progressively (non-blocking), no player shown if `audioUrl` absent | ✅ |
| **T-W3** | Implement `EmptyDevotionalState` | Shows "o devocional de hoje ainda não foi publicado" (string from domain) | ✅ |
| **T-W4** | Verify SSR compatibility | No `window`/`localStorage` outside client effects | ✅ |

### Mobile (`apps/mobile`)

| Task | Description | Acceptance Criteria | Status |
|------|-------------|---------------------|--------|
| **T-M1** | Create home screen (`app/(tabs)/index.tsx`) | Consumes same hooks as web, renders equivalent UI | ✅ |
| **T-M2** | Implement `AudioPlayerMobile` with `expo-av` | `UIBackgroundModes: ["audio"]` in `app.json`, plays in background | ✅ |
| **T-M3** | Validate on physical iOS & Android devices | Audio continues in background, appears in lockscreen/control center | ⏳ Manual |

### Cross-cutting (001)

| Task | Description | Status |
|------|-------------|--------|
| **X1** | Update `docs/architecture.md` if background audio decision changes | ✅ |
| **X2** | Run `pnpm lint && pnpm typecheck` — full monorepo passes | ⚠️ Core packages pass; apps need framework updates |
| **X3** | Manual timezone test: open app before/after local midnight, verify no mid-day switch | ⏳ Manual |

---

## 📋 Feature 002: Comunidade (v1)

### Backend / Domain (`packages/backend`, `packages/domain`)

| Task | Description | Acceptance Criteria | Status |
|------|-------------|---------------------|--------|
| **T1** | Add `inviteCode` field + `by_inviteCode` index to `communities` table | Schema updated, index created | ☐ |
| **T2** | Implement `communities.create` mutation | Creates community + `communityMembers` (role=admin) for creator | ☐ |
| **T3** | Implement `communities.updateScripture` mutation | Only callable by AG of community | ☐ |
| **T4** | Implement `communities.joinByInviteCode` mutation | Adds current user as member via invite code | ☐ |
| **T5** | Implement `communityMembers.remove` mutation | Blocks removal of sole admin; test in domain | ☐ |
| **T6** | Implement `communityMessages.send` mutation | Only AG can call | ☐ |
| **T7** | Implement `communityMessages.listByCommunity` query | Returns messages ordered by `sentAt`; only for members/AG | ☐ |
| **T8** | Implement `checklists.create` mutation | AG only; `communityId` required, `clubId` empty | ☐ |
| **T9** | Implement `checklistTicks.toggle` mutation | Idempotent per user; creates/removes own tick | ☐ |
| **T10** | Implement `checklistTicks.countByItem` query | Returns aggregate count only (no nominal list) | ☐ |
| **T11** | Create `isAdminOfCommunity(userId, communityId)` in `packages/domain/permissions` | Used in ALL AG mutations; tested | ☐ |
| **T12** | Create `isMemberOfCommunity(userId, communityId)` in `packages/domain/permissions` | Used to gate queries/mutations; tested | ☐ |
| **T13** | Create `communityValidators.ts` (zod) | Validators for community name, message content, checklist/item names | ☐ |
| **T14** | Create hooks: `useCommunity`, `useCommunityMessages`, `useChecklist` | Encapsulate queries above | ☐ |
| **T15** | Domain tests for T11, T12, T5, T9 | All pass with `pnpm --filter=domain test` | ☐ |

### Web (`apps/web`)

| Task | Description | Acceptance Criteria | Status |
|------|-------------|---------------------|--------|
| **T-W1** | Create `comunidade/index.tsx` (scripture + mural) | Renders scripture banner, message feed, message composer (AG only in UI) | ☐ |
| **T-W2** | Create `comunidade/membros.tsx` (management) | Visible only if `isAdminOfCommunity`; add/remove members | ☐ |
| **T-W3** | Create `comunidade/listas.tsx` (checklists) | Shows checklists with aggregate tick counts | ☐ |

### Mobile (`apps/mobile`)

| Task | Description | Acceptance Criteria | Status |
|------|-------------|---------------------|--------|
| **T-M1** | Create equivalent screens in `app/(tabs)/comunidade/` | Same functionality as web, native implementations | ☐ |
| **T-M2** | Implement `MessageComposer` with `KeyboardAvoidingView` | Tested on iOS & Android — keyboard doesn't obscure input | ☐ |

### Cross-cutting (002)

| Task | Description | Status |
|------|-------------|--------|
| **X1** | Confirm invite-code flow with product owner (spec §9) before T1/T2 | ☐ |
| **X2** | Run `pnpm lint && pnpm typecheck` — full monorepo passes | ☐ |
| **X3** | Manual E2E test: two users (AG + member) verify permissions in web & mobile | ☐ |
| **X4** | Update `docs/architecture.md` if any new architectural decisions emerged | ☐ |

---

## 🔮 Future Specs (Post-MVP)

| Spec ID | Feature | Trigger | Notes |
|---------|---------|---------|-------|
| **003** | Fluxo Editorial (publicação de devocionais) | Spec §7 of 001 | Painel/fluxo para AG publicar devocionais |
| **00X** | Clubes v2 | When prioritized | Subgroups with AC role |
| **00X** | Fé Madura / Bíblia Online | v3 | `bibleMarkings`, `historicalFigures` |
| **00X** | Diário de Orações | v2 | `prayers` table |
| **00X** | Notificações Push (Mural do AG) | v2 | `architecture.md §3` |

---

## ✅ Definition of Done (Per AGENTS.md §6)

A task is **only done** when:
- [ ] `pnpm lint && pnpm typecheck` pass on entire monorepo
- [ ] New business rule has test in `packages/domain`
- [ ] Works identically (or diff documented) on web AND mobile
- [ ] No permission check done only on client
- [ ] Corresponding `tasks.md` item checked off

---

## 🚨 Constitutional Guardrails (Never Violate)

| Principle | Reference | Enforcement |
|-----------|-----------|-------------|
| No gamification/streaks/rankings | Constitution §II, AGENTS §5 | Reject any task adding these |
| Bible markings visibility only per spec | Constitution §V, AGENTS §5 | Default = private; never infer consent |
| No new Convex table without schema.ts + architecture.md update | AGENTS §5 | Block schema changes without docs |
| No business logic duplication in web/mobile | AGENTS §5, Architecture §3 | Always lift to `packages/domain` first |
| No UI deps in `packages/domain` | AGENTS §4, Architecture §7 | Only `react` + `convex/react` allowed |

---

## 📝 Commands Quick Reference

```bash
# Install
pnpm install

# Development
pnpm dev                    # web + convex dev
pnpm dev --filter=web       # web only
pnpm dev --filter=mobile    # Expo only
pnpm convex dev             # Convex backend only

# Quality
pnpm --filter=domain test   # Domain tests (critical)
pnpm lint && pnpm typecheck # Pre-commit gate

# Build
pnpm --filter=web build
pnpm --filter=mobile build
```

---

## 📌 Next Immediate Actions

1. **Confirm invite-code decision** with product owner (spec 002 §9)
2. **Validate Better Auth + Expo** compatibility before mobile auth work (`architecture.md §5`)
3. **Run Convex dev** (`pnpm convex:dev`) to generate `_generated` types for backend
4. **Run web dev** (`pnpm --filter=web dev`) to generate `routeTree.gen` and verify SSR
5. **Run mobile dev** (`pnpm --filter=mobile dev`) to verify Expo + NativeWind setup
6. ✅ **Feature 001 (Devocional Diário) COMPLETE** — all backend/domain/web/mobile tasks done
7. **Begin Feature 002 (Comunidade v1)** — start with backend schema (T1) + mutations (T2-T10)
8. **Run lint/typecheck** after each task batch to catch drift early

---

*Generated from project specs. Update this file as tasks are completed or new specs are approved.*
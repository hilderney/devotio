# Devotio — Web App (`apps/web`)

> Casca de apresentação Web do projeto **Devotio**, construída para oferecer uma experiência devocional sóbria, contemplativa e livre de distrações, seguindo rigorosamente os princípios da Constituição do Projeto (`docs/constitution.md`) e da especificação de produto (`specs/001-devocional-diario`).

---

## 1. Visão Geral

O `apps/web` é uma interface de apresentação fina e agnóstica de lógica de negócio. Toda regra de validação, formatação de data, mensagens oficiais e busca de dados reside nos pacotes compartilhados:
- **`packages/domain`**: Tipos TypeScript puros, cálculo de data local (`todayLocalISODate`), validações Zod e hooks de dados reativos (`useDailyDevotional`, `useMonthlyAndWeeklyVerse`).
- **`packages/ui-kit`**: Design tokens compartilhados (paleta de cores sóbrias, tipografia Lora/Inter, espaçamentos e raios com contraste acessível AA).
- **`packages/backend`**: Funções Convex (`globalSettings.get`, `devotionals.getByDate`) com índices otimizados e proteção de autenticação.

---

## 2. Stack Tecnológica

- **Framework & Runtime:** React 19 + Vite (modo SPA / SSR-ready).
- **Estilização:** Tailwind CSS mapeado diretamente aos tokens de `packages/ui-kit`.
- **Tipografia:** Google Fonts — *Lora* (serifada, para versículos bíblicos e reflexão pastoral) e *Inter* (sans-serif, para elementos de interface).
- **Áudio:** `<audio>` nativo do HTML5, sem bibliotecas externas pesadas e sem autoplay.
- **Roteamento:** TanStack Router / estrutura modular em `app/routes`.

---

## 3. Estrutura de Diretórios

```
apps/web/
├── app/
│   ├── components/                 # Componentes de apresentação da tela devocional
│   │   ├── MonthlyVerseBanner.tsx  # Banner do versículo do mês (sticky no topo)
│   │   ├── WeeklyVerseBanner.tsx   # Banner do versículo da semana (secundário)
│   │   ├── DevotionalScripture.tsx # Texto bíblico corrido (sem paginação)
│   │   ├── DevotionalReflection.tsx# Reflexão pastoral na íntegra
│   │   ├── AudioPlayerWeb.tsx      # Player de áudio HTML5 resiliente
│   │   ├── PrayerSuggestionCard.tsx# Bloco diferenciado de sugestão de oração
│   │   ├── EmptyDevotionalState.tsx# Estado vazio sóbrio e acolhedor
│   │   └── DevotionalSkeleton.tsx  # Skeleton de carregamento proporcional (anti-CLS)
│   ├── routes/
│   │   └── devocional.tsx          # Tela principal integrando os hooks de domínio
│   ├── index.css                   # Tailwind e estilos globais
│   └── main.tsx                    # Ponto de entrada do cliente React
├── index.html                      # Template HTML com fontes Inter e Lora
├── package.json                    # Dependências e scripts do workspace web
├── tailwind.config.ts              # Mapeamento dos design tokens do ui-kit
├── tsconfig.json                   # Configuração do compilador TypeScript
└── vite.config.ts                  # Configuração do Vite com aliases para o monorepo
```

---

## 4. Como a Tela Devocional Funciona

A tela principal do devocional diário segue o fluxo:

1. **Tema do Mês (`MonthlyVerseBanner`):**
   - Exibe o versículo mensal configurado em `globalSettings.monthlyVerse`.
   - Possui posicionamento `sticky` no topo, permanecendo visível ao rolar a página para incentivar a meditação contínua ao longo de todo o mês.
   - Se ainda não houver versículo configurado, o bloco é omitido silenciosamente (sem placeholders vazios).

2. **Tema da Semana (`WeeklyVerseBanner`):**
   - Exibe o versículo semanal (`globalSettings.weeklyVerse`) logo abaixo do tema do mês.
   - Hierarquia visual secundária: menor destaque que o mês, maior destaque que o corpo.

3. **Data e Identificação:**
   - Exibe a data local do dispositivo calculada de forma pura via `todayLocalISODate()`.
   - O hook `useDailyDevotional` monitora a virada de data automaticamente (caso o app continue aberto passando da meia-noite).

4. **Player de Áudio (`AudioPlayerWeb`):**
   - Renderizado apenas quando `devotionals.audioUrl` estiver preenchido.
   - **Sem autoplay:** a reprodução nunca inicia sem ação explícita do usuário.
   - Caso o arquivo de áudio falhe ao carregar, exibe uma mensagem de erro discreta (*"Não foi possível carregar o áudio."*) sem quebrar o restante da leitura.

5. **Texto Bíblico (`DevotionalScripture`):**
   - Texto bíblico corrido (3 a 5 versículos), sem truncamento, sem botões de "leia mais" e sem paginação, priorizando a leitura imediata.

6. **Reflexão Pastoral (`DevotionalReflection`):**
   - Exibida na íntegra imediatamente após o texto sagrado, com tipografia serifada e espaçamento de linha confortável para leitura.

7. **Sugestão de Oração (`PrayerSuggestionCard`):**
   - Card com cor de fundo e borda diferenciadas (tons quentes de âmbar litúrgico), sinalizando que se trata de uma chamada à ação pessoal, e não de mero conteúdo de leitura.

8. **Tratamento de Estados:**
   - **Carregamento (`DevotionalSkeleton`):** Possui altura proporcional ao conteúdo final para evitar saltos visuais abruptos (*Cumulative Layout Shift*).
   - **Estado Vazio (`EmptyDevotionalState`):** Se a data ainda não possuir devocional publicado, exibe a mensagem institucional padronizada: *"O devocional de hoje ainda não foi publicado. Volte em breve."*, visualmente distinta do estado de carregamento.

---

## 5. Como Executar

A partir da raiz do monorepo:

```bash
# Instala as dependências de todos os pacotes
npm install

# Roda o servidor de desenvolvimento da Web (porta 3000)
npm run dev --workspace=web

# Executa a verificação estrita de tipos TypeScript
npm run typecheck --workspace=web

# Executa o build de produção
npm run build --workspace=web

# Pré-visualiza o build de produção localmente
npm run preview --workspace=web
```

---

## 6. Regras e Convenções do Projeto

Antes de alterar código neste pacote, lembre-se das diretrizes do repositório:
- **Zero Lógica de Negócio no Client:** Toda regra de cálculo, validação ou permissão pertence a `packages/domain` ou `packages/backend`. O `apps/web` apenas consome hooks e renderiza.
- **Tokens de Design Obrigatórios:** Utilize as classes mapeadas a partir de `packages/ui-kit/tokens.ts`. Não utilize valores arbitrários (`text-[#123456]`) sem necessidade justificada.
- **Reverência sobre Engajamento:** Não adicione contadores de sequência (*streaks*), badges, rankings ou gamificação na tela devocional (Constituição §II).

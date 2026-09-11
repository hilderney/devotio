/**
 * Design Tokens para o Devotio App
 * Fonte única de verdade de design tokens compartilhada entre Web e Mobile.
 * Consumido pelo Tailwind (web) e NativeWind (mobile).
 */

export const tokens = {
  colors: {
    // Fundo base e superfícies - Papel quente, calmo e sem ofuscar a visão
    background: {
      canvas: "#FBF9F5",      // Fundo principal do app (Warm Parchment)
      surface: "#FFFFFF",     // Cards e blocos de conteúdo
      muted: "#F3EFEA",       // Fundo secundário / sutil
      subtle: "#ECE6DE",      // Divisórias e bordas suaves
    },
    // Tipografia com alto contraste e sobriedade litúrgica
    text: {
      primary: "#1C1917",     // Stone 900 - Leitura principal, profundo
      secondary: "#57534E",   // Stone 600 - Subtítulos e metadados
      muted: "#78716C",       // Stone 500 - Textos auxiliares e referências
      inverse: "#FAFAF9",     // Texto sobre fundos escuros
    },
    // Banner e elementos de destaque
    primary: {
      DEFAULT: "#292524",     // Stone 800
      foreground: "#FAFAF9",
      accent: "#44403C",      // Stone 700
    },
    // Tema do Mês (Dignidade, destaque contínuo)
    monthlyVerse: {
      bg: "#2A2825",          // Obsidian quente
      text: "#F5F2EB",        // Texto claro de alto contraste
      reference: "#D6CEBF",   // Referência bíblica dourada/pálida
      border: "#3F3C37",
    },
    // Tema da Semana (Hierarquia secundária)
    weeklyVerse: {
      bg: "#F2EDE4",          // Bege suave
      text: "#292524",        // Texto escuro
      reference: "#78716C",
      border: "#E2D9CB",
    },
    // Card de Sugestão de Oração (Chamado à oração, quente e reverente)
    prayer: {
      bg: "#FBF5EC",          // Âmbar litúrgico suave
      border: "#E7DAC1",      // Borda acolhedora
      accent: "#8C6D3B",      // Dourado envelhecido
      text: "#2C261E",
      title: "#6B5023",
    },
    // Áudio player
    audio: {
      bg: "#F5F2EC",
      bar: "#D8CFBE",
      progress: "#292524",
      errorBg: "#FEF2F2",
      errorText: "#991B1B",
      errorBorder: "#F87171",
    },
    // Estados de UI e skeleton
    ui: {
      border: "#E5DFD5",
      skeleton: "#E9E3D8",
      skeletonHighlight: "#F5F0E7",
    },
  },
  typography: {
    fontFamily: {
      serif: '"Lora", "Merriweather", "Georgia", serif',
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      xs: "0.75rem",     // 12px
      sm: "0.875rem",    // 14px
      base: "1rem",      // 16px
      lg: "1.125rem",    // 18px
      xl: "1.25rem",     // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
  },
  radii: {
    none: "0px",
    sm: "0.25rem",   // 4px
    md: "0.5rem",    // 8px
    lg: "0.75rem",   // 12px
    xl: "1rem",      // 16px
    full: "9999px",
  },
} as const;

export type DesignTokens = typeof tokens;

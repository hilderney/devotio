import type { Config } from "tailwindcss";
import { tokens } from "ui-kit";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: tokens.colors.background.canvas,
        ink: tokens.colors.text.primary,
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;

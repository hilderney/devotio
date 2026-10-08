import React, { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { clientConfiguration } from "domain/core";
import { tokens } from "ui-kit";
import { App } from "./router";
import { PwaNotice } from "./pwa";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-400-italic.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "./styles.css";
const colors = tokens.colors;
const variables: Record<string, string> = {
  paper: colors.background.canvas,
  surface: colors.background.surface,
  wash: colors.background.muted,
  line: colors.ui.border,
  ink: colors.text.primary,
  muted: colors.text.secondary,
  quiet: colors.text.muted,
  dark: colors.primary.DEFAULT,
  inverse: colors.primary.foreground,
  gold: colors.prayer.title,
  prayer: colors.prayer.bg,
  "prayer-line": colors.prayer.border,
  error: colors.audio.errorText,
  "error-bg": colors.audio.errorBg,
  theme: colors.monthlyVerse.bg,
  "theme-ink": colors.monthlyVerse.text,
  "radius-control": tokens.radii.md,
};
Object.entries(variables).forEach(([key, value]) =>
  document.documentElement.style.setProperty("--" + key, value),
);
const root = createRoot(document.getElementById("root")!);
function render(content: ReactNode) {
  root.render(
    <React.StrictMode>
      {content}
      <PwaNotice />
    </React.StrictMode>,
  );
}
const configuration = clientConfiguration(
  import.meta.env.DEV,
  import.meta.env.VITE_CONVEX_URL,
  import.meta.env.VITE_CONVEX_SITE_URL,
);
if (configuration.mode === "live") {
  const { createLiveApp } = await import("./live-app");
  render(createLiveApp(configuration.url, configuration.site));
} else if (import.meta.env.DEV && configuration.mode === "preview") {
  const { LocalApp } = await import("./local-app");
  render(<LocalApp />);
} else {
  if (
    import.meta.env.DEV &&
    configuration.mode === "unavailable" &&
    configuration.reason === "invalid"
  ) {
    console.error(
      "Configuração Convex incompleta ou inválida. Confira VITE_CONVEX_URL e VITE_CONVEX_SITE_URL em apps/web/.env.local.",
    );
  }
  render(
    <App
      repository={null}
      configured={false}
      loading={false}
      userKey="guest"
      onLogin={async () => {
        throw new Error("O acesso ainda não está disponível.");
      }}
      onLogout={async () => {}}
    />,
  );
}

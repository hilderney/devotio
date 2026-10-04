import React, { useMemo, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { createConvexRepository } from "domain/convex";
import {
  clientConfiguration,
  loginDestination,
  type Repository,
} from "domain/core";
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
  const client = new ConvexReactClient(configuration.url);
  const auth = createAuthClient({
    baseURL: configuration.site,
    plugins: [convexClient(), crossDomainClient()],
  });
  function LiveApp() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const session = auth.useSession();
    const repository = useMemo(() => createConvexRepository(client), []);
    return (
      <App
        repository={isAuthenticated && session.data ? repository : null}
        loading={isLoading || session.isPending}
        configured
        userKey={session.data?.user.id ?? "guest"}
        onLogin={async (destination) => {
          const redirect = loginDestination(destination);
          const result = await auth.signIn.social({
            provider: "google",
            callbackURL: location.origin + redirect,
            errorCallbackURL:
              location.origin +
              "/entrar?error=oauth&redirect=" +
              encodeURIComponent(redirect),
          });
          if (result.error)
            throw new Error("Não foi possível entrar. Tente novamente.");
        }}
        onLogout={async () => {
          const result = await auth.signOut();
          if (result.error)
            throw new Error("Não foi possível sair. Tente novamente.");
          location.assign("/entrar");
        }}
      />
    );
  }
  render(
    <ConvexBetterAuthProvider client={client} authClient={auth}>
      <LiveApp />
    </ConvexBetterAuthProvider>,
  );
} else if (import.meta.env.DEV && configuration.mode === "preview") {
  const { createPreviewRepository } = await import("domain/preview");
  function PreviewApp() {
    const [repository, setRepository] = useState<Repository | null>(() =>
      createPreviewRepository(),
    );
    return (
      <App
        repository={repository}
        preview
        configured={false}
        loading={false}
        userKey={repository ? "preview" : "guest"}
        onLogin={async () => {
          setRepository(createPreviewRepository());
        }}
        onLogout={async () => {
          setRepository(null);
        }}
      />
    );
  }
  render(<PreviewApp />);
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

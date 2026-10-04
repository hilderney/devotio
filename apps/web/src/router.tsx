import { useEffect, useState } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
  Navigate,
  useLocation,
} from "@tanstack/react-router";
import {
  BookOpen,
  Users,
  ArrowUpRight,
  LogOut,
  HelpCircle,
  Shield,
  ChevronDown,
  Leaf,
  WifiOff,
} from "lucide-react";
import { RepositoryProvider, useHome, useLocalDate } from "domain/react";
import { initials, loginDestination, loginSearchSchema } from "domain/core";
import {
  AppProvider,
  useApp,
  ReaderContext,
  type AppContextValue,
} from "./context";
import { Brand, Loading, AudioPlayer, ErrorMessage } from "./components";
import { DevotionalPage } from "./pages/devotional";
import { CommunitiesPage, CommunityPage } from "./pages/community";
import { SignInPage, InfoPage } from "./pages/access";
function Root() {
  const app = useApp();
  const location = useLocation();
  const publicRoute = ["/entrar", "/privacidade", "/ajuda"].includes(
    location.pathname,
  );
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    addEventListener("online", update);
    addEventListener("offline", update);
    return () => {
      removeEventListener("online", update);
      removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    document.title =
      (location.pathname.startsWith("/comunidade")
        ? "Comunidade"
        : location.pathname === "/entrar"
          ? "Bem-vindo"
          : "Devocional") + " · Devotio";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  if (!online)
    return (
      <div className="offline-page">
        <Brand />
        <WifiOff size={32} />
        <h1>Um instante de pausa.</h1>
        <p>
          Conecte-se à internet para acessar seu devocional e sua comunidade.
        </p>
        <p className="caption">
          Seus conteúdos pessoais não ficam salvos neste dispositivo.
        </p>
      </div>
    );
  if (app.loading)
    return (
      <div className="page narrow">
        <Brand />
        <Loading />
      </div>
    );
  if (!app.repository && !publicRoute)
    return (
      <Navigate
        to="/entrar"
        search={{ redirect: loginDestination(location.pathname) }}
        replace
      />
    );
  if (!app.repository) return <Outlet />;
  return (
    <RepositoryProvider repository={app.repository} key={app.userKey}>
      <ReaderShell />
    </RepositoryProvider>
  );
}
function ReaderShell() {
  const app = useApp();
  const { date, refresh } = useLocalDate();
  const home = useHome(date);
  const location = useLocation();
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => {
    const foreground = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", foreground);
    return () => document.removeEventListener("visibilitychange", foreground);
  }, [refresh]);
  const isReading = location.pathname === "/devocional";
  return (
    <ReaderContext.Provider
      value={{ data: home.data, error: home.error, date }}
    >
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/devocional" aria-label="Devotio, página inicial">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <Link to="/devocional" activeProps={{ className: "active" }}>
              <BookOpen size={17} />
              Devocional
            </Link>
            <Link
              to="/comunidade"
              activeOptions={{ exact: false }}
              activeProps={{ className: "active" }}
            >
              <Users size={17} />
              Comunidade
            </Link>
          </nav>
          <details className="account-menu">
            <summary aria-label="Abrir menu da conta">
              <span className="avatar">
                {initials(home.data?.user.name ?? "Leitor")}
              </span>
              <span className="account-name">
                {home.data?.user.name.split(" ")[0] ?? "Minha conta"}
              </span>
              <ChevronDown size={14} />
            </summary>
            <div className="account-popover">
              <p className="caption">{home.data?.user.name ?? "Minha conta"}</p>
              <Link to="/ajuda">
                <HelpCircle size={16} />
                Ajuda e instalação
              </Link>
              <Link to="/privacidade">
                <Shield size={16} />
                Privacidade
              </Link>
              <button
                onClick={async () => {
                  try {
                    await app.onLogout();
                  } catch {
                    setLogoutError("Não foi possível sair. Tente novamente.");
                  }
                }}
              >
                <LogOut size={16} />
                Sair
              </button>
              {logoutError && <ErrorMessage message={logoutError} />}
            </div>
          </details>
        </div>
      </header>
      {app.preview && (
        <div className="preview-strip">
          <span className="preview-dot" />
          Prévia local
          <span className="preview-long">
            {" "}
            · Conteúdo ilustrativo, sem publicação pastoral
          </span>
        </div>
      )}
      {isReading && home.data?.settings?.monthlyVerse && (
        <aside className="monthly-theme" aria-label="Tema do mês">
          <div>
            <Leaf size={16} />
            <span className="theme-label">PARA GUARDAR NO CORAÇÃO</span>
            <p>{home.data.settings.monthlyVerse}</p>
            <span className="theme-reference">
              {home.data.settings.monthlyReference}
            </span>
          </div>
        </aside>
      )}
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      {home.data?.devotional?.audioUrl && (
        <div className="persistent-audio">
          <AudioPlayer
            key={home.data.devotional.id}
            devotional={home.data.devotional}
          />
        </div>
      )}
      <footer className="site-footer">
        <span>Um pouco de silêncio. Um encontro com a Palavra.</span>
        <Link to="/ajuda">
          Feito para estar presente <ArrowUpRight size={13} />
        </Link>
      </footer>
      <nav className="mobile-nav" aria-label="Navegação no celular">
        <Link to="/devocional" activeProps={{ className: "active" }}>
          <BookOpen size={21} />
          <span>Devocional</span>
        </Link>
        <Link
          to="/comunidade"
          activeOptions={{ exact: false }}
          activeProps={{ className: "active" }}
        >
          <Users size={21} />
          <span>Comunidade</span>
        </Link>
      </nav>
    </ReaderContext.Provider>
  );
}
const rootRoute = createRootRoute({
  component: Root,
  notFoundComponent: () => (
    <div className="page narrow">
      <h1>Este caminho não existe.</h1>
      <Link className="button" to="/devocional">
        Voltar ao devocional
      </Link>
    </div>
  ),
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/devocional" />,
});
const devotionalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/devocional",
  component: DevotionalPage,
});
const communitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comunidade",
  component: CommunitiesPage,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comunidade/$communityId",
  component: () => {
    const { communityId } = communityRoute.useParams();
    return <CommunityPage key={communityId} id={communityId} />;
  },
});
const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/entrar",
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: SignInPage,
});
const listsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comunidade/$communityId/listas",
  component: () => {
    const { communityId } = listsRoute.useParams();
    return <CommunityPage key={communityId} id={communityId} tab="listas" />;
  },
});
const membersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comunidade/$communityId/membros",
  component: () => {
    const { communityId } = membersRoute.useParams();
    return <CommunityPage key={communityId} id={communityId} tab="membros" />;
  },
});
const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ajuda",
  component: () => <InfoPage kind="help" />,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacidade",
  component: () => <InfoPage kind="privacy" />,
});
const routeTree = rootRoute.addChildren([
  indexRoute,
  devotionalRoute,
  communitiesRoute,
  communityRoute,
  listsRoute,
  membersRoute,
  signInRoute,
  helpRoute,
  privacyRoute,
]);
const router = createRouter({ routeTree, defaultPreload: "intent" });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export function App(props: AppContextValue) {
  return (
    <AppProvider value={props}>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

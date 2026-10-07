import { useEffect, useState } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createBrowserHistory,
  RouterProvider,
  Outlet,
  Link,
  useLocation,
  useMatches,
} from "@tanstack/react-router";
import {
  BookOpen,
  BookText,
  PenLine,
  Users,
  ArrowUpRight,
  LogOut,
  HelpCircle,
  Shield,
  ChevronDown,
  Leaf,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { RepositoryProvider, useHome, useLocalDate } from "domain/react";
import { initials, loginDestination, loginSearchSchema, bibleParamsSchema, canPublish, type Devotional } from "domain/core";
import {
  AppProvider,
  useApp,
  ReaderContext,
  AudioSelectionContext,
  type AppContextValue,
} from "./context";
import { Brand, Loading, AudioPlayer, ErrorMessage } from "./components";
import { ReadingPage } from "./pages/reading";
import { BiblePage } from "./pages/bible";
import { EditorialPage } from "./pages/editorial";
import { CommunitiesPage, CommunityPage } from "./pages/community";
import { SignInPage, InfoPage } from "./pages/access";
import { RouteRedirect } from "./redirect";
function Root() {
  const app = useApp();
  const location = useLocation();
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
        : location.pathname === "/biblia" ? "Bíblia" : location.pathname === "/editorial" ? "Editorial" : location.pathname === "/entrar"
          ? "Bem-vindo"
          : "Devocional") + " · Devotio";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  if (!online && !app.localProfile)
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
  return <Outlet />;
}
function ReaderLayout() {
  const app = useApp();
  const destination = useMatches({ select: matches => matches.at(-1)?.pathname ?? "/devocional" });
  if (!app.repository)
    return (
      <RouteRedirect
        to="/entrar"
        redirect={loginDestination(destination)}
      />
    );
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
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [selectedAudio, setSelectedAudio] = useState<Devotional | null>(null);
  const audio = app.repository?.reading ? selectedAudio : home.data?.devotional;
  useEffect(() => {
    const foreground = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", foreground);
    return () => document.removeEventListener("visibilitychange", foreground);
  }, [refresh]);
  const isReading = location.pathname === "/devocional";
  return (
    <AudioSelectionContext.Provider value={setSelectedAudio}>
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
            {app.repository?.reading && <Link to="/biblia" search={{ book: "jo", chapter: 1 }} activeProps={{ className: "active" }}><BookText size={17} />Bíblia</Link>}
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
              {app.localProfile && <p className="caption">{app.localProfile.label}</p>}
              {app.repository?.refresh && <button disabled={refreshing} onClick={async () => {
                setRefreshing(true); setRefreshError("");
                try { await app.repository?.refresh?.(); }
                catch { setRefreshError("Não foi possível atualizar. Tente novamente quando estiver conectado."); }
                finally { setRefreshing(false); }
              }}><RefreshCw size={16} />{refreshing ? "Atualizando…" : "Atualizar conteúdo"}</button>}
              {refreshError && <ErrorMessage message={refreshError} />}
              {canPublish(app.localProfile?.editorial) && <Link to="/editorial"><PenLine size={16} />Editorial local</Link>}
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
                {app.localProfile ? "Sair / trocar perfil" : "Sair"}
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
      {app.localProfile && <div className="preview-strip"><span className="preview-dot" />Desenvolvimento local <span className="preview-long">· Login simulado · {app.localProfile.label}</span></div>}
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
      {audio?.audioUrl && (
        <div className="persistent-audio">
          <AudioPlayer
            key={audio.id + audio.audioUrl}
            devotional={audio}
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
        {app.repository?.reading && <Link to="/biblia" search={{ book: "jo", chapter: 1 }} activeProps={{ className: "active" }}><BookText size={21} /><span>Bíblia</span></Link>}
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
    </AudioSelectionContext.Provider>
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
  component: () => <RouteRedirect to="/devocional" />,
});
const readerRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_reader",
  component: ReaderLayout,
});
const devotionalRoute = createRoute({
  getParentRoute: () => readerRoute,
  path: "/devocional",
  component: ReadingPage,
});
const bibleRoute = createRoute({ getParentRoute: () => readerRoute, path: "/biblia", validateSearch: (search) => bibleParamsSchema.parse(search), component: BiblePage });
const editorialRoute = createRoute({ getParentRoute: () => readerRoute, path: "/editorial", component: EditorialPage });
const communitiesRoute = createRoute({
  getParentRoute: () => readerRoute,
  path: "/comunidade",
  component: CommunitiesPage,
});
const communityRoute = createRoute({
  getParentRoute: () => readerRoute,
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
  getParentRoute: () => readerRoute,
  path: "/comunidade/$communityId/listas",
  component: () => {
    const { communityId } = listsRoute.useParams();
    return <CommunityPage key={communityId} id={communityId} tab="listas" />;
  },
});
const membersRoute = createRoute({
  getParentRoute: () => readerRoute,
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
  readerRoute.addChildren([devotionalRoute, bibleRoute, editorialRoute, communitiesRoute, communityRoute, listsRoute, membersRoute]),
  signInRoute,
  helpRoute,
  privacyRoute,
]);
const history = createBrowserHistory();
function createAppRouter() {
  return createRouter({ routeTree, history, defaultPreload: "intent" });
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
export function App(props: AppContextValue) {
  const [router] = useState(createAppRouter);
  return (
    <AppProvider value={props}>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

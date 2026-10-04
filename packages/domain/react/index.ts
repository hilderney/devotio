import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { localDate } from "../rules";
import type { Repository, Watch } from "../types";
const RepositoryContext = createContext<Repository | null>(null);
export function RepositoryProvider({
  repository,
  children,
}: {
  repository: Repository;
  children: ReactNode;
}) {
  return createElement(
    RepositoryContext.Provider,
    { value: repository },
    children,
  );
}
export function useRepository() {
  const repository = useContext(RepositoryContext);
  if (!repository) throw new Error("RepositoryProvider ausente.");
  return repository;
}
function useWatch<T>(watch: Watch<T>) {
  const [state, setState] = useState<{
    watch: Watch<T>;
    data?: T;
    error?: string;
  }>({ watch });
  useEffect(() => {
    let active = true;
    const stop = watch(
      (data) => {
        if (active) setState({ watch, data });
      },
      () => {
        if (active)
          setState({
            watch,
            error:
              "Não foi possível carregar. Verifique sua conexão e tente novamente.",
          });
      },
    );
    return () => {
      active = false;
      stop();
    };
  }, [watch]);
  return state.watch === watch
    ? state
    : { watch, data: undefined, error: undefined };
}
export function useLocalDate() {
  const [date, setDate] = useState(localDate);
  useEffect(() => {
    const update = () => setDate(localDate());
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);
  // Presentation adapters may also call refresh on foreground without importing DOM here.
  const refresh = useCallback(() => setDate(localDate()), []);
  return { date, refresh };
}
export function useHome(date: string) {
  const repository = useRepository();
  return useWatch(
    useMemo(() => repository.watchHome(date), [repository, date]),
  );
}
export function useCommunities() {
  const repository = useRepository();
  return useWatch(useMemo(() => repository.watchCommunities(), [repository]));
}
export function useCommunity(id: string, cursor: string | null) {
  const repository = useRepository();
  return useWatch(
    useMemo(
      () => repository.watchCommunity(id, cursor),
      [repository, id, cursor],
    ),
  );
}

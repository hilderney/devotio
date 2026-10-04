import { createContext, useContext, type ReactNode } from "react";
import type { Repository, HomeData } from "domain/core";
export interface AppContextValue {
  repository: Repository | null;
  preview?: boolean;
  configured: boolean;
  loading: boolean;
  userKey: string;
  onLogin: (destination: string) => Promise<void>;
  onLogout: () => Promise<void>;
}
export const AppContext = createContext<AppContextValue | null>(null);
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppContext ausente.");
  return value;
}
export const ReaderContext = createContext<{
  data?: HomeData;
  error?: string;
  date: string;
}>({ date: "" });
export function useReader() {
  return useContext(ReaderContext);
}
export function AppProvider({
  value,
  children,
}: {
  value: AppContextValue;
  children: ReactNode;
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

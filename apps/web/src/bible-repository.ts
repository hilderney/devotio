import { createBibleRepository, alm1911Revision, type BibleReaderRepository } from "domain/core";

/** Browser persistence/HTTP only; edition, validation and cache policies live in domain. */
export function createWebBible(owner: string, legacy?: BibleReaderRepository) {
  const key = `devotio:bible:${alm1911Revision}:${owner}`;
  return createBibleRepository({
    async load(path) {
      const response = await fetch(path, { cache: "force-cache", signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("Não foi possível carregar a edição bíblica.");
      return response.json() as Promise<unknown>;
    },
    storage: {
      read() { try { return JSON.parse(localStorage.getItem(key) ?? "[]") as unknown; } catch { return []; } },
      write(chapters) { localStorage.setItem(key, JSON.stringify(chapters)); },
    },
  }, legacy);
}

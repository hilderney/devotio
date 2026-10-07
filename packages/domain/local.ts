import type { Repository, Watch, HomeData, Community, CommunityDetail } from "./types";
import { dateInZone, recentDates, type LocalProfile, type ReadingData, type BibleCatalog, type BibleChapter, type BibleResults, type EditorialEntry } from "./reading";
import { localCommandSchema, localQuerySchema, type LocalCommand, type LocalQuery } from "./validators/local";
import { localCacheSchema, type LocalCache, type LocalCacheStorage } from "./local-cache";
export type { LocalCacheStorage, LocalCache } from "./local-cache";

export async function localRequest<T>(path: string, body?: unknown, profileId?: string): Promise<T> {
  const response = await fetch("/__local/" + path, {
    method: body === undefined ? "GET" : "POST", credentials: "same-origin", cache: "no-store",
    headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(profileId ? { "X-Devotio-Profile": profileId } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(12000),
  });
  const value = await response.json();
  if (!response.ok) throw Object.assign(new Error(value.error ?? "Não foi possível acessar o servidor local."), { status: response.status });
  return value as T;
}
export interface LocalSession { profile: LocalProfile | null; profiles: LocalProfile[]; expiresAt: number | null }
let sessionRequest: Promise<LocalSession> | undefined;
// Deduplicate React StrictMode/bootstrap callers, without caching identity indefinitely.
export function localSession() {
  return sessionRequest ??= localRequest<LocalSession>("session").finally(() => { sessionRequest = undefined; });
}
export function localLogin(profileId: string) { return localRequest<{ profile: LocalProfile; expiresAt: number }>("command", localCommandSchema.parse({ action: "login", profileId })); }
export function localLogout() { return localRequest<null>("command", { action: "logout" }); }
interface Observer { next(value: unknown): void; error(error: Error): void }
interface Entry { observers: Set<Observer>; value?: unknown; ready: boolean; revision: number; pending?: Promise<void>; emit(): Promise<void> }
interface Options { now?: () => Date; timeZone?: string; sessionExpiresAt?: number; onStorageWarning?: (message: string) => void }
export function createLocalRepository(storage: LocalCacheStorage, onExpired: () => void, profileId: string, options: Options = {}) {
  const now = options.now ?? (() => new Date());
  const timeZone = options.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = () => dateInZone(timeZone, now());
  const empty = (): LocalCache => ({ version: 1, owner: profileId, day: today(), homes: {}, favorites: [], chapters: [] });
  let cache = empty(), disposed = false, revision = 0, storageWarning: string | undefined;
  try { const parsed = localCacheSchema.safeParse(storage.read()); if (parsed.success && parsed.data.owner === profileId) cache = parsed.data; } catch { /* Start in memory if storage is unavailable. */ }
  const entries = new Map<string, Entry>();
  const requests = new Map<string, Promise<unknown>>();
  const dirtyDates = new Set<string>();
  let observedDay = today();
  let windowRequest: Promise<void> | undefined;
  let favoritesRequest: Promise<ReadingData> | undefined;
  let reading: ReadingData | undefined;
  function persist() {
    if (disposed) return;
    try { storage.write(cache); }
    catch {
      storageWarning = "Não foi possível guardar as leituras neste navegador. Elas continuam disponíveis enquanto esta página estiver aberta.";
      options.onStorageWarning?.(storageWarning);
    }
  }
  function expire() {
    if (disposed) return;
    disposed = true; entries.clear(); requests.clear(); cache = empty();
    try { storage.clear(); } finally { onExpired(); }
  }
  async function query<T>(input: LocalQuery): Promise<T> {
    const key = JSON.stringify(localQuerySchema.parse(input));
    let request = requests.get(key);
    if (!request) {
      request = localRequest<T>("query?input=" + encodeURIComponent(key), undefined, profileId).catch(error => {
        if ((error as { status?: number })?.status === 401) expire();
        throw error;
      });
      requests.set(key, request);
      void request.finally(() => { if (requests.get(key) === request) requests.delete(key); }).catch(() => {});
    }
    return request as Promise<T>;
  }
  function reconcileDay() {
    const day = today(), dates = recentDates(day);
    const changed = cache.day !== day;
    cache.day = day;
    for (const date of Object.keys(cache.homes)) {
      if (!dates.includes(date)) { delete cache.homes[date]; dirtyDates.delete(date); }
      else if (changed && !cache.homes[date].devotional) dirtyDates.add(date);
    }
    if (changed) { revision++; persist(); }
    return changed;
  }
  reconcileDay();
  async function loadWindow(): Promise<void> {
    reconcileDay();
    if (windowRequest) { await windowRequest; return loadWindow(); }
    const dates = recentDates(today()).filter(date => !Object.hasOwn(cache.homes, date) || dirtyDates.has(date));
    if (!dates.length) return;
    const started = revision;
    windowRequest = query<Record<string, HomeData>>({ query: "devotionals", dates, timeZone }).then(homes => {
      if (!disposed && started === revision) {
        for (const date of dates) if (Object.hasOwn(homes, date)) { cache.homes[date] = homes[date]; dirtyDates.delete(date); }
        persist();
      }
    }).finally(() => { windowRequest = undefined; });
    await windowRequest;
    if (!disposed && started !== revision) await loadWindow();
  }
  async function home(date: string): Promise<HomeData> {
    try { await loadWindow(); }
    catch (error) {
      if (disposed || (error as { status?: number })?.status || !cache.homes[date]) throw error;
    }
    const value = cache.homes[date];
    if (!value) throw new Error("Esta leitura não está guardada no dispositivo.");
    return value;
  }
  async function readFavorites(): Promise<ReadingData> {
    reconcileDay();
    if (reading) return { ...reading, dates: recentDates(today()), storageWarning };
    if (!favoritesRequest) {
      favoritesRequest = query<ReadingData>({ query: "reading", timeZone }).then(data => {
        if (!disposed) { cache.favorites = data.favorites; persist(); reading = data; }
        return { ...data, storageWarning };
      }).catch(error => {
        if (!disposed && !(error as { status?: number })?.status) return { dates: recentDates(today()), favorites: cache.favorites, offline: true, storageWarning };
        throw error;
      }).finally(() => { favoritesRequest = undefined; });
    }
    return favoritesRequest;
  }
  // Shared observers make shell + reader and StrictMode use one request. No network timers.
  const watch = <T>(key: string, read: () => Promise<T>): Watch<T> => (next, error) => {
    if (disposed) return () => {};
    let entry = entries.get(key);
    if (!entry) {
      const created: Entry = {
        observers: new Set(), ready: false, revision: 0,
        async emit() {
          if (created.pending) return created.pending;
          if (disposed || !created.observers.size) return;
          const started = created.revision;
          created.pending = (async () => {
            try {
              const value = await read();
              if (!disposed && started === created.revision) {
                created.value = value; created.ready = true;
                created.observers.forEach(observer => observer.next(value));
              }
            } catch (e) {
              if (!disposed && started === created.revision) created.observers.forEach(observer => observer.error(e instanceof Error ? e : new Error("Falha na conexão local.")));
            } finally { created.pending = undefined; }
          })();
          await created.pending;
          if (!disposed && started !== created.revision) await created.emit();
        },
      };
      entries.set(key, created); entry = created;
    }
    const observer: Observer = { next: value => next(value as T), error };
    entry.observers.add(observer);
    if (entry.ready) next(entry.value as T); else void entry.emit();
    const current = entry;
    return () => {
      current.observers.delete(observer);
      queueMicrotask(() => {
        if (!current.observers.size && entries.get(key) === current) entries.delete(key);
      });
    };
  };
  async function invalidate(matches: (key: string) => boolean) {
    await Promise.all([...entries].filter(([key]) => matches(key)).map(async ([, entry]) => {
      entry.ready = false; entry.revision++; await entry.emit();
    }));
  }
  async function afterCommand(input: LocalCommand, result: unknown) {
    switch (input.action) {
      case "publish": case "withdraw": {
        const date = input.action === "publish" ? input.input.date : input.date;
        revision++; delete cache.homes[date]; dirtyDates.add(date); persist();
        await invalidate(key => key === "editorial" || key === "home:" + date); break;
      }
      case "setFavorite": reading = undefined; await favoritesRequest; reading = undefined; await invalidate(key => key === "reading"); break;
      case "createCommunity": case "joinCommunity":
        await invalidate(key => key === "communities" || key.startsWith("community:" + String(result) + ":")); break;
      case "sendMessage": case "createChecklist": case "updateScripture": case "removeMember":
        await invalidate(key => key.startsWith("community:" + input.id + ":") || (input.action === "removeMember" && key === "communities")); break;
      case "setTick":
        await invalidate(key => {
          const detail = entries.get(key)?.value as CommunityDetail | undefined;
          return key.startsWith("community:") && !!detail?.lists.some(list => list.items.some(item => item.id === input.itemId));
        }); break;
    }
  }
  async function command<T>(input: LocalCommand): Promise<T> {
    try {
      if (disposed) throw new Error("Esta sessão não está mais ativa.");
      const result = await localRequest<T>("command", localCommandSchema.parse(input), profileId);
      if (!disposed) await afterCommand(input, result);
      return result;
    } catch (error) { if ((error as { status?: number })?.status === 401) expire(); throw error; }
  }
  async function chapter(abbrev: string, number: number): Promise<BibleChapter | null> {
    const cached = cache.chapters.find(value => value.book.abbrev === abbrev && value.chapter === number);
    const value = cached ?? await query<BibleChapter | null>({ query: "chapter", abbrev, chapter: number });
    if (!disposed && value) {
      cache.chapters = [value, ...cache.chapters.filter(item => item.book.abbrev !== abbrev || item.chapter !== number)].slice(0, 6);
      persist();
    }
    return value;
  }
  const repository: Repository = {
    mode: "local",
    async refresh() {
      revision++; recentDates(today()).forEach(date => dirtyDates.add(date)); reading = undefined;
      await windowRequest?.catch(() => {}); await favoritesRequest?.catch(() => {}); reading = undefined;
      await loadWindow();
      await invalidate(() => true);
    },
    watchHome: date => watch("home:" + date, () => home(date)),
    watchCommunities: () => watch("communities", () => query<Community[]>({ query: "communities" })),
    watchCommunity: (id, cursor) => watch("community:" + id + ":" + cursor, () => query<CommunityDetail | null>({ query: "community", id, cursor })),
    createCommunity: input => command<string>({ action: "createCommunity", input }),
    previewInvite: code => query<{ id: string; name: string } | null>({ query: "invite", code }),
    joinCommunity: code => command<string>({ action: "joinCommunity", code }),
    sendMessage: (id, content) => command<void>({ action: "sendMessage", id, content }),
    updateScripture: (id, scripture) => command<void>({ action: "updateScripture", id, scripture }),
    createChecklist: (id, name, items) => command<void>({ action: "createChecklist", id, input: { name, items } }),
    setTick: (itemId, checked) => command<void>({ action: "setTick", itemId, checked }),
    removeMember: (id, memberId) => command<void>({ action: "removeMember", id, memberId }),
    reading: {
      watchReading: () => watch("reading", readFavorites),
      setFavorite: (date, saved) => command<void>({ action: "setFavorite", date, saved, timeZone }),
      watchBible: () => watch("bible", async () => {
        if (cache.catalog) return cache.catalog;
        const value = await query<BibleCatalog>({ query: "bible" });
        if (!disposed && value.books.length) { cache.catalog = value; persist(); }
        return value;
      }),
      watchChapter: (abbrev, number) => watch("chapter:" + abbrev + ":" + number, () => chapter(abbrev, number)),
      watchSearch: (text, page) => watch("search:" + text + ":" + page, () => query<BibleResults>({ query: "search", text, page })),
      watchEditorial: () => watch("editorial", () => query<EditorialEntry[]>({ query: "editorial" })),
      publish: input => command<void>({ action: "publish", input }),
      withdraw: (date, reason) => command<void>({ action: "withdraw", date, reason }),
    },
  };
  return {
    repository,
    async checkDay() {
      if (options.sessionExpiresAt && now().getTime() >= options.sessionExpiresAt) { expire(); return; }
      if (!disposed && observedDay !== today()) {
        observedDay = today(); reconcileDay();
        await invalidate(key => key.startsWith("home:") || key === "reading");
      }
    },
    expire,
    dispose() { disposed = true; entries.clear(); requests.clear(); },
  };
}

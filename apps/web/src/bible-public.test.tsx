import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createBibleRepository, alm1911DatasetSchema, type BibleChapter, type BibleCatalog, type BibleReaderRepository, type Watch } from "domain/core";
import { createPreviewRepository } from "domain/preview";
import { App } from "./router";

const books = alm1911DatasetSchema.parse(JSON.parse(readFileSync(resolve("../../docs/bibles/ALM1911.json"), "utf8")));
const catalog: BibleCatalog = { version: "alm1911", books: books.map(({ chapters, ...b }) => ({ ...b, chapters: chapters.length })), verses: 31101, importedAt: null, source: "Almeida 1911 · fonte fornecida" };
function chapter(book: string, number: number): BibleChapter {
  const entry = books.find(b => b.abbrev === book)!;
  return { version: "alm1911", book: catalog.books.find(b => b.abbrev === book)!, chapter: number, verses: entry.chapters[number - 1].map((text, i) => ({ abbrev: book, bookName: entry.name, chapter: number, number: i + 1, text })) };
}
const watch = <T,>(v: T): Watch<T> => next => { next(v); return () => {}; };
beforeEach(() => {
  window.history.replaceState(null, "", "/biblia?book=gn&chapter=1");
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(window, "scrollBy").mockImplementation(() => {});
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function start(legacy?: BibleReaderRepository) {
  const load = vi.fn(async (path: string): Promise<unknown> => {
    if (path.endsWith("catalog.json")) return catalog;
    if (path.endsWith("search.json")) return [["gn", 1, 1, "principio creou deus ceus terra"]];
    const [, book, n] = path.match(/\/([a-z0-9]+)\/(\d+)\.json$/)!;
    return chapter(book, Number(n));
  });
  const repository = { ...createPreviewRepository(), mode: "live" as const, bible: createBibleRepository({ load }, legacy) };
  render(<App repository={repository} configured loading={false} userKey="public-reader" onLogin={async () => {}} onLogout={async () => {}} />);
  return load;
}
async function settings() {
  fireEvent.click(screen.getByLabelText("Abrir menu da conta"));
  fireEvent.click(screen.getByRole("button", { name: /Configurações/ }));
  fireEvent.click(screen.getByRole("combobox", { name: /Versão da Bíblia/ }));
}
describe("Bíblia na web conectada", () => {
  it("lê ALM1911 sem reading privado, oferece só edição disponível e pesquisa seu texto", async () => {
    localStorage.setItem("devotio:preferences:v1:public-reader", JSON.stringify({ theme: "day", fontSize: 20, mode: "paged", bibleVersion: "aa" }));
    const load = start();
    await screen.findByText("No principio creou Deus os céus e a terra.");
    expect(screen.queryByText("Leitura bíblica em preparação.")).toBeNull();
    await settings();
    expect(screen.queryByRole("option", { name: "Almeida Atualizada (AA)" })).toBeNull();
    fireEvent.click(screen.getByRole("option", { name: /Almeida 1911/ }));
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem("devotio:preferences:v1:public-reader")!).bibleVersion).toBe("alm1911"));
    fireEvent.change(screen.getByRole("textbox", { name: /Buscar/ }), { target: { value: "principio" } });
    await screen.findByText("Encontros na Palavra");
    await screen.findByText("Gênesis 1:1");
    expect(load.mock.calls.some(([p]) => p.endsWith("search.json"))).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Voltar à leitura" }));
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    fireEvent(window, new Event("offline"));
    expect(screen.getByText("No principio creou Deus os céus e a terra.")).toBeTruthy();
    expect(screen.queryByText("Um instante de pausa.")).toBeNull();
  });
  it("troca AA por ALM1911, preserva endereço e tema, limpa a seleção e não mistura textos", async () => {
    localStorage.setItem("devotio:preferences:v1:public-reader", JSON.stringify({ theme: "papyrus", fontSize: 24, mode: "paged" }));
    const aaChapter = { ...chapter("gn", 1), version: "aa" as const, verses: [{ ...chapter("gn", 1).verses[0], text: "Texto da AA para teste" }] };
    start({ watchBible: () => watch({ ...catalog, version: "aa" }), watchChapter: () => watch(aaChapter), watchSearch: () => watch({ verses: aaChapter.verses, total: 1, page: 0 }) });
    await screen.findByText("Texto da AA para teste");
    fireEvent.click(screen.getByRole("checkbox", { name: /Versículo 1:/ }));
    await settings();
    fireEvent.click(screen.getByRole("option", { name: /Almeida 1911/ }));
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    await screen.findByText("No principio creou Deus os céus e a terra.");
    expect(screen.queryByText("Texto da AA para teste")).toBeNull();
    expect(screen.queryByLabelText("Ações dos versículos selecionados")).toBeNull();
    expect(window.location.search).toContain("book=gn");
    expect(window.location.search).toContain("chapter=1");
    expect(document.documentElement.dataset.theme).toBe("papyrus");
    await waitFor(() => expect(JSON.parse(localStorage.getItem("devotio:preferences:v1:public-reader")!)).toMatchObject({ theme: "papyrus", fontSize: 24, bibleVersion: "alm1911" }));
  });
});

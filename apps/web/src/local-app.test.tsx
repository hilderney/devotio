import { StrictMode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalApp } from "./local-app";
import { dateInZone, recentDates, type LocalProfile } from "domain/core";

const profile: LocalProfile = { id: "marina", name: "Marina Oliveira", label: "Membro", description: "Perfil de teste", editorial: false };
beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.history.replaceState(null, "", "/");
  localStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function server(loggedIn: boolean) {
  const fetcher = vi.fn(async (path: string, options?: RequestInit) => {
    if (path.endsWith("session")) return new Response(JSON.stringify({ profile: loggedIn ? profile : null, profiles: [profile], expiresAt: loggedIn ? Date.now() + 86400000 : null }));
    if (options?.body) {
      const command = JSON.parse(String(options.body));
      if (command.action === "logout") { loggedIn = false; return new Response("null"); }
      loggedIn = true;
      return new Response(JSON.stringify({ profile, expiresAt: Date.now() + 86400000 }));
    }
    const input = JSON.parse(new URL(path, "http://localhost").searchParams.get("input")!);
    if (input.query === "communities") return new Response("[]");
    const book = { abbrev: "jo", name: "João", chapters: 21, testament: "NT", order: 43 };
    if (input.query === "bible") return new Response(JSON.stringify({ books: [book], version: "aa", verses: 1, importedAt: 1, source: "Fixture" }));
    if (input.query === "chapter") return new Response(JSON.stringify({ book, chapter: input.chapter, verses: [{ abbrev: "jo", bookName: "João", chapter: input.chapter, number: 1, text: "Versículo bíblico de teste" }] }));
    if (input.query === "reading") return new Response(JSON.stringify({ dates: recentDates(dateInZone("America/Sao_Paulo")), favorites: [] }));
    if (input.query === "devotionals") return new Response(JSON.stringify(Object.fromEntries(input.dates.map((date: string) => [date, {
      user: profile, settings: null,
      devotional: { id: date, date, reference: "Salmos 23:1", translation: "AA", scripture: "Leitura integrada de teste", reflection: "Reflexão de teste", prayerSuggestion: "Oração de teste", credit: "Teste" },
    }]))));
    throw new Error("Consulta inesperada: " + path);
  });
  vi.stubGlobal("fetch", fetcher);
  return fetcher;
}
describe("entrada local integrada", () => {
  it("sai do carregamento na raiz e mostra os perfis ao visitante", async () => {
    server(false);
    render(<StrictMode><LocalApp /></StrictMode>);
    await screen.findByRole("button", { name: /Marina Oliveira/ });
    expect(screen.queryByLabelText("Carregando conteúdo")).toBeNull();
    await waitFor(() => expect(window.location.pathname).toBe("/entrar"));
  });
  it("abre a leitura de uma sessão existente", async () => {
    server(true);
    render(<StrictMode><LocalApp /></StrictMode>);
    await screen.findByText("Leitura integrada de teste");
    expect(screen.queryByLabelText("Carregando conteúdo")).toBeNull();
  });
  it("entra com um perfil, mostra leitura e permite sair para selecionar outra conta", async () => {
    const fetcher = server(false);
    render(<StrictMode><LocalApp /></StrictMode>);
    fireEvent.click(await screen.findByRole("button", { name: /Marina Oliveira/ }));
    await screen.findByText("Leitura integrada de teste");
    await waitFor(() => expect(window.location.pathname).toBe("/devocional"));
    fireEvent.click(screen.getByRole("button", { name: "Sair / trocar perfil" }));
    await screen.findByRole("button", { name: /Marina Oliveira/ });
    expect(screen.queryByText("Leitura integrada de teste")).toBeNull();
    expect(fetcher.mock.calls.filter(([path]) => path.endsWith("session"))).toHaveLength(1);
  });
  it("sai do carregamento e apresenta falha quando a verificação da sessão falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Servidor indisponível")));
    render(<StrictMode><LocalApp /></StrictMode>);
    expect((await screen.findByRole("alert")).textContent).toContain("Não foi possível acessar o banco local");
    expect(screen.queryByLabelText("Carregando conteúdo")).toBeNull();
  });
  it("preserva o destino de uma rota protegida após entrar", async () => {
    window.history.replaceState(null, "", "/comunidade");
    server(false);
    render(<StrictMode><LocalApp /></StrictMode>);
    const enter = await screen.findByRole("button", { name: /Marina Oliveira/ });
    await waitFor(() => expect(new URL(window.location.href).searchParams.get("redirect")).toBe("/comunidade"));
    fireEvent.click(enter);
    await screen.findByRole("heading", { name: /A fé também se vive/ });
    await waitFor(() => expect(window.location.pathname).toBe("/comunidade"));
  });
  it("navega pelas três áreas com a sessão aberta", async () => {
    server(true);
    render(<StrictMode><LocalApp /></StrictMode>);
    await screen.findByText("Leitura integrada de teste");
    fireEvent.click(screen.getAllByRole("link", { name: "Bíblia" })[0]);
    await screen.findByText("Versículo bíblico de teste");
    fireEvent.click(screen.getAllByRole("link", { name: "Comunidade" })[0]);
    await screen.findByRole("heading", { name: /A fé também se vive/ });
    fireEvent.click(screen.getAllByRole("link", { name: "Devocional" })[0]);
    await screen.findByText("Leitura integrada de teste");
  });
});

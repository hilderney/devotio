import type { ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Repository } from "domain/core";
import { createLiveApp } from "./live-app";

const identity = vi.hoisted(() => ({
  authenticated: true,
  owner: "approved-reader",
  status: "approved" as "approved" | "pending" | "disabled",
}));
vi.mock("convex/react", () => ({
  ConvexReactClient: class {},
  useConvexAuth: () => ({ isAuthenticated: identity.authenticated, isLoading: false }),
}));
vi.mock("@convex-dev/better-auth/react", () => ({
  ConvexBetterAuthProvider: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("better-auth/react", () => ({
  createAuthClient: () => ({ useSession: () => ({ data: { user: { id: identity.owner } }, isPending: false }) }),
}));
vi.mock("@convex-dev/better-auth/client/plugins", () => ({ convexClient: () => ({}), crossDomainClient: () => ({}) }));
vi.mock("domain/convex", () => ({
  createConvexRepository: () => ({ mode: "live" }),
  createAdministration: () => ({}),
  createConnectedEditorial: () => ({}),
  usePilotAccess: () => ({ access: { status: identity.status, editorial: false }, loading: false }),
}));
vi.mock("./router", () => ({
  App: ({ repository, administration }: { repository: Repository | null; administration?: unknown }) => (
    <>
      <span data-testid="bible">{repository?.bible?.versions.join(",") ?? "unavailable"}</span>
      <span data-testid="admin">{administration ? "available" : "unavailable"}</span>
    </>
  ),
}));
beforeEach(() => { identity.authenticated = true; identity.status = "approved"; });
afterEach(cleanup);
describe("composição da web publicada após integrar gestão e Bíblia", () => {
  it("oferece ALM1911 ao usuário aprovado e conserva o painel administrativo", () => {
    render(createLiveApp("https://test.convex.cloud", "https://test.convex.site"));
    expect(screen.getByTestId("bible").textContent).toBe("alm1911");
    expect(screen.getByTestId("admin").textContent).toBe("available");
  });
  it.each(["pending", "disabled"] as const)("preserva a barreira para conta %s", status => {
    identity.status = status;
    render(createLiveApp("https://test.convex.cloud", "https://test.convex.site"));
    expect(screen.getByTestId("bible").textContent).toBe("unavailable");
    expect(screen.getByTestId("admin").textContent).toBe("available");
  });
  it("retira o repositório ao perder autenticação", () => {
    identity.authenticated = false;
    render(createLiveApp("https://test.convex.cloud", "https://test.convex.site"));
    expect(screen.getByTestId("bible").textContent).toBe("unavailable");
  });
});

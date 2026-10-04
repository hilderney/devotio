import { describe, expect, it } from "vitest";
import { clientConfiguration, loginDestination } from "./access";
import { loginSearchSchema } from "./validators/access";

describe("retorno de acesso", () => {
  it.each([
    "/devocional",
    "/devocional#palavra",
    "/comunidade",
    "/comunidade/esperanca",
    "/comunidade/abc_123/listas",
    "/comunidade/abc-123/membros",
  ])("preserva destino interno %s", (path) =>
    expect(loginDestination(path)).toBe(path),
  );
  it.each([
    undefined,
    null,
    ["/comunidade"],
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "javascript:alert(1)",
    "/%2f%2fexample.com",
    "/comunidade/../entrar",
    "/entrar?redirect=/entrar",
    "/comunidade?redirect=https://example.com",
    "/devocional\n",
  ])("recusa destino não autorizado %s", (value) =>
    expect(loginDestination(value)).toBe("/devocional"),
  );
  it("filtra parâmetros de erro sem mostrar texto fornecido pela URL", () => {
    expect(
      loginSearchSchema.parse({
        redirect: "//example.com",
        error: "texto externo",
        extra: "não usar",
      }),
    ).toEqual({ redirect: "/devocional", error: "oauth" });
  });
});
describe("configuração pública", () => {
  it("permite prévia somente em DEV sem configuração", () => {
    expect(clientConfiguration(true)).toEqual({ mode: "preview" });
    expect(clientConfiguration(false)).toEqual({
      mode: "unavailable",
      reason: "missing",
    });
  });
  it.each([true, false])("recusa configuração incompleta em DEV=%s", (dev) => {
    expect(clientConfiguration(dev, "https://pilot.convex.cloud").mode).toBe(
      "unavailable",
    );
    expect(
      clientConfiguration(dev, undefined, "https://pilot.convex.site").mode,
    ).toBe("unavailable");
  });
  it.each([
    ["http://pilot.convex.cloud", "https://pilot.convex.site"],
    ["https://pilot.convex.site", "https://pilot.convex.cloud"],
    ["https://one.convex.cloud", "https://two.convex.site"],
    ["https://pilot.convex.cloud.evil.test", "https://pilot.convex.site"],
    ["invalid", "invalid"],
  ])("recusa par inválido %s", (url, site) =>
    expect(clientConfiguration(true, url, site).mode).toBe("unavailable"),
  );
  it("aceita endereços correspondentes e remove espaços", () =>
    expect(
      clientConfiguration(
        false,
        " https://pilot.convex.cloud ",
        "https://pilot.convex.site",
      ),
    ).toEqual({
      mode: "live",
      url: "https://pilot.convex.cloud",
      site: "https://pilot.convex.site",
    }));
});

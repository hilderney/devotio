import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("../apps/web/dist/", import.meta.url));
const read = (name) => readFile(path.join(root, name), "utf8");
const manifest = JSON.parse(await read("manifest.webmanifest"));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "/devocional");
assert.equal(manifest.lang, "pt-BR");
for (const icon of manifest.icons) {
  const png = await readFile(path.join(root, icon.src));
  const [width, height] = icon.sizes.split("x").map(Number);
  assert.equal(png.readUInt32BE(16), width, "Largura do ícone divergente");
  assert.equal(png.readUInt32BE(20), height, "Altura do ícone divergente");
}
for (const license of ["Lora-OFL.txt", "Inter-OFL.txt"])
  assert.match(await read("licenses/" + license), /SIL OPEN FONT LICENSE/);
const assets = await readdir(path.join(root, "assets"));
for (const asset of assets.filter((name) => name.endsWith(".js"))) {
  const content = await read("assets/" + asset);
  for (const fixture of [
    "Marina Oliveira",
    "Daniel Almeida",
    "Nem sempre o silêncio chega",
    "createPreviewRepository",
    "devotio_local_session",
    "/__local/",
    "createLocalRepository",
  ])
    assert.ok(!content.includes(fixture), `Fixture encontrada em ${asset}`);
}
const cache = [];
const routes = [];
class NavigationRoute {
  constructor(handler) {
    this.handler = handler;
  }
}
const workbox = {
  precacheAndRoute(entries) {
    cache.push(...entries);
  },
  cleanupOutdatedCaches() {},
  registerRoute(route) {
    routes.push(route);
  },
  NavigationRoute,
  createHandlerBoundToURL(url) {
    return url;
  },
};
// Execute only the generated registration in an isolated context. No network or DOM.
runInNewContext(
  await read("sw.js"),
  {
    self: { define: true, addEventListener() {} },
    define(_dependencies, factory) {
      factory(workbox);
    },
  },
  { timeout: 1000 },
);
assert.ok(
  cache.some(({ url }) => url === "index.html"),
  "Shell ausente do precache",
);
for (const { url } of cache) {
  assert.match(
    url,
    /^(?:index\.html|manifest\.webmanifest|(?:icon-\d+|apple-touch-icon)\.png|favicon\.svg|assets\/[a-zA-Z0-9_.-]+\.(?:js|css|woff2))$/,
    "Recurso fora do shell no cache",
  );
}
assert.equal(routes.length, 1, "Não adicionar cache de APIs autenticadas");
assert.ok(routes[0] instanceof NavigationRoute);
assert.equal(routes[0].handler, "index.html");
assert.match(await read("_redirects"), /\/\*\s+\/index\.html\s+200/);
console.log(
  `Build verificado: manifest, ícones, licenças, ${cache.length} recursos estáticos e ausência de fixtures. Nenhum cache de API registrado.`,
);

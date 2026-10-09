import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { alm1911Base, alm1911Revision, bibleChapterSchema, bibleCatalogSchema } from "../packages/domain/validators/bible.ts";

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
console.log(
  `Build verificado: manifest, ícones, licenças, ${cache.length} recursos estáticos e ausência de fixtures. Nenhum cache de API registrado.`,
);
const biblePath = alm1911Base.slice(1);
const catalog = bibleCatalogSchema.parse(JSON.parse(await read(`${biblePath}/catalog.json`)));
assert.equal(catalog.version, "alm1911");
assert.equal(catalog.books.length, 66);
const source = JSON.parse(await read(`${biblePath}/source.json`));
assert.equal(source.sha256, alm1911Revision);
let chapterCount = 0, verseCount = 0;
for (const book of catalog.books) for (let number = 1; number <= book.chapters; number++) {
  const chapter = bibleChapterSchema.parse(JSON.parse(await read(`${biblePath}/${book.abbrev}/${number}.json`)));
  assert.equal(chapter.version, "alm1911"); assert.equal(chapter.book.abbrev, book.abbrev); assert.equal(chapter.chapter, number);
  chapterCount++; verseCount += chapter.verses.length;
}
assert.equal(chapterCount, 1189); assert.equal(verseCount, 31101);
const search = JSON.parse(await read(`${biblePath}/search.json`));
assert.equal(search.length, verseCount);
assert.ok(cache.every(({ url }) => !url.includes("bibles/")), "Corpus não pertence ao precache do shell");
for (const asset of assets.filter(name => name.endsWith(".js")))
  assert.ok(!(await read(`assets/${asset}`)).includes("No principio creou Deus os céus e a terra."), "Não empacotar o corpus no JavaScript");
console.log("ALM1911 no build público: 66 livros, 1.189 capítulos, 31.101 versículos; corpus fora do JS/precache.");

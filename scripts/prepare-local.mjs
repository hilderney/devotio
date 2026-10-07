import { mkdir, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

// Pinned source from the provider selected by the product owner. No fallback edition.
const revision = "97f6803414d9aa0de570f11ffea9d46e7aff9df6";
const root = fileURLToPath(new URL("../.data/bible/", import.meta.url));
const source = `https://raw.githubusercontent.com/omarcoscardoso/abibliadigital-api-br/${revision}/data/json/pt_aa.json`;
async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`A fonte respondeu ${response.status}: ${url}`);
  return response.text();
}
console.log("Preparando somente AA, da ABíbliaDigital, para avaliação local…");
const [text, books] = await Promise.all([download(source), download("https://abibliadigital.api.br/api/books")]);
const data = JSON.parse(text.replace(/^\uFEFF/, ""));
const catalog = JSON.parse(books);
const total = data.reduce((sum, book) => sum + book.chapters.reduce((n, verses) => n + verses.length, 0), 0);
if (data.length !== 66 || catalog.length !== 66 || total !== 31104) throw new Error("Conteúdo divergente. Nenhum arquivo local foi substituído.");
await mkdir(root, { recursive: true });
for (const [name, content] of [["aa.json", text], ["books.json", books], ["revision.txt", revision]]) {
  await writeFile(path.join(root, name + ".tmp"), content, "utf8");
  await rename(path.join(root, name + ".tmp"), path.join(root, name));
}
console.log(`Fonte: ${source}\nSHA256: ${createHash("sha256").update(text.replace(/^\uFEFF/, "")).digest("hex")}\n66 livros, 31.104 versículos. Execute npm run dev; a importação no SQLite é atômica e idempotente.`);

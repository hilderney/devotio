import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
const base = "http://127.0.0.1:3000";
const command = (body, cookie = "") => fetch(base + "/__local/command", { method: "POST", headers: { "Content-Type": "application/json", Origin: base, Cookie: cookie, "X-Devotio-Profile": "marina" }, body: JSON.stringify(body) });
const read = async (input, cookie = "") => {
  const response = await fetch(base + "/__local/query?input=" + encodeURIComponent(JSON.stringify(input)), { headers: { Cookie: cookie, "X-Devotio-Profile": "marina" } });
  assert.equal(response.status, 200); return response.json();
};
const session = await fetch(base + "/__local/session").then(r => r.json());
assert.equal(session.profiles.length, 4);
const login = await command({ action: "login", profileId: "marina" });
assert.equal(login.status, 200);
const cookie = login.headers.get("set-cookie").split(";")[0];
try {
  const bible = await read({ query: "bible" }, cookie);
  assert.equal(bible.books.length, 66); assert.equal(bible.verses, 31104);
  const chapter = await read({ query: "chapter", abbrev: "tt", chapter: 3 }, cookie);
  assert.equal(chapter.verses.length, 15);
  const search = await read({ query: "search", text: "oração", page: 0 }, cookie);
  assert.ok(search.total > 0); assert.ok(search.verses.length <= 40);
  const reading = await read({ query: "reading", timeZone: "America/Sao_Paulo" }, cookie);
  assert.equal(reading.dates.length, 8);
  const home = await read({ query: "home", date: reading.dates[0], timeZone: "America/Sao_Paulo" }, cookie);
  assert.equal(home.user.id, "marina");
  const batch = await read({ query: "devotionals", dates: reading.dates, timeZone: "America/Sao_Paulo" }, cookie);
  assert.equal(Object.keys(batch).length, 8);
  assert.deepEqual(batch[reading.dates[0]], home);
  const groups = await read({ query: "communities" }, cookie);
  assert.ok(groups.some(g => g.id === "esperanca"));
  const denied = await command({ action: "sendMessage", id: "esperanca", content: "Não deve ser publicada" }, cookie);
  assert.equal(denied.status, 403);
  const databasePath = fileURLToPath(new URL("../.data/devotio.sqlite", import.meta.url)).replaceAll("\\", "/");
  const privateFile = await fetch(base + "/@fs/" + databasePath);
  assert.equal(privateFile.status, 403, "O banco SQLite não pode ser servido pelo Vite");
  console.log("Servidor local verificado: login, 8 datas, 66 livros AA, leitura, busca, grupos, bloqueio de escrita e proteção do arquivo SQLite.");
} finally { await command({ action: "logout" }, cookie); }

// Multiple-dot filename excludes this development module from Convex entry points.
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { randomUUID, createHash } from "node:crypto";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { LOCAL_SESSION_SECONDS } from "../../domain/local-cache";
import {
  bibleDatasetSchema, bibleBooksSchema, canManage, canRemoveMember, canPublish,
  isPublished, dateInZone, recentDates, isRecent, searchWords,
  type LocalProfile, type Devotional, type HomeData, type Community, type CommunityDetail,
  type Member, type Favorite, type BibleBook, type BibleChapter, type BibleResults,
  type BibleCatalog, type EditorialEntry, type LocalCommand, type LocalQuery,
} from "../../domain/index";

export class LocalError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export const profiles: LocalProfile[] = [
  { id: "daniel", name: "Daniel Almeida", label: "Liderança · AG", description: "Administra a Comunidade Esperança. Publica avisos e organiza listas.", editorial: false },
  { id: "marina", name: "Marina Oliveira", label: "Membro", description: "Participa da Esperança. Lê o mural e marca apenas seus próprios itens.", editorial: false },
  { id: "lucas", name: "Lucas Santos", label: "Leitor sem comunidade", description: "Leia, salve favoritos ou entre em um grupo com seu código.", editorial: false },
  { id: "ester", name: "Ester Costa", label: "Editorial", description: "Prepara, corrige e retira devocionais de teste. Sem gestão automática dos grupos.", editorial: true },
];
type Row = Record<string, unknown>;
type PublicationRow = { data: string; publishedAt: number; withdrawn: number };
export class LocalDatabase {
  readonly db: DatabaseSync;
  constructor(path: string, bibleDirectory?: string, readonly now = () => Date.now()) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, userId TEXT NOT NULL REFERENCES users(id), expiresAt INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS communities (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, scripture TEXT NOT NULL DEFAULT '', inviteCode TEXT NOT NULL UNIQUE);
      CREATE TABLE IF NOT EXISTS members (id TEXT PRIMARY KEY, communityId TEXT NOT NULL REFERENCES communities(id), userId TEXT NOT NULL REFERENCES users(id), role TEXT NOT NULL CHECK(role IN ('admin','member')), UNIQUE(communityId,userId));
      CREATE TABLE IF NOT EXISTS messages (seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL, communityId TEXT NOT NULL REFERENCES communities(id), userId TEXT NOT NULL REFERENCES users(id), content TEXT NOT NULL, sentAt INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS messages_group ON messages(communityId,seq);
      CREATE TABLE IF NOT EXISTS checklists (id TEXT PRIMARY KEY, communityId TEXT NOT NULL REFERENCES communities(id), name TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, listId TEXT NOT NULL REFERENCES checklists(id), text TEXT NOT NULL, position INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS ticks (itemId TEXT NOT NULL REFERENCES items(id), userId TEXT NOT NULL REFERENCES users(id), PRIMARY KEY(itemId,userId));
      CREATE TABLE IF NOT EXISTS devotionals (date TEXT PRIMARY KEY, data TEXT NOT NULL, publishedAt INTEGER NOT NULL, withdrawn INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS favorites (userId TEXT NOT NULL REFERENCES users(id), date TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(userId,date));
      CREATE TABLE IF NOT EXISTS audit (id TEXT PRIMARY KEY, userId TEXT NOT NULL REFERENCES users(id), action TEXT NOT NULL, date TEXT NOT NULL, reason TEXT NOT NULL, at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS bibleBooks (abbrev TEXT PRIMARY KEY, data TEXT NOT NULL, bookOrder INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS bibleVerses (id INTEGER PRIMARY KEY, abbrev TEXT NOT NULL REFERENCES bibleBooks(abbrev), chapter INTEGER NOT NULL, number INTEGER NOT NULL, text TEXT NOT NULL, UNIQUE(abbrev,chapter,number));
      CREATE VIRTUAL TABLE IF NOT EXISTS bibleSearch USING fts5(text, content='bibleVerses', content_rowid='id', tokenize='unicode61 remove_diacritics 2');
      PRAGMA user_version=1;`);
    if (bibleDirectory && existsSync(join(bibleDirectory, "aa.json"))) this.importBible(bibleDirectory);
    this.seed();
  }
  get<T = Row>(sql: string, ...args: SQLInputValue[]): T | undefined { return this.db.prepare(sql).get(...args) as T | undefined; }
  all<T = Row>(sql: string, ...args: SQLInputValue[]): T[] { return this.db.prepare(sql).all(...args) as T[]; }
  run(sql: string, ...args: SQLInputValue[]) { return this.db.prepare(sql).run(...args); }
  transaction<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try { const value = fn(); this.db.exec("COMMIT"); return value; }
    catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
  close() { this.db.close(); }
  importBible(directory: string) {
    const raw = readFileSync(join(directory, "aa.json"), "utf8").replace(/^\uFEFF/, "");
    const hash = createHash("sha256").update(raw).digest("hex");
    if (this.get<{ value: string }>("SELECT value FROM metadata WHERE key='bibleHash'")?.value === hash) return;
    const data = bibleDatasetSchema.parse(JSON.parse(raw));
    const catalog = bibleBooksSchema.parse(JSON.parse(readFileSync(join(directory, "books.json"), "utf8").replace(/^\uFEFF/, "")));
    const revision = readFileSync(join(directory, "revision.txt"), "utf8").trim();
    if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error("Commit da fonte bíblica inválido.");
    if (new Set(data.map(b => b.abbrev)).size !== 66) throw new Error("Livros bíblicos duplicados.");
    const total = data.reduce((sum, book) => sum + book.chapters.reduce((n, verses) => n + verses.length, 0), 0);
    if (total !== 31104) throw new Error("A edição AA deve conter 31.104 versículos; confira a fonte antes de atualizar.");
    this.transaction(() => {
      this.run("DELETE FROM bibleVerses"); this.run("DELETE FROM bibleBooks");
      const bookInsert = this.db.prepare("INSERT INTO bibleBooks VALUES (?,?,?)");
      const verseInsert = this.db.prepare("INSERT INTO bibleVerses(abbrev,chapter,number,text) VALUES (?,?,?,?)");
      data.forEach((book, order) => {
        // The provider's AA file uses 'jó'/'atos'; its API catalog uses 'job'/'at'.
        const abbrev = ({ "jó": "job", atos: "at" } as Record<string, string>)[book.abbrev] ?? book.abbrev;
        const metadata = catalog.find(b => b.abbrev.pt === abbrev) ?? catalog.find(b => b.abbrev.en === abbrev);
        // Confirmed catalog defects (04/10/2026): Titus says 2, Philemon says 4.
        // The official AA text has the complete 3 and 1 chapters respectively.
        const knownChapterCount = ({ tt: 3, fm: 1 } as Record<string, number>)[abbrev];
        if (!metadata || (knownChapterCount ?? metadata.chapters) !== book.chapters.length) throw new Error("Catálogo e texto divergentes: " + book.abbrev);
        const value: BibleBook = { abbrev: metadata.abbrev.pt, name: metadata.name, chapters: book.chapters.length, testament: metadata.testament, order };
        bookInsert.run(value.abbrev, JSON.stringify(value), order);
        book.chapters.forEach((verses, chapter) => verses.forEach((text, number) => verseInsert.run(value.abbrev, chapter + 1, number + 1, text)));
      });
      this.run("INSERT INTO bibleSearch(bibleSearch) VALUES('rebuild')");
      for (const [key, value] of Object.entries({ bibleHash: hash, bibleRevision: revision, bibleImportedAt: String(this.now()), bibleSource: `https://github.com/omarcoscardoso/abibliadigital-api-br/blob/${revision}/data/json/pt_aa.json` })) {
        this.run("INSERT OR REPLACE INTO metadata VALUES (?,?)", key, value);
      }
    });
  }
  private seed() {
    this.transaction(() => {
      for (const profile of profiles) this.run("INSERT OR IGNORE INTO users VALUES (?,?)", profile.id, JSON.stringify(profile));
      if (!this.get("SELECT value FROM metadata WHERE key='seed'")) {
        this.run("INSERT INTO communities VALUES ('esperanca','Comunidade Esperança','Um espaço para caminhar juntos na fé, no cuidado e na oração.','Que o amor seja o princípio de tudo o que fazemos.','ESPERANC')");
        this.run("INSERT INTO communities VALUES ('caminho','Comunidade Caminho','Outro grupo para verificar o isolamento de acesso.','','CAMINHOS')");
        for (const [group, user, role] of [["esperanca", "daniel", "admin"], ["esperanca", "marina", "member"], ["caminho", "ester", "admin"]]) {
          this.run("INSERT INTO members VALUES (?,?,?,?)", `${group}-${user}`, group, user, role);
        }
        this.run("INSERT INTO messages(id,communityId,userId,content,sentAt) VALUES ('welcome','esperanca','daniel',?,?)", "Seja bem-vindo. Este mural de demonstração é um espaço de cuidado e oração. Experimente também as listas da comunidade.", this.now());
        this.run("INSERT INTO checklists VALUES ('prayer','esperanca','Para levar em oração')");
        ["Pelas famílias da nossa comunidade", "Por quem precisa de acolhimento", "Por sabedoria nas pequenas decisões"].forEach((text, i) => this.run("INSERT INTO items VALUES (?,?,?,?)", `prayer-${i}`, "prayer", text, i));
        this.run("INSERT INTO metadata VALUES ('seed','1')");
      }
      recentDates(dateInZone(Intl.DateTimeFormat().resolvedOptions().timeZone, new Date(this.now()))).forEach((date, index) => {
        const verse = this.get<{ text: string }>("SELECT text FROM bibleVerses WHERE abbrev='sl' AND chapter=23 AND number=?", index % 6 + 1);
        const devotional: Devotional = {
          id: date, date, reference: verse ? `Salmos 23:${index % 6 + 1}` : "Leitura de demonstração", translation: verse ? "AA · ABíbliaDigital" : "Texto ilustrativo",
          scripture: verse?.text ?? "Um espaço para acolher a Palavra e encontrar descanso.",
          reflection: "Esta é uma reflexão ilustrativa para experimentar a leitura no Devotio. Faça uma pausa e leia o texto com atenção.\n\nO ambiente de desenvolvimento permite testar a publicação, os favoritos e a convivência em comunidade. Este conteúdo não recebeu revisão pastoral para publicação.",
          prayerSuggestion: "Senhor, ensina-me a escutar com atenção e a cuidar de quem está perto. Que eu encontre espaço para a tua Palavra neste dia. Amém.",
          credit: "Conteúdo de demonstração local. Reflexão e oração ilustrativas, sem revisão pastoral.",
        };
        this.run("INSERT OR IGNORE INTO devotionals VALUES (?,?,?,0)", date, JSON.stringify(devotional), this.now() - 86400000);
      });
    });
  }
  profile(id: string) {
    const row = this.get<{ data: string }>("SELECT data FROM users WHERE id=?", id);
    if (!row) throw new LocalError("Perfil não encontrado.", 401);
    return JSON.parse(row.data) as LocalProfile;
  }
  session(token?: string): LocalProfile | null {
    if (!token) return null;
    const row = this.get<{ userId: string }>("SELECT userId FROM sessions WHERE token=? AND expiresAt>?", token, this.now());
    return row ? this.profile(row.userId) : null;
  }
  login(id: string) {
    const profile = this.profile(id), token = randomUUID();
    this.run("DELETE FROM sessions WHERE expiresAt<=?", this.now());
    const expiresAt = this.now() + LOCAL_SESSION_SECONDS * 1000;
    this.run("INSERT INTO sessions VALUES (?,?,?)", token, id, expiresAt);
    return { token, profile, expiresAt };
  }
  sessionExpiresAt(token?: string): number | null {
    return token ? this.get<{ expiresAt: number }>("SELECT expiresAt FROM sessions WHERE token=? AND expiresAt>?", token, this.now())?.expiresAt ?? null : null;
  }
  logout(token: string) { this.run("DELETE FROM sessions WHERE token=?", token); }
  private membership(userId: string, id: string, manage = false) {
    const member = this.get<Member>("SELECT id,userId,role FROM members WHERE userId=? AND communityId=?", userId, id);
    if (!member) throw new LocalError("Esta comunidade não está disponível para sua conta.", 403);
    if (manage && !canManage(member.role)) throw new LocalError("Apenas a liderança pode realizar esta ação.", 403);
    return member;
  }
  private editor(user: LocalProfile) { if (!canPublish(user.editorial)) throw new LocalError("Acesso exclusivo da equipe editorial.", 403); }
  private published(date: string, timeZone: string): Devotional | null {
    if (!isRecent(date, dateInZone(timeZone, new Date(this.now())))) throw new LocalError("Esta data está fora da janela de leitura.", 403);
    const row = this.get<PublicationRow>("SELECT data,publishedAt,withdrawn FROM devotionals WHERE date=?", date);
    return row && isPublished(row.publishedAt, !!row.withdrawn, this.now()) ? JSON.parse(row.data) as Devotional : null;
  }
  query(user: LocalProfile, input: LocalQuery): unknown {
    switch (input.query) {
      case "session": return user;
      case "devotionals": return Object.fromEntries(input.dates.map(date => [date, this.query(user, { query: "home", date, timeZone: input.timeZone })]));
      case "home": return { user, devotional: this.published(input.date, input.timeZone), settings: { monthlyVerse: "Um coração atento ao que permanece.", monthlyReference: "Tema ilustrativo do mês", weeklyVerse: "Caminhar com presença e cuidado.", weeklyReference: "Tema ilustrativo da semana" } } satisfies HomeData;
      case "reading": return { dates: recentDates(dateInZone(input.timeZone, new Date(this.now()))), favorites: this.all<{ data: string }>("SELECT data FROM favorites WHERE userId=? ORDER BY date DESC", user.id).map(r => JSON.parse(r.data) as Favorite) };
      case "communities": return this.all<Community>("SELECT c.*,m.role FROM communities c JOIN members m ON m.communityId=c.id WHERE m.userId=? ORDER BY c.name", user.id).map(c => ({ ...c, inviteCode: canManage(c.role) ? c.inviteCode : undefined }));
      case "invite": return this.get("SELECT id,name FROM communities WHERE inviteCode=?", input.code) ?? null;
      case "community": return this.detail(user.id, input.id, input.cursor);
      case "bible": return this.catalog();
      case "chapter": return this.chapter(input.abbrev, input.chapter);
      case "search": return this.search(input.text, input.page);
      case "editorial": {
        this.editor(user);
        return this.all<PublicationRow>("SELECT data,publishedAt,withdrawn FROM devotionals ORDER BY date DESC LIMIT 100").map(r => ({ devotional: JSON.parse(r.data) as Devotional, withdrawn: !!r.withdrawn, publishedAt: r.publishedAt } satisfies EditorialEntry));
      }
    }
  }
  command(user: LocalProfile, input: LocalCommand): unknown {
    return this.transaction(() => {
      switch (input.action) {
        case "login": case "logout": throw new LocalError("Operação de sessão inválida.");
        case "createCommunity": {
          const id = randomUUID(), code = Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[parseInt(randomUUID().slice(0, 8), 16) % 31]).join("");
          this.run("INSERT INTO communities VALUES (?,?,?,'',?)", id, input.input.name, input.input.description, code);
          this.run("INSERT INTO members VALUES (?,?,?,'admin')", randomUUID(), id, user.id);
          return id;
        }
        case "joinCommunity": {
          const group = this.get<{ id: string }>("SELECT id FROM communities WHERE inviteCode=?", input.code);
          if (!group) throw new LocalError("Não encontramos uma comunidade com esse código.", 404);
          this.run("INSERT OR IGNORE INTO members VALUES (?,?,?,'member')", randomUUID(), group.id, user.id);
          return group.id;
        }
        case "sendMessage": this.membership(user.id, input.id, true); this.run("INSERT INTO messages(id,communityId,userId,content,sentAt) VALUES (?,?,?,?,?)", randomUUID(), input.id, user.id, input.content, this.now()); return null;
        case "updateScripture": this.membership(user.id, input.id, true); this.run("UPDATE communities SET scripture=? WHERE id=?", input.scripture, input.id); return null;
        case "createChecklist": {
          this.membership(user.id, input.id, true);
          const id = randomUUID(); this.run("INSERT INTO checklists VALUES (?,?,?)", id, input.id, input.input.name);
          input.input.items.forEach((text, index) => this.run("INSERT INTO items VALUES (?,?,?,?)", randomUUID(), id, text, index)); return null;
        }
        case "setTick": {
          const item = this.get<{ communityId: string }>("SELECT l.communityId FROM items i JOIN checklists l ON l.id=i.listId WHERE i.id=?", input.itemId);
          if (!item) throw new LocalError("Item não encontrado.", 404);
          this.membership(user.id, item.communityId);
          if (input.checked) this.run("INSERT OR IGNORE INTO ticks VALUES (?,?)", input.itemId, user.id);
          else this.run("DELETE FROM ticks WHERE itemId=? AND userId=?", input.itemId, user.id);
          return null;
        }
        case "removeMember": {
          this.membership(user.id, input.id, true);
          const member = this.get<Member>("SELECT * FROM members WHERE id=? AND communityId=?", input.memberId, input.id);
          if (!member) return null;
          const count = this.get<{ count: number }>("SELECT COUNT(*) count FROM members WHERE communityId=? AND role='admin'", input.id)!.count;
          if (!canRemoveMember(member.role, count)) throw new LocalError("A comunidade precisa manter ao menos um administrador.");
          this.run("DELETE FROM members WHERE id=?", member.id); return null;
        }
        case "setFavorite": {
          if (!input.saved) { this.run("DELETE FROM favorites WHERE userId=? AND date=?", user.id, input.date); return null; }
          const devotional = this.published(input.date, input.timeZone);
          if (!devotional) throw new LocalError("Este devocional não está disponível para favoritar.", 404);
          this.run("INSERT OR IGNORE INTO favorites VALUES (?,?,?)", user.id, input.date, JSON.stringify({ devotional, favoritedAt: this.now() } satisfies Favorite)); return null;
        }
        case "publish": {
          this.editor(user);
          const { date, publishedAt, reason, ...content } = input.input;
          this.run("INSERT INTO devotionals VALUES (?,?,?,0) ON CONFLICT(date) DO UPDATE SET data=excluded.data,publishedAt=excluded.publishedAt,withdrawn=0", date, JSON.stringify({ ...content, date, id: date }), publishedAt);
          this.audit(user.id, "publish", date, reason); return null;
        }
        case "withdraw": this.editor(user); this.run("UPDATE devotionals SET withdrawn=1 WHERE date=?", input.date); this.audit(user.id, "withdraw", input.date, input.reason); return null;
      }
    });
  }
  private audit(userId: string, action: string, date: string, reason: string) { this.run("INSERT INTO audit VALUES (?,?,?,?,?,?)", randomUUID(), userId, action, date, reason, this.now()); }
  private detail(userId: string, id: string, cursor: string | null): CommunityDetail {
    const association = this.membership(userId, id);
    const group = this.get<Omit<Community, "role">>("SELECT * FROM communities WHERE id=?", id)!;
    const messages = this.all<{ seq: number; id: string; content: string; name: string; sentAt: number }>("SELECT m.seq,m.id,m.content,json_extract(u.data,'$.name') name,m.sentAt FROM messages m JOIN users u ON u.id=m.userId WHERE communityId=? AND seq<? ORDER BY seq DESC LIMIT 51", id, cursor ? Number(cursor) : Number.MAX_SAFE_INTEGER);
    const hasMore = messages.length > 50, page = messages.slice(0, 50);
    return {
      community: { ...group, role: association.role, inviteCode: canManage(association.role) ? group.inviteCode : undefined },
      members: this.all<Member>("SELECT m.id,m.userId,m.role,json_extract(u.data,'$.name') name FROM members m JOIN users u ON u.id=m.userId WHERE m.communityId=? ORDER BY m.role,u.id", id),
      messages: page.map(({ seq: _seq, ...m }) => m).reverse(), hasMore, nextCursor: hasMore ? String(page.at(-1)!.seq) : null,
      lists: this.all<{ id: string; name: string }>("SELECT id,name FROM checklists WHERE communityId=? ORDER BY rowid", id).map(list => ({ ...list, items: this.all<{ id: string; text: string }>("SELECT id,text FROM items WHERE listId=? ORDER BY position", list.id).map(item => ({ ...item, checked: !!this.get("SELECT 1 FROM ticks WHERE itemId=? AND userId=?", item.id, userId), count: this.get<{ count: number }>("SELECT COUNT(*) count FROM ticks t JOIN members m ON m.userId=t.userId AND m.communityId=? WHERE t.itemId=?", id, item.id)!.count })) })),
    };
  }
  catalog(): BibleCatalog {
    return { version: "aa", books: this.all<{ data: string }>("SELECT data FROM bibleBooks ORDER BY bookOrder").map(r => JSON.parse(r.data) as BibleBook), verses: this.get<{ count: number }>("SELECT COUNT(*) count FROM bibleVerses")!.count, importedAt: Number(this.get<{ value: string }>("SELECT value FROM metadata WHERE key='bibleImportedAt'")?.value) || null, source: this.get<{ value: string }>("SELECT value FROM metadata WHERE key='bibleSource'")?.value ?? "" };
  }
  chapter(abbrev: string, chapter: number): BibleChapter | null {
    const row = this.get<{ data: string }>("SELECT data FROM bibleBooks WHERE abbrev=?", abbrev);
    if (!row) return null;
    const book = JSON.parse(row.data) as BibleBook;
    if (chapter > book.chapters) return null;
    return { book, chapter, verses: this.all<{ number: number; text: string }>("SELECT number,text FROM bibleVerses WHERE abbrev=? AND chapter=? ORDER BY number", abbrev, chapter).map(v => ({ ...v, abbrev, bookName: book.name, chapter })) };
  }
  private search(query: string, page: number): BibleResults {
    const words = searchWords(query);
    if (!words.length) return { verses: [], total: 0, page };
    const match = words.map(w => '"' + w + '"').join(" AND ");
    const total = this.get<{ count: number }>("SELECT COUNT(*) count FROM bibleSearch WHERE bibleSearch MATCH ?", match)!.count;
    const verses = this.all<BibleResults["verses"][number]>("SELECT v.abbrev,json_extract(b.data,'$.name') bookName,v.chapter,v.number,v.text FROM bibleSearch s JOIN bibleVerses v ON v.id=s.rowid JOIN bibleBooks b ON b.abbrev=v.abbrev WHERE bibleSearch MATCH ? ORDER BY b.bookOrder,v.chapter,v.number LIMIT 40 OFFSET ?", match, page * 40);
    return { verses, total, page };
  }
}

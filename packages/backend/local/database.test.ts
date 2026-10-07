import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep, basename } from "node:path";
import { LocalDatabase, LocalError } from "./database.local";
import { recentDates, localQuerySchema, type CommunityDetail, type ReadingData, type Devotional, type PublicationInput, type HomeData } from "domain/core";

const stores: LocalDatabase[] = [];
const dirs: string[] = [];
const fixed = Date.parse("2026-10-04T15:00:00Z");
function setup() {
  let now = fixed;
  const db = new LocalDatabase(":memory:", undefined, () => now); stores.push(db);
  return { db, advance: (days: number) => { now += days * 86400000; }, leader: db.profile("daniel"), member: db.profile("marina"), outsider: db.profile("lucas"), editor: db.profile("ester") };
}
const publication: PublicationInput = { date: "2026-10-04", reference: "Salmos 23:1", translation: "AA", scripture: "Texto para teste", reflection: "Reflexão de teste", prayerSuggestion: "Oração de teste", credit: "Teste", licenseEvidence: "Fixture de teste", reviewedBy: "Ester", reason: "Verificação", publishedAt: fixed - 1 };
afterEach(() => { stores.splice(0).forEach(db => db.close()); dirs.splice(0).forEach(dir => {
  if (!resolve(dir).startsWith(resolve(tmpdir()) + sep) || !basename(dir).startsWith("devotio-test-")) throw new Error("Diretório temporário inesperado");
  rmSync(dir, { recursive: true, force: true });
}); });
describe("SQLite local: autorização, snapshots e persistência", () => {
  it("entrega lote limitado à janela e permite solicitar somente uma nova data", () => {
    const { db, member, advance } = setup();
    const dates = recentDates("2026-10-04");
    const input = { query: "devotionals", dates, timeZone: "UTC" } as const;
    const batch = db.query(member, localQuerySchema.parse(input)) as Record<string, HomeData>;
    expect(Object.keys(batch)).toEqual(dates);
    expect(Object.values(batch).every(value => value.devotional && value.user.id === member.id)).toBe(true);
    expect(localQuerySchema.safeParse({ ...input, dates: [...dates, "2026-09-01"] }).success).toBe(false);
    expect(localQuerySchema.safeParse({ ...input, dates: [dates[0], dates[0]] }).success).toBe(false);
    expect(() => db.query(member, { ...input, dates: ["2026-09-01"] })).toThrow("janela");
    advance(1);
    expect(db.query(member, { ...input, dates: ["2026-10-05"] })).toMatchObject({ "2026-10-05": { devotional: null } });
  });
  it("isola grupos, limita ações da liderança e protege o último administrador", () => {
    const { db, leader, member, outsider } = setup();
    expect(() => db.query(outsider, { query: "community", id: "esperanca", cursor: null })).toThrow(LocalError);
    expect(() => db.command(member, { action: "sendMessage", id: "esperanca", content: "Não permitido" })).toThrow("liderança");
    expect(() => db.command(leader, { action: "sendMessage", id: "caminho", content: "Não permitido" })).toThrow("não está disponível");
    expect(() => db.command(leader, { action: "removeMember", id: "esperanca", memberId: "esperanca-daniel" })).toThrow("administrador");
    db.command(leader, { action: "sendMessage", id: "esperanca", content: "Aviso local" });
    const detail = db.query(member, { query: "community", id: "esperanca", cursor: null }) as CommunityDetail;
    expect(detail.messages.at(-1)?.content).toBe("Aviso local");
    expect(detail.community.inviteCode).toBeUndefined();
  });
  it("preserva ticks próprios, idempotência e exclui removidos da contagem", () => {
    const { db, member, leader, outsider } = setup();
    const command = { action: "setTick", itemId: "prayer-0", checked: true } as const;
    expect(() => db.command(outsider, command)).toThrow();
    db.command(member, command); db.command(member, command);
    const detail = (who: typeof member) => db.query(who, { query: "community", id: "esperanca", cursor: null }) as CommunityDetail;
    expect(detail(member).lists[0].items[0]).toMatchObject({ checked: true, count: 1 });
    expect(detail(leader).lists[0].items[0]).toMatchObject({ checked: false, count: 1 });
    db.command(leader, { action: "removeMember", id: "esperanca", memberId: "esperanca-marina" });
    expect(() => db.command(member, command)).toThrow();
    expect(detail(leader).lists[0].items[0].count).toBe(0);
  });
  it("confirma convite, associa só uma vez e não aceita códigos inexistentes", () => {
    const { db, outsider } = setup();
    expect(db.query(outsider, { query: "invite", code: "ESPERANC" })).toEqual({ id: "esperanca", name: "Comunidade Esperança" });
    db.command(outsider, { action: "joinCommunity", code: "ESPERANC" }); db.command(outsider, { action: "joinCommunity", code: "ESPERANC" });
    expect(db.all("SELECT * FROM members WHERE userId='lucas'")).toHaveLength(1);
    expect(() => db.command(outsider, { action: "joinCommunity", code: "INVALIDO" })).toThrow();
  });
  it("mantém snapshots privados, não sobrescreve após correção e permite removê-los fora da janela", () => {
    const { db, editor, member, leader, advance } = setup();
    db.command(editor, { action: "publish", input: publication });
    const save = { action: "setFavorite", date: publication.date, timeZone: "UTC", saved: true } as const;
    db.command(member, save);
    db.command(editor, { action: "publish", input: { ...publication, scripture: "Correção" } }); db.command(member, save);
    const favorites = (who: typeof member) => (db.query(who, { query: "reading", timeZone: "UTC" }) as ReadingData).favorites;
    expect(favorites(member)[0].devotional.scripture).toBe("Texto para teste"); expect(favorites(leader)).toHaveLength(0);
    db.command(editor, { action: "withdraw", date: publication.date, reason: "Retirar teste" });
    expect((db.query(member, { query: "home", date: publication.date, timeZone: "UTC" }) as { devotional: Devotional | null }).devotional).toBeNull();
    advance(9);
    expect(() => db.query(member, { query: "home", date: publication.date, timeZone: "UTC" })).toThrow("janela");
    expect(favorites(member)).toHaveLength(1);
    db.command(member, { ...save, saved: false }); expect(favorites(member)).toHaveLength(0);
  });
  it("mantém agendados fora da leitura e audita somente operações autorizadas", () => {
    const { db, leader, editor, member } = setup();
    expect(() => db.command(leader, { action: "publish", input: publication })).toThrow("editorial");
    expect(() => db.query(member, { query: "editorial" })).toThrow("editorial");
    db.command(editor, { action: "publish", input: { ...publication, publishedAt: fixed + 60000 } });
    expect((db.query(member, { query: "home", date: publication.date, timeZone: "UTC" }) as { devotional: unknown }).devotional).toBeNull();
    expect(() => db.command(member, { action: "setFavorite", date: publication.date, timeZone: "UTC", saved: true })).toThrow("disponível");
    expect(db.all("SELECT * FROM audit")).toHaveLength(1);
  });
  it("pagina mural por cursor estável mesmo com nova mensagem", () => {
    const { db, leader, member } = setup();
    for (let i = 0; i < 55; i++) db.command(leader, { action: "sendMessage", id: "esperanca", content: String(i) });
    const first = db.query(member, { query: "community", id: "esperanca", cursor: null }) as CommunityDetail;
    db.command(leader, { action: "sendMessage", id: "esperanca", content: "Depois" });
    const second = db.query(member, { query: "community", id: "esperanca", cursor: first.nextCursor }) as CommunityDetail;
    expect(first.messages).toHaveLength(50); expect(second.messages).toHaveLength(6);
    expect(new Set([...first.messages, ...second.messages].map(m => m.id)).size).toBe(56);
  });
  it("persiste após reiniciar, não ressemeia dados retirados e revoga sessões", () => {
    const dir = mkdtempSync(join(tmpdir(), "devotio-test-")); dirs.push(dir);
    const path = join(dir, "test.sqlite");
    const first = new LocalDatabase(path, undefined, () => fixed);
    const session = first.login("marina");
    first.command(session.profile, { action: "setFavorite", date: "2026-10-04", timeZone: "UTC", saved: true });
    first.command(first.profile("ester"), { action: "withdraw", date: "2026-10-04", reason: "Teste" }); first.close();
    const second = new LocalDatabase(path, undefined, () => fixed); stores.push(second);
    expect(second.session(session.token)?.id).toBe("marina");
    expect((second.query(session.profile, { query: "reading", timeZone: "UTC" }) as ReadingData).favorites).toHaveLength(1);
    expect(second.get<{ withdrawn: number }>("SELECT withdrawn FROM devotionals WHERE date='2026-10-04'")?.withdrawn).toBe(1);
    second.logout(session.token); expect(second.session(session.token)).toBeNull();
  });
  it("expira sessões sem aceitar identidade desconhecida", () => {
    const { db, advance } = setup(); const { token } = db.login("marina"); advance(2);
    expect(db.session(token)?.id).toBe("marina"); advance(29);
    expect(db.session(token)).toBeNull(); expect(() => db.login("admin-global")).toThrow();
  });
});

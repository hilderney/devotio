import type { IncomingMessage, ServerResponse } from "node:http";
import { localCommandSchema, localQuerySchema, validationMessage } from "../../domain/index";
import { ZodError } from "zod";
import { LocalDatabase, LocalError, profiles } from "./database.local";
import { LOCAL_SESSION_SECONDS } from "../../domain/local-cache";

const cookieName = "devotio_local_session";
function token(req: IncomingMessage) {
  return req.headers.cookie?.split(";").map(v => v.trim()).find(v => v.startsWith(cookieName + "="))?.slice(cookieName.length + 1);
}
function cookie(res: ServerResponse, value: string, maxAge: number) {
  res.setHeader("Set-Cookie", `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`);
}
async function body(req: IncomingMessage): Promise<unknown> {
  let content = "";
  for await (const chunk of req) {
    content += String(chunk);
    if (Buffer.byteLength(content) > 65536) throw new LocalError("O conteúdo enviado é muito grande.", 413);
  }
  try { return JSON.parse(content); } catch { throw new LocalError("Requisição inválida."); }
}
export function createLocalHandler(database: LocalDatabase) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const send = (status: number, data: unknown) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(JSON.stringify(data));
    };
    try {
      const host = req.headers.host ?? "";
      if (!["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress ?? "")) throw new LocalError("Conexão não local.", 403);
      if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) throw new LocalError("O ambiente de desenvolvimento só aceita acesso local.", 403);
      if (req.headers.origin && req.headers.origin !== `http://${host}`) throw new LocalError("Origem da requisição inválida.", 403);
      const url = new URL(req.url ?? "/", `http://${host}`);
      const path = url.pathname.replace(/^\/__local/, "");
      const sessionToken = token(req);
      if (req.method === "GET" && path === "/session") return send(200, { profile: database.session(sessionToken), profiles, expiresAt: database.sessionExpiresAt(sessionToken) });
      if (req.method === "GET" && path === "/query") {
        const user = database.session(sessionToken);
        if (!user || req.headers["x-devotio-profile"] !== user.id) throw new LocalError("Sua sessão mudou. Entre novamente.", 401);
        let value: unknown;
        try { value = JSON.parse(url.searchParams.get("input") ?? "null"); } catch { throw new LocalError("Consulta inválida."); }
        return send(200, database.query(user, localQuerySchema.parse(value)));
      }
      if (req.method !== "POST" || path !== "/command") throw new LocalError("Operação não encontrada.", 404);
      if (req.headers.origin !== `http://${host}` || !req.headers["content-type"]?.startsWith("application/json")) throw new LocalError("Origem da requisição inválida.", 403);
      const input = localCommandSchema.parse(await body(req));
      if (input.action === "login") {
        if (sessionToken) database.logout(sessionToken);
        const result = database.login(input.profileId);
        cookie(res, result.token, LOCAL_SESSION_SECONDS);
        return send(200, { profile: result.profile, expiresAt: result.expiresAt });
      }
      if (input.action === "logout") {
        if (sessionToken) database.logout(sessionToken);
        cookie(res, "", 0); return send(200, null);
      }
      const user = database.session(sessionToken);
      if (!user || req.headers["x-devotio-profile"] !== user.id) throw new LocalError("Sua sessão mudou. Entre novamente.", 401);
      return send(200, database.command(user, input));
    } catch (error) {
      const status = error instanceof LocalError ? error.status : error instanceof ZodError ? 400 : 500;
      if (status === 500) console.error("Falha no backend local:", error);
      send(status, { error: status === 500 ? "Não foi possível concluir a operação local." : validationMessage(error) });
    }
  };
}

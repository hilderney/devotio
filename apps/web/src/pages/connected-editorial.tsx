import { useEffect, useState } from "react";
import {
  validationMessage,
  type ConnectedEditorial,
  type ConnectedPublication,
} from "domain/core";
import { Button } from "../ui/button";
import { ErrorMessage, Loading } from "../components";
import "../styles/administration.css";

export function ConnectedEditorialPage({
  editorial,
}: {
  editorial: ConnectedEditorial;
}) {
  const [data, setData] = useState<{
    entries: ConnectedPublication[];
    cursor: string | null;
  }>();
  const [cursor, setCursor] = useState<string | null>(null),
    [revision, setRevision] = useState(0);
  const [edit, setEdit] = useState<ConnectedPublication | "new" | null>(null),
    [withdraw, setWithdraw] = useState<ConnectedPublication | null>(null);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setData(undefined);
    editorial
      .list(cursor)
      .then((data) => {
        if (active) setData(data);
      })
      .catch((error) => {
        if (active) setError(validationMessage(error));
      });
    return () => {
      active = false;
    };
  }, [editorial, cursor, revision]);
  const fields = [
    ["reference", "Referência"],
    ["translation", "Tradução"],
    ["scripture", "Texto bíblico"],
    ["reflection", "Reflexão"],
    ["prayerSuggestion", "Sugestão de oração"],
    ["credit", "Créditos"],
    ["licenseEvidence", "Autorização / licença"],
  ] as const;
  return (
    <section className="page connected-editorial">
      <h1>Gestão editorial</h1>
      <Button disabled={busy} onClick={() => setEdit("new")}>
        Cadastrar devocional
      </Button>
      {error && <ErrorMessage message={error} />}
      {notice && <p role="status">{notice}</p>}
      {edit && (
        <form
          key={edit === "new" ? "new" : edit.id}
          className="admin-form admin-card"
          onSubmit={async (event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            const get = (key: string) => String(values.get(key));
            setBusy(true);
            setError("");
            try {
              await editorial.save({
                date: get("date"),
                reference: get("reference"),
                translation: get("translation"),
                scripture: get("scripture"),
                reflection: get("reflection"),
                prayerSuggestion: get("prayerSuggestion"),
                credit: get("credit"),
                licenseEvidence: get("licenseEvidence"),
                publishedAt: new Date(get("publishedAt")).getTime(),
                reason: get("reason"),
                mode: edit === "new" ? "create" : "update",
                ...(edit !== "new" && edit.audioUrl
                  ? { audioUrl: edit.audioUrl }
                  : {}),
              });
              setEdit(null);
              setRevision((n) => n + 1);
              setNotice("Devocional salvo.");
            } catch (error) {
              setError(validationMessage(error));
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2>{edit === "new" ? "Novo devocional" : "Editar devocional"}</h2>
          <label>
            Data da leitura
            <input
              name="date"
              type="date"
              required
              readOnly={edit !== "new"}
              defaultValue={edit === "new" ? "" : edit.date}
            />
          </label>
          {fields.map(([key, label]) => (
            <label key={key}>
              {label}
              {["scripture", "reflection", "prayerSuggestion"].includes(key) ? (
                <textarea
                  name={key}
                  required
                  defaultValue={edit === "new" ? "" : edit[key]}
                />
              ) : (
                <input
                  name={key}
                  required
                  defaultValue={edit === "new" ? "" : edit[key]}
                />
              )}
            </label>
          ))}
          <label>
            Disponível a partir de (horário deste dispositivo)
            <input
              name="publishedAt"
              type="datetime-local"
              required
              defaultValue={
                edit === "new"
                  ? ""
                  : new Date(
                      edit.publishedAt -
                        new Date(edit.publishedAt).getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .slice(0, 16)
              }
            />
          </label>
          <label>
            Motivo da publicação ou correção
            <input name="reason" required maxLength={1000} />
          </label>
          <p>
            Confira referência, tradução, autorização e conteúdo antes de
            publicar.
          </p>
          <div className="admin-actions">
            <Button type="submit" disabled={busy}>
              Salvar publicação
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => setEdit(null)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
      {withdraw && (
        <form
          className="admin-card admin-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const reason = String(
              new FormData(event.currentTarget).get("reason"),
            );
            setBusy(true);
            setError("");
            try {
              await editorial.withdraw(withdraw.id, reason);
              setWithdraw(null);
              setRevision((n) => n + 1);
              setNotice("Publicação retirada.");
            } catch (error) {
              setError(validationMessage(error));
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2>Retirar publicação de {withdraw.date}?</h2>
          <label>
            Motivo
            <input name="reason" required maxLength={1000} />
          </label>
          <div className="admin-actions">
            <Button type="submit" disabled={busy}>
              Confirmar retirada
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => setWithdraw(null)}
            >
              Cancelar retirada
            </Button>
          </div>
        </form>
      )}
      {!data ? (
        !error && <Loading />
      ) : (
        <>
          {data.entries.length === 0 && <p>Nenhum devocional cadastrado.</p>}
          {data.entries.map((entry) => (
            <article className="admin-card" key={entry.id}>
              <p>
                {entry.date} · {entry.reference} ·{" "}
                {entry.withdrawn ? "Retirado" : "Publicado / programado"}
              </p>
              <div className="admin-actions">
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => setEdit(entry)}
                >
                  Editar publicação
                </Button>
                <Button
                  variant="ghost"
                  disabled={busy || entry.withdrawn}
                  onClick={() => setWithdraw(entry)}
                >
                  Retirar
                </Button>
              </div>
            </article>
          ))}
          <div className="admin-actions">
            <Button
              variant="secondary"
              disabled={!cursor || busy}
              onClick={() => setCursor(null)}
            >
              Primeira página
            </Button>
            <Button
              variant="secondary"
              disabled={!data.cursor || busy}
              onClick={() => setCursor(data.cursor)}
            >
              Próxima página
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

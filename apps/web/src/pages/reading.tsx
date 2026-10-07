import { useContext, useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useHome, useRepository, useWatch } from "domain/react";
import { formatDate, validationMessage, type ReadingRepository, type HomeData } from "domain/core";
import { ReaderContext, useReader, AudioSelectionContext } from "../context";
import { DevotionalPage } from "./devotional";
import { Empty, ErrorMessage, Loading } from "../components";

export function ReadingPage() {
  const repository = useRepository();
  return repository.reading ? <ReadingSelection reading={repository.reading} /> : <DevotionalPage />;
}
function ReadingSelection({ reading }: { reading: ReadingRepository }) {
  const reader = useReader();
  const state = useWatch(useMemo(() => reading.watchReading(), [reading]));
  const [mode, setMode] = useState<"recent" | "favorites">("recent");
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const selectAudio = useContext(AudioSelectionContext);
  const favoriteAudio = mode === "favorites" ? state.data?.favorites.find(f => f.devotional.date === selected)?.devotional ?? state.data?.favorites[0]?.devotional : undefined;
  useEffect(() => { if (favoriteAudio) selectAudio(favoriteAudio); }, [favoriteAudio, selectAudio]);
  if (!state.data) return <div className="page">{state.error ? <ErrorMessage message={state.error} /> : <Loading />}</div>;
  const favorites = state.data.favorites;
  const showingFavorites = mode === "favorites";
  const dates = showingFavorites ? favorites.map(f => f.devotional.date) : state.data.dates;
  const date = dates.includes(selected) ? selected : dates[0];
  const snapshot = favorites.find(f => f.devotional.date === date);
  async function toggle() {
    if (!date) return;
    setBusy(true); setError("");
    try { await reading.setFavorite(date, !snapshot); }
    catch (e) { setError(validationMessage(e)); }
    finally { setBusy(false); }
  }
  return <>
    <section className="reading-tools" aria-label="Escolher leitura">
      <div className="reading-tabs"><button aria-pressed={!showingFavorites} onClick={() => { setMode("recent"); setSelected(""); }}>Leituras recentes</button><button aria-pressed={!!showingFavorites} onClick={() => { setMode("favorites"); setSelected(""); }}><Bookmark size={15} />Meus favoritos</button></div>
      {state.data.offline && <p role="status" className="notice">Sem conexão com o servidor. As leituras já guardadas neste dispositivo continuam disponíveis; alterações exigem conexão.</p>}
      {state.data.storageWarning && <p role="status">{state.data.storageWarning}</p>}
      {dates.length > 0 && <div className="reading-picker">
        <div className="field">
          <span id="reading-date-label">{showingFavorites ? "Sua cópia pessoal" : "Devocionais da ultima semana"}</span>
          <div className="reading-select-row">
            <select id="reading-date" aria-labelledby="reading-date-label" value={date} onChange={e => { setSelected(e.target.value); setError(""); }}>{dates.map(d => <option key={d} value={d}>{formatDate(d)}</option>)}</select>
            {showingFavorites
              ? <FavoriteButton saved busy={busy} disabled={busy || state.data.offline} onToggle={toggle} />
              : <RecentFavoriteButton date={date} saved={!!snapshot} busy={busy} onToggle={toggle} />}
          </div>
        </div>
      </div>}
      {error && <ErrorMessage message={error} />}
    </section>
    {!date ? <Empty title={showingFavorites ? "Guarde o que tocou seu coração." : "Nenhuma leitura disponível."}><p>Ao favoritar um devocional, uma cópia pessoal fica guardada aqui.</p></Empty> : showingFavorites && snapshot ?
      <ReaderContext.Provider value={{ date, data: { user: reader.data?.user ?? { id: "", name: "" }, devotional: snapshot.devotional, settings: null } }}>
        <p className="snapshot-note caption">Cópia pessoal salva em {new Date(snapshot.favoritedAt).toLocaleDateString("pt-BR")} · preservada mesmo se o original mudar.</p>
        <DevotionalPage />
      </ReaderContext.Provider> : <RecentReading date={date} />}
  </>;
}
function FavoriteButton({ saved, busy, disabled, onToggle }: { saved: boolean; busy: boolean; disabled?: boolean; onToggle: () => void }) {
  return <button type="button" className="button secondary small" aria-pressed={saved} aria-label={saved ? "Remover dos favoritos" : "Guardar nos favoritos"} disabled={disabled ?? busy} onClick={onToggle}>{saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button>;
}
function RecentFavoriteButton({ date, saved, busy, onToggle }: { date: string; saved: boolean; busy: boolean; onToggle: () => void }) {
  const state = useHome(date);
  if (!state.data?.devotional) return null;
  return <FavoriteButton saved={saved} busy={busy} onToggle={onToggle} />;
}
function RecentReading({ date }: { date: string }) {
  const state = useHome(date);
  const selectAudio = useContext(AudioSelectionContext);
  useEffect(() => { if (state.data) selectAudio(state.data.devotional); }, [state.data, selectAudio]);
  return <ReaderContext.Provider value={{ date, data: state.data as HomeData | undefined, error: state.error }}>
    <DevotionalPage />
  </ReaderContext.Provider>;
}

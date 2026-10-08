import { Button, IconButton } from "../ui/button";
import { useContext, useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, ChevronDown } from "lucide-react";
import { useHome, useRepository, useWatch } from "domain/react";
import {
  formatDate,
  validationMessage,
  type ReadingRepository,
  type HomeData,
  type Favorite,
} from "domain/core";
import { ReaderContext, useReader, AudioSelectionContext } from "../context";
import { DevotionalPage } from "./devotional";
import { Empty, ErrorMessage, Loading, Modal } from "../components";
import { Dropdown } from "../dropdown";

export function ReadingPage() {
  const repository = useRepository();
  return repository.reading ? (
    <ReadingSelection reading={repository.reading} />
  ) : (
    <DevotionalPage />
  );
}
function ReadingSelection({ reading }: { reading: ReadingRepository }) {
  const reader = useReader();
  const state = useWatch(useMemo(() => reading.watchReading(), [reading]));
  const [mode, setMode] = useState<"recent" | "favorites">("recent");
  const [selectedRecent, setSelectedRecent] = useState("");
  const [selectedFavorite, setSelectedFavorite] = useState("");
  const [recentOpen, setRecentOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [removedFavorite, setRemovedFavorite] = useState<{
    favorite: Favorite;
    token: string;
  } | null>(null);
  const selectAudio = useContext(AudioSelectionContext);
  const favoriteAudio =
    mode === "favorites"
      ? (state.data?.favorites.find(
          (f) => f.devotional.date === selectedFavorite,
        )?.devotional ?? state.data?.favorites[0]?.devotional)
      : undefined;
  useEffect(() => {
    if (favoriteAudio) selectAudio(favoriteAudio);
  }, [favoriteAudio, selectAudio]);
  if (!state.data)
    return (
      <div className="page">
        {state.error ? <ErrorMessage message={state.error} /> : <Loading />}
      </div>
    );
  const favorites = state.data.favorites;
  const showingFavorites = mode === "favorites";
  const dates = showingFavorites
    ? favorites.map((f) => f.devotional.date)
    : state.data.dates;
  const selected = showingFavorites ? selectedFavorite : selectedRecent;
  const date = dates.includes(selected) ? selected : dates[0];
  const recentDate = state.data.dates.includes(selectedRecent)
    ? selectedRecent
    : state.data.dates[0];
  const snapshot = favorites.find((f) => f.devotional.date === date);
  async function toggle() {
    if (!date && !removedFavorite) return;
    setBusy(true);
    setError("");
    try {
      if (!date && removedFavorite) {
        await reading.restoreFavorite(removedFavorite.token);
        setSelectedFavorite(removedFavorite.favorite.devotional.date);
        setRemovedFavorite(null);
      } else if (date) {
        const token = await reading.setFavorite(date, !snapshot);
        setRemovedFavorite(
          showingFavorites && snapshot && token
            ? { favorite: snapshot, token }
            : null,
        );
      }
    } catch (e) {
      setError(validationMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="reading-tools" aria-label="Escolher leitura">
        <div className="reading-tabs">
          <div className="reading-devotional-group">
            <Button
              type="button"
              variant="ghost"
              className="reading-tab"
              aria-pressed={!showingFavorites}
              onClick={() => {
                setMode("recent");
                setRemovedFavorite(null);
                setError("");
              }}
            >
              Devocional{recentDate && ` ${shortDate(recentDate)}`}
            </Button>
            <IconButton
              type="button"
              variant="secondary"
              className="reading-recent-toggle"
              title="Abrir devocionais recentes"
              aria-label="Abrir devocionais recentes"
              aria-haspopup="dialog"
              aria-expanded={recentOpen}
              onClick={() => setRecentOpen(true)}
            >
              <ChevronDown size={18} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="reading-favorites-group">
            <Button
              type="button"
              variant="ghost"
              className="reading-tab"
              aria-pressed={showingFavorites}
              onClick={() => {
                setMode("favorites");
                setError("");
              }}
            >
              Favoritos
            </Button>
            {showingFavorites ? (
              <FavoriteButton
                saved={!!snapshot}
                undo={!date && !!removedFavorite}
                busy={busy}
                disabled={
                  busy || state.data.offline || (!date && !removedFavorite)
                }
                onToggle={toggle}
              />
            ) : date ? (
              <RecentFavoriteButton
                date={date}
                saved={!!snapshot}
                busy={busy}
                disabled={busy || state.data.offline}
                onToggle={toggle}
              />
            ) : (
              <FavoriteButton
                saved={false}
                busy={busy}
                disabled
                onToggle={toggle}
              />
            )}
          </div>
        </div>
        {state.data.offline && (
          <p role="status" className="notice">
            Sem conexão com o servidor. As leituras já guardadas neste
            dispositivo continuam disponíveis; alterações exigem conexão.
          </p>
        )}
        {state.data.storageWarning && (
          <p role="status">{state.data.storageWarning}</p>
        )}
        {showingFavorites && dates.length > 0 && (
          <div className="reading-picker">
            <div className="field">
              <span id="reading-date-label">Sua cópia pessoal</span>
              <div className="reading-select-row">
                <Dropdown
                  id="reading-date"
                  labelledBy="reading-date-label"
                  value={date}
                  onChange={(value) => {
                    setSelectedFavorite(value);
                    setError("");
                  }}
                  options={dates.map((day) => ({
                    value: day,
                    label: formatDate(day),
                  }))}
                />
              </div>
            </div>
          </div>
        )}
        {error && <ErrorMessage message={error} />}
      </section>
      {recentOpen && (
        <Modal
          title="Devocionais recentes"
          onClose={() => setRecentOpen(false)}
        >
          {state.data.dates.length ? (
            <ul className="recent-devotional-list">
              {state.data.dates.map((day) => (
                <li key={day}>
                  <RecentDevotional
                    date={day}
                    selected={!showingFavorites && day === recentDate}
                    onSelect={() => {
                      setSelectedRecent(day);
                      setMode("recent");
                      setRemovedFavorite(null);
                      setRecentOpen(false);
                      setError("");
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma leitura disponível.</p>
          )}
        </Modal>
      )}
      {!date ? (
        <Empty
          title={
            showingFavorites
              ? "Guarde o que tocou seu coração."
              : "Nenhuma leitura disponível."
          }
        >
          <p>
            Ao favoritar um devocional, uma cópia pessoal fica guardada aqui.
          </p>
        </Empty>
      ) : showingFavorites && snapshot ? (
        <ReaderContext.Provider
          value={{
            date,
            data: {
              user: reader.data?.user ?? { id: "", name: "" },
              devotional: snapshot.devotional,
              settings: null,
            },
          }}
        >
          <p className="snapshot-note caption">
            Cópia pessoal salva em{" "}
            {new Date(snapshot.favoritedAt).toLocaleDateString("pt-BR")} ·
            preservada mesmo se o original mudar.
          </p>
          <DevotionalPage />
        </ReaderContext.Provider>
      ) : (
        <RecentReading date={date} />
      )}
    </>
  );
}
function FavoriteButton({
  saved,
  undo,
  busy,
  disabled,
  onToggle,
}: {
  saved: boolean;
  undo?: boolean;
  busy: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const label = undo
    ? "Restaurar último favorito"
    : saved
      ? "Remover dos favoritos"
      : "Guardar nos favoritos";
  return (
    <IconButton
      type="button"
      variant="secondary"
      title={label}
      aria-pressed={saved}
      aria-label={label}
      disabled={disabled ?? busy}
      onClick={onToggle}
    >
      {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
    </IconButton>
  );
}
function RecentFavoriteButton({
  date,
  saved,
  busy,
  disabled,
  onToggle,
}: {
  date: string;
  saved: boolean;
  busy: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const state = useHome(date);
  return (
    <FavoriteButton
      saved={saved}
      busy={busy}
      disabled={disabled || !state.data?.devotional}
      onToggle={onToggle}
    />
  );
}
function shortDate(date: string) {
  return date.split("-").reverse().join("/");
}
function RecentDevotional({
  date,
  selected,
  onSelect,
}: {
  date: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const state = useHome(date);
  const devotional = state.data?.devotional;
  return (
    <button
      type="button"
      aria-label={`Ler devocional de ${shortDate(date)}`}
      aria-pressed={selected}
      disabled={!devotional}
      onClick={onSelect}
    >
      <span className="recent-devotional-heading">
        <time dateTime={date}>{shortDate(date)}</time>
        {devotional && <span>{devotional.reference}</span>}
      </span>
      <span className="recent-devotional-preview">
        {devotional?.scripture ??
          (state.error ||
            (state.data ? "Nenhum devocional nesta data." : "Carregando…"))}
      </span>
    </button>
  );
}
function RecentReading({ date }: { date: string }) {
  const state = useHome(date);
  const selectAudio = useContext(AudioSelectionContext);
  useEffect(() => {
    if (state.data) selectAudio(state.data.devotional);
  }, [state.data, selectAudio]);
  return (
    <ReaderContext.Provider
      value={{
        date,
        data: state.data as HomeData | undefined,
        error: state.error,
      }}
    >
      <DevotionalPage />
    </ReaderContext.Provider>
  );
}

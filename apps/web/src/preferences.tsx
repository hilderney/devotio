import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  defaultReadingPreferences,
  readingPreferencesSchema,
  readingFontSizes,
  resolveReadingTheme,
  nextThemeTransition,
  type ReadingPreferences,
} from "domain/core";
import { Modal } from "./components";
import { readingThemes } from "ui-kit";
import { Dropdown } from "./dropdown";

const PreferencesContext = createContext({
  preferences: defaultReadingPreferences,
  change: (_patch: Partial<ReadingPreferences>) => {},
});
export function usePreferences() {
  return useContext(PreferencesContext);
}
function load(owner: string): ReadingPreferences {
  try {
    return readingPreferencesSchema.parse(
      JSON.parse(
        localStorage.getItem(`devotio:preferences:v1:${owner}`) ?? "null",
      ),
    );
  } catch {
    return { ...defaultReadingPreferences };
  }
}
export function PreferencesProvider({
  owner,
  children,
}: {
  owner: string;
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState(() => load(owner));
  const latest = useRef(preferences);
  latest.current = preferences;
  const [now, setNow] = useState(() => new Date());
  const theme = resolveReadingTheme(preferences.theme, now);
  useLayoutEffect(() => {
    const anchor = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reading-verse]"),
    ).find((element) => element.getBoundingClientRect().bottom > 130);
    const top = anchor?.getBoundingClientRect().top;
    document.documentElement.dataset.theme = theme;
    Object.entries(readingThemes[theme]).forEach(([key, value]) =>
      document.documentElement.style.setProperty(`--${key}`, value),
    );
    document.documentElement.style.fontSize = `${(preferences.fontSize / 20) * 100}%`;
    if (anchor && top !== undefined)
      window.scrollBy(0, anchor.getBoundingClientRect().top - top);
  }, [theme, preferences.fontSize]);
  useEffect(() => {
    if (preferences.theme !== "clock") return;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const date = new Date();
      setNow(date);
      clearTimeout(timer);
      timer = setTimeout(update, nextThemeTransition(date));
    };
    const visible = () => {
      if (document.visibilityState === "visible") update();
    };
    update();
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [preferences.theme]);
  useEffect(() => {
    const persist = () => {
      try {
        localStorage.setItem(
          `devotio:preferences:v1:${owner}`,
          JSON.stringify(preferences),
        );
      } catch {
        /* Keep changes in memory when storage is unavailable. */
      }
    };
    const timer = setTimeout(persist, 150);
    return () => clearTimeout(timer);
  }, [owner, preferences]);
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(
          `devotio:preferences:v1:${owner}`,
          JSON.stringify(latest.current),
        );
      } catch {
        /* Preserve in memory. */
      }
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("devotio:flush-preferences", flush);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("devotio:flush-preferences", flush);
    };
  }, [owner]);
  const change = (patch: Partial<ReadingPreferences>) => {
    document.dispatchEvent(
      new CustomEvent("devotio:before-preferences", { detail: patch }),
    );
    setPreferences((current) =>
      readingPreferencesSchema.parse({ ...current, ...patch }),
    );
  };
  return (
    <PreferencesContext.Provider value={{ preferences, change }}>
      {children}
    </PreferencesContext.Provider>
  );
}
export function SettingsModal({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const { preferences, change } = usePreferences();
  return (
    <Modal
      title="Configurações"
      returnFocusRef={returnFocusRef}
      onClose={() => {
        document.dispatchEvent(new Event("devotio:flush-preferences"));
        onClose();
      }}
    >
      <div className="settings-controls">
        <div className="field">
          <span>Tema</span>
          <Dropdown
            label="Tema"
            value={preferences.theme}
            options={[
              { value: "day", label: "Dia" },
              { value: "night", label: "Noite" },
              { value: "papyrus", label: "Papiro" },
              { value: "contrast", label: "Contraste" },
              { value: "clock", label: "Pelo horário" },
            ]}
            onChange={(value) =>
              change({
                theme: readingPreferencesSchema.shape.theme.parse(value),
              })
            }
          />
        </div>
        <p className="caption">
          Pelo horário: Dia das 6h às 18h; Noite nos demais horários do
          aparelho.
        </p>
        <label className="field">
          <span>Tamanho da fonte · {preferences.fontSize} px</span>
          <input
            aria-label="Tamanho da fonte"
            aria-valuetext={`${preferences.fontSize} pixels`}
            type="range"
            min={0}
            max={7}
            step={1}
            value={readingFontSizes.indexOf(preferences.fontSize)}
            onChange={(event) =>
              change({ fontSize: readingFontSizes[Number(event.target.value)] })
            }
          />
        </label>
        <p className="settings-sample">Aquietai-vos e sabei que eu sou Deus.</p>
        <div className="field">
          <span>Modo de leitura bíblica</span>
          <Dropdown
            label="Modo de leitura bíblica"
            value={preferences.mode}
            options={[
              { value: "paged", label: "Paginado" },
              { value: "continuous", label: "Contínuo" },
            ]}
            onChange={(value) =>
              change({ mode: readingPreferencesSchema.shape.mode.parse(value) })
            }
          />
        </div>
        <p className="caption">
          Suas escolhas são aplicadas na hora e guardadas neste aparelho.
        </p>
      </div>
    </Modal>
  );
}

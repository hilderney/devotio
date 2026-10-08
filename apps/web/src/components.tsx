import { IconButton, Button } from "./ui/button";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
  type RefObject,
} from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  Headphones,
  Pause,
  Play,
  X,
} from "lucide-react";
import { copy, validationMessage, type Devotional } from "domain/core";
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <BookOpen size={22} strokeWidth={1.3} />
        <span />
      </span>
      <span>
        devotio<span className="brand-dot">.</span>
      </span>
    </span>
  );
}
export function Ornament() {
  return (
    <svg
      className="ornament"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="32" />
      <circle cx="50" cy="50" r="23" />
      <path d="M50 4v16M50 80v16M4 50h16M80 50h16M17.5 17.5 29 29M71 71l11.5 11.5M17.5 82.5 29 71M71 29l11.5-11.5" />
      <path d="M41 53c0-8 9-15 9-15s9 7 9 15c0 5-4 9-9 9s-9-4-9-9ZM50 47v22" />
    </svg>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="empty">
      <span className="empty-icon">
        <BookOpen size={26} strokeWidth={1.2} />
      </span>
      <h2>{title}</h2>
      <div className="muted">{children}</div>
      {action}
    </section>
  );
}
export function Loading() {
  return (
    <div className="loading" role="status" aria-label="Carregando conteúdo">
      <div className="skeleton short" />
      <div className="skeleton title" />
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton medium" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="error" role="alert">
      <AlertCircle size={17} />
      <span>{message}</span>
    </p>
  );
}
export function Modal({
  title,
  children,
  onClose,
  initialFocusRef,
  returnFocusRef,
  id,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  id?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    initialFocusRef?.current?.focus({ preventScroll: true });
    return () => {
      dialog?.close();
      (returnFocusRef?.current ?? previous)?.focus({ preventScroll: true });
    };
  }, [initialFocusRef, returnFocusRef]);
  return (
    <dialog
      id={id}
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        const outside =
          e.clientX <= bounds.left ||
          e.clientX >= bounds.right ||
          e.clientY <= bounds.top ||
          e.clientY >= bounds.bottom;
        if (outside) onClose();
      }}
    >
      <div className="modal-head">
        <h2 id={titleId}>{title}</h2>
        <IconButton variant="ghost" aria-label="Fechar" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </div>
      {children}
    </dialog>
  );
}
export function ActionForm({
  children,
  onSubmit,
  label = "Salvar",
  onDone,
}: {
  children?: ReactNode;
  onSubmit: (data: FormData) => Promise<void>;
  label?: string;
  onDone?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await onSubmit(new FormData(event.currentTarget));
      onDone?.();
    } catch (e) {
      setError(validationMessage(e));
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="form" aria-busy={pending}>
      {children}
      {error && <ErrorMessage message={error} />}
      <Button type="submit" disabled={pending}>
        {pending ? "Um instante…" : label}
        <ArrowRight size={16} />
      </Button>
    </form>
  );
}
export function Field({
  name,
  label,
  placeholder,
  textarea = false,
  defaultValue = "",
  maxLength,
  required = true,
}: {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  defaultValue?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
          rows={4}
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
        />
      )}
    </label>
  );
}
export function Success({ children }: { children: ReactNode }) {
  return (
    <p className="success" role="status">
      <Check size={16} />
      {children}
    </p>
  );
}
export function AudioPlayer({ devotional }: { devotional: Devotional }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  if (!devotional.audioUrl) return null;
  return (
    <div className="audio-player">
      <div className="audio-label">
        <Headphones size={17} />
        <span>Ouvir a Palavra</span>
      </div>
      <IconButton
        className="audio-toggle"
        aria-label={playing ? "Pausar devocional" : "Ouvir devocional"}
        onClick={async () => {
          if (playing) audio.current?.pause();
          else
            try {
              await audio.current?.play();
            } catch {
              setError(true);
            }
        }}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </IconButton>
      <audio
        ref={audio}
        src={devotional.audioUrl}
        preload="none"
        controls
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      {error && <ErrorMessage message={copy.audioError} />}
    </div>
  );
}

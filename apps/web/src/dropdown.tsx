import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { Modal } from "./components";

export interface DropdownOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}
interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  label?: string;
  labelledBy?: string;
  id?: string;
  disabled?: boolean;
}
/** Presentation only; callers retain validation, permissions and persistence. */
export function Dropdown({
  value,
  options,
  onChange,
  label,
  labelledBy,
  id,
  disabled = false,
}: DropdownProps) {
  const generated = useId(),
    listId = `${generated}-list`,
    dialogId = `${generated}-dialog`;
  const trigger = useRef<HTMLButtonElement>(null);
  const initialFocus = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0);
  const [title, setTitle] = useState(label ?? "Escolher opção");
  const prefix = useRef({ text: "", at: 0 });
  const selected = options.findIndex((option) => option.value === value);
  const enabled = options
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);
  function show(index?: number) {
    if (disabled || !enabled.length) return;
    trigger.current?.focus({ preventScroll: true });
    setTitle(
      label ??
        (labelledBy
          ?.split(/\s+/)
          .map((key) => document.getElementById(key)?.textContent)
          .filter(Boolean)
          .join(" ") ||
          "Escolher opção"),
    );
    prefix.current = { text: "", at: 0 };
    setActive(
      index ??
        (selected >= 0 && !options[selected].disabled ? selected : enabled[0]),
    );
    setOpen(true);
  }
  function close() {
    setOpen(false);
  }
  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    close();
    if (option.value !== value) onChange(option.value);
  }
  useEffect(() => {
    if (disabled || !enabled.length) setOpen(false);
  }, [disabled, enabled.length]);
  useEffect(() => {
    if (!open) return;
    const option = optionRefs.current[active];
    option?.focus({ preventScroll: true });
    option?.scrollIntoView?.({ block: "nearest" });
  }, [active, open]);
  function keyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      if (!enabled.length) return;
      if (!open) {
        show(
          event.key === "Home"
            ? enabled[0]
            : event.key === "End"
              ? enabled.at(-1)
              : undefined,
        );
        return;
      }
      const offset = enabled.indexOf(active);
      setActive(
        event.key === "Home"
          ? enabled[0]
          : event.key === "End"
            ? enabled.at(-1)!
            : enabled[
                (offset +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  enabled.length) %
                  enabled.length
              ],
      );
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      if (open) choose(active);
      else show();
      return;
    }
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now(),
        character = event.key.toLocaleLowerCase("pt-BR");
      const text =
        now - prefix.current.at > 700
          ? character
          : prefix.current.text + character;
      const normalize = (word: string) =>
        word
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("pt-BR");
      const index = enabled.find((index) =>
        normalize(options[index].label).startsWith(normalize(text)),
      );
      if (!open) show(index);
      else if (index !== undefined) setActive(index);
      prefix.current = { text, at: now };
    }
  }
  return (
    <div className="dropdown">
      <button
        ref={trigger}
        id={id ?? generated}
        type="button"
        role="combobox"
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        disabled={disabled}
        className="dropdown-trigger"
        onKeyDown={keyDown}
        onClick={() => show()}
      >
        <span>{options[selected]?.label ?? "Escolher…"}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <Modal
            id={dialogId}
            title={title}
            initialFocusRef={initialFocus}
            onClose={close}
          >
            <div
              id={listId}
              role="listbox"
              aria-label={title}
              className="dropdown-options"
              onKeyDown={keyDown}
            >
              {options.map((option, index) => (
                <div key={option.value}>
                  {option.group &&
                    option.group !== options[index - 1]?.group && (
                      <div className="dropdown-group" role="presentation">
                        {option.group}
                      </div>
                    )}
                  <button
                    ref={(element) => {
                      optionRefs.current[index] = element;
                      if (index === active) initialFocus.current = element;
                    }}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    disabled={option.disabled}
                    tabIndex={index === active ? 0 : -1}
                    className="dropdown-option"
                    onFocus={() => setActive(index)}
                    onClick={() => choose(index)}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
}

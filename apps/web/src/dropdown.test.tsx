import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "./dropdown";
import { Modal } from "./components";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const options = [{ value: "gn", label: "Gênesis", group: "Antigo Testamento" }, { value: "ex", label: "Êxodo", group: "Antigo Testamento", disabled: true }, { value: "jo", label: "João", group: "Novo Testamento" }];
function Fixture() {
  const [value, setValue] = useState("gn");
  return <><Dropdown label="Livro" value={value} options={options} onChange={setValue} /><button>Outro campo</button></>;
}
describe("seleção compartilhada em modal", () => {
  it("preserva grupos, confirma por clique e mantém foco no campo", () => {
    render(<Fixture />);
    const trigger = screen.getByRole("combobox", { name: "Livro" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Livro" })).toBeDefined();
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(screen.getByText("Antigo Testamento")).toBeDefined();
    expect(screen.getByText("Novo Testamento")).toBeDefined();
    expect(screen.getByRole("option", { name: "Gênesis" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.click(screen.getByRole("option", { name: "João" }));
    expect(trigger.textContent).toBe("João");
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("setas ignoram opção desabilitada; Escape não confirma e não fecha o modal pai", () => {
    const parent = vi.fn();
    render(<div onKeyDown={parent}><Fixture /></div>);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "João" }));
    parent.mockClear(); fireEvent.keyDown(trigger, { key: "Escape" });
    expect(parent).not.toHaveBeenCalled();
    expect(trigger.textContent).toBe("Gênesis");
    fireEvent.keyDown(trigger, { key: "Enter" }); fireEvent.keyDown(trigger, { key: "End" }); fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger.textContent).toBe("João");
  });
  it("digitação encontra rótulos, Tab mantém modal, backdrop cancela e disabled não abre", () => {
    const { rerender } = render(<Fixture />);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "j" }); fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger.textContent).toBe("João");
    fireEvent.click(trigger); fireEvent.keyDown(trigger, { key: "Tab" });
    expect(screen.getByRole("dialog", { name: "Livro" })).toBeDefined();
    fireEvent.click(screen.getByRole("dialog", { name: "Livro" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger.textContent).toBe("João");
    expect(document.activeElement).toBe(trigger);
    rerender(<Dropdown label="Livro" value="gn" options={options} onChange={vi.fn()} disabled />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("modal filho tem título próprio e fecha por X/Escape sem encerrar configurações", () => {
    const closeParent = vi.fn();
    render(<Modal title="Configurações" onClose={closeParent}><Fixture /></Modal>);
    const trigger = screen.getByRole("combobox", { name: "Livro" });
    fireEvent.click(trigger);
    const child = screen.getByRole("dialog", { name: "Livro" });
    const parent = screen.getByRole("dialog", { name: "Configurações" });
    expect(child.getAttribute("aria-labelledby")).not.toBe(parent.getAttribute("aria-labelledby"));
    fireEvent.click(within(child).getByRole("button", { name: "Fechar" }));
    expect(closeParent).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Configurações" })).toBe(parent);
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger); fireEvent(screen.getByRole("dialog", { name: "Livro" }), new Event("cancel", { cancelable: true }));
    expect(closeParent).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "Livro" })).toBeNull();
  });
  it("usa o rótulo associado no título e não confirma opção desabilitada ou escolha atual", () => {
    const change = vi.fn();
    render(<><span id="favorite-label">Sua cópia pessoal</span><Dropdown labelledBy="favorite-label" value="gn" options={options} onChange={change} /></>);
    fireEvent.click(screen.getByRole("combobox", { name: "Sua cópia pessoal" }));
    expect(screen.getByRole("dialog", { name: "Sua cópia pessoal" })).toBeDefined();
    fireEvent.click(screen.getByRole("option", { name: "Êxodo" }));
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("option", { name: "Gênesis" }));
    expect(change).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

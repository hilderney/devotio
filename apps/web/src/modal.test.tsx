import { StrictMode, useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Modal } from "./components";
import { Button } from "./ui/button";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("preserva preenchimento ao clicar no espaço interno e fecha apenas no backdrop", () => {
  const close = vi.fn();
  render(<StrictMode><Modal title="Editar" onClose={close}><label>Texto<input /></label></Modal></StrictMode>);
  const dialog = screen.getByRole("dialog");
  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({ left: 20, right: 300, top: 20, bottom: 300, width: 280, height: 280, x: 20, y: 20, toJSON() {} });
  fireEvent.change(screen.getByLabelText("Texto"), { target: { value: "Rascunho preservado" } });
  fireEvent.click(dialog, { clientX: 30, clientY: 30 });
  expect(close).not.toHaveBeenCalled();
  expect((screen.getByLabelText("Texto") as HTMLInputElement).value).toBe("Rascunho preservado");
  fireEvent.click(dialog, { clientX: 10, clientY: 10 });
  expect(close).toHaveBeenCalledOnce();
});

it("ações auxiliares e fechar modal não enviam o formulário; submit continua explícito", () => {
  const submit = vi.fn();
  function Form() {
    const [open, setOpen] = useState(false);
    return <form onSubmit={event => { event.preventDefault(); submit(); }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>Escolher</Button>
      {open && <Modal title="Opções" onClose={() => setOpen(false)}>Escolha um item.</Modal>}
      <Button type="submit">Salvar</Button>
    </form>;
  }
  render(<Form />);
  fireEvent.click(screen.getByRole("button", { name: "Escolher" }));
  fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
  expect(submit).toHaveBeenCalledOnce();
});

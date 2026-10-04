// @vitest-environment jsdom
import { createElement, type ReactNode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPreviewRepository } from "../preview";
import { RepositoryProvider, useHome, useLocalDate } from "./index";
import type { HomeData } from "../types";
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe("fronteira de sessão e leitura", () => {
  it("descarta dados anteriores e emissões atrasadas ao trocar de conta", () => {
    const callbacks: ((data: HomeData) => void)[] = [];
    const stop = vi.fn();
    const first = {
      ...createPreviewRepository(),
      watchHome: () => (next: (data: HomeData) => void) => {
        callbacks.push(next);
        return stop;
      },
    };
    const second = { ...first };
    let repository = first;
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(RepositoryProvider, { repository, children });
    const { result, rerender } = renderHook(() => useHome("2026-10-03"), {
      wrapper,
    });
    act(() =>
      callbacks[0]({
        user: { id: "one", name: "Primeira conta" },
        devotional: null,
        settings: null,
      }),
    );
    expect(result.current.data?.user.id).toBe("one");
    repository = second;
    rerender();
    expect(stop).toHaveBeenCalledOnce();
    expect(result.current.data).toBeUndefined();
    act(() =>
      callbacks[0]({
        user: { id: "one", name: "Primeira conta" },
        devotional: null,
        settings: null,
      }),
    );
    expect(result.current.data).toBeUndefined();
    act(() =>
      callbacks[1]({
        user: { id: "two", name: "Segunda conta" },
        devotional: null,
        settings: null,
      }),
    );
    expect(result.current.data?.user.id).toBe("two");
  });
  it("retira dados privados quando a assinatura passa a falhar", () => {
    let fail: ((error: Error) => void) | undefined;
    const repository = {
      ...createPreviewRepository(),
      watchHome:
        () =>
        (next: (data: HomeData) => void, error: (error: Error) => void) => {
          next({
            user: { id: "one", name: "Leitor" },
            devotional: null,
            settings: null,
          });
          fail = error;
          return () => {};
        },
    };
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(RepositoryProvider, { repository, children });
    const { result } = renderHook(() => useHome("2026-10-03"), { wrapper });
    expect(result.current.data).toBeDefined();
    act(() => fail?.(new Error("Sessão expirada")));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
  });
  it("atualiza a leitura na virada local e ao retornar ao primeiro plano", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 3, 23, 59, 50));
    const { result } = renderHook(useLocalDate);
    expect(result.current.date).toBe("2026-10-03");
    act(() => vi.advanceTimersByTime(30_000));
    expect(result.current.date).toBe("2026-10-04");
    vi.setSystemTime(new Date(2026, 9, 5, 9));
    act(() => result.current.refresh());
    expect(result.current.date).toBe("2026-10-05");
  });
});

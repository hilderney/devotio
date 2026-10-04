import { useRegisterSW } from "virtual:pwa-register/react";
export function PwaNotice() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <aside className="update-notice" aria-label="Atualização disponível">
      <p>Uma nova versão está pronta.</p>
      <div>
        <button
          className="button small"
          onClick={() => void updateServiceWorker(true)}
        >
          Atualizar agora
        </button>
        <button className="text-button" onClick={() => setNeedRefresh(false)}>
          Depois
        </button>
      </div>
    </aside>
  );
}

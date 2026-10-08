import { Button } from "./ui/button";
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
        <Button size="compact" onClick={() => void updateServiceWorker(true)}>
          Atualizar agora
        </Button>
        <Button variant="ghost" onClick={() => setNeedRefresh(false)}>
          Depois
        </Button>
      </div>
    </aside>
  );
}

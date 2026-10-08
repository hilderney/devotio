import { IconButton, Button } from "./ui/button";
import { useMemo, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWatch } from "domain/react";
import {
  notificationDate,
  validationMessage,
  type NotificationsRepository,
} from "domain/core";
import { Modal, Loading, ErrorMessage } from "./components";

export function NotificationsBell({
  notifications,
}: {
  notifications: NotificationsRepository;
}) {
  const summary = useWatch(
    useMemo(() => notifications.watchSummary(), [notifications]),
  );
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        variant="ghost"
        className="notifications-bell"
        aria-label={`Notificações${summary.data?.unread ? `, ${summary.data.unread} não lidas` : ""}`}
        onClick={() => setOpen(true)}
      >
        <Bell size={20} />
        {summary.data && summary.data.unread > 0 && (
          <span className="notification-badge" aria-hidden="true">
            {summary.data.unread}
          </span>
        )}
      </IconButton>
      {open && (
        <Modal title="Notificações" onClose={() => setOpen(false)}>
          <NotificationList
            notifications={notifications}
            onNavigate={() => setOpen(false)}
          />
        </Modal>
      )}
    </>
  );
}
function NotificationList({
  notifications,
  onNavigate,
}: {
  notifications: NotificationsRepository;
  onNavigate: () => void;
}) {
  const [cursor, setCursor] = useState<string | null>(null);
  const state = useWatch(
    useMemo(() => notifications.watchPage(cursor), [notifications, cursor]),
  );
  const [busy, setBusy] = useState<string | null>(null),
    [error, setError] = useState("");
  return (
    <section className="notifications-list">
      {state.error ? (
        <ErrorMessage message={state.error} />
      ) : !state.data ? (
        <Loading />
      ) : state.data.items.length === 0 ? (
        <p>Você está em dia. Nenhuma notificação por aqui.</p>
      ) : (
        <ul>
          {state.data.items.map((item) => (
            <li
              key={item.id}
              className={item.readAt === null ? "notification-unread" : ""}
            >
              <div className="notification-line">
                <span>
                  {item.type === "community" ? (
                    <>
                      Nova mensagem para comunidade{" "}
                      <strong>{item.entity}</strong>.
                    </>
                  ) : (
                    <>
                      <strong>{item.entity}</strong> {item.text}
                    </>
                  )}
                </span>
                <time dateTime={new Date(item.createdAt).toISOString()}>
                  {notificationDate(item.createdAt)}
                </time>
              </div>
              <div className="notification-actions">
                {item.communityId && item.messageId ? (
                  <Link
                    to="/comunidade/$communityId"
                    params={{ communityId: item.communityId }}
                    search={{ message: item.messageId }}
                    onClick={onNavigate}
                  >
                    Abrir mensagem
                  </Link>
                ) : item.type === "system" ? (
                  <Link to="/comunidade" onClick={onNavigate}>
                    Ver comunidades
                  </Link>
                ) : null}
                <Button
                  variant="ghost"
                  disabled={item.readAt !== null || busy === item.id}
                  aria-label={`Marcar notificação de ${item.entity} como lida`}
                  onClick={async () => {
                    setBusy(item.id);
                    setError("");
                    try {
                      await notifications.markRead(item.id);
                    } catch (cause) {
                      setError(validationMessage(cause));
                    } finally {
                      setBusy(null);
                    }
                  }}
                >
                  <Check size={15} />
                  {item.readAt === null ? "Lida" : "Já lida"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <ErrorMessage message={error} />}
      <div className="notification-actions">
        {cursor && (
          <Button variant="ghost" onClick={() => setCursor(null)}>
            Voltar às recentes
          </Button>
        )}
        {state.data?.nextCursor && (
          <Button
            variant="ghost"
            onClick={() => setCursor(state.data!.nextCursor)}
          >
            Ver anteriores
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={async () => {
            try {
              await notifications.refresh();
            } catch (cause) {
              setError(validationMessage(cause));
            }
          }}
        >
          Atualizar avisos
        </Button>
      </div>
    </section>
  );
}

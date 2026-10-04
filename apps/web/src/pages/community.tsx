import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Users,
  Plus,
  KeyRound,
  MessageSquare,
  CheckCheck,
  Leaf,
  Copy,
  Trash2,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { useCommunities, useCommunity, useRepository } from "domain/react";
import {
  communitySchema,
  inviteSchema,
  messageSchema,
  checklistSchema,
  scriptureSchema,
  canManage,
  canRemoveMember,
  formatMessageDate,
  initials,
  validationMessage,
  copy,
  type ChecklistItem,
} from "domain/core";
import {
  Empty,
  Loading,
  ErrorMessage,
  Modal,
  ActionForm,
  Field,
  Success,
} from "../components";
type DialogKind = "create" | "join" | null;
export function CommunitiesPage() {
  const { data, error } = useCommunities();
  const [dialog, setDialog] = useState<DialogKind>(null);
  return (
    <div className="page community-index">
      <div className="page-heading">
        <p className="eyebrow">
          <Users size={15} />
          JUNTOS NO CAMINHO
        </p>
        <h1>
          A fé também se vive
          <br />
          <em>em comunhão.</em>
        </h1>
        <p className="intro-copy">
          Presença, partilha e cuidado. Um lugar para caminhar juntos.
        </p>
      </div>
      <div className="section-top">
        <h2>Suas comunidades</h2>
        <button
          className="button secondary small"
          onClick={() => setDialog("join")}
        >
          <KeyRound size={15} />
          Entrar com código
        </button>
      </div>
      {error ? (
        <ErrorMessage message={error} />
      ) : !data ? (
        <Loading />
      ) : data.length === 0 ? (
        <Empty title="Sua caminhada pode ser compartilhada.">
          <p>
            Você ainda não participa de uma comunidade.
            <br />
            Peça um código à sua liderança para começar.
          </p>
        </Empty>
      ) : (
        <div className="community-grid">
          {data.map((group) => (
            <Link
              key={group.id}
              className="community-card"
              to="/comunidade/$communityId"
              params={{ communityId: group.id }}
            >
              <div className="community-card-top">
                <span className="community-symbol">
                  <Users size={25} strokeWidth={1.2} />
                </span>
                <ArrowUpRight size={20} />
              </div>
              <span className="eyebrow">
                {group.role === "admin"
                  ? "VOCÊ CUIDA DESTE ESPAÇO"
                  : "SEU ESPAÇO DE COMUNHÃO"}
              </span>
              <h2>{group.name}</h2>
              <p>
                {group.description || "Um espaço de Palavra, cuidado e oração."}
              </p>
              <span className="card-link">
                Abrir comunidade <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      )}
      <div className="create-community">
        <div>
          <h3>Um novo espaço de cuidado.</h3>
          <p>Reúna sua igreja ou seu grupo em uma comunidade.</p>
        </div>
        <button className="text-button" onClick={() => setDialog("create")}>
          <Plus size={17} />
          Criar comunidade
        </button>
      </div>
      <aside className="community-note">
        <Leaf size={21} strokeWidth={1.2} />
        <p>
          Comunidade é presença.
          <br />
          <span>Sem comparações. Sem pressa. Cada pessoa, no seu caminho.</span>
        </p>
      </aside>
      {dialog && (
        <CommunityDialog kind={dialog} onClose={() => setDialog(null)} />
      )}
    </div>
  );
}
function CommunityDialog({
  kind,
  onClose,
}: {
  kind: "create" | "join";
  onClose: () => void;
}) {
  const repo = useRepository();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<{
    code: string;
    name: string;
  } | null>(null);
  return (
    <Modal
      title={kind === "create" ? "Um novo começo." : "Encontre sua comunidade."}
      onClose={onClose}
    >
      <p className="dialog-description">
        {kind === "create"
          ? "Dê um nome a este espaço de comunhão. Você será responsável por cuidar dele."
          : "Insira o código de oito caracteres compartilhado pela liderança."}
      </p>
      {kind === "create" ? (
        <ActionForm
          label="Criar comunidade"
          onSubmit={async (data) => {
            const input = communitySchema.parse({
              name: data.get("name"),
              description: data.get("description"),
            });
            const id = await repo.createCommunity(input);
            onClose();
            await navigate({
              to: "/comunidade/$communityId",
              params: { communityId: id },
            });
          }}
        >
          <Field
            name="name"
            label="Nome da comunidade"
            placeholder="Ex.: Comunidade Esperança"
            maxLength={80}
          />
          <Field
            name="description"
            label="Uma breve descrição (opcional)"
            placeholder="O que reúne vocês?"
            textarea
            maxLength={280}
            required={false}
          />
        </ActionForm>
      ) : invitation ? (
        <ActionForm
          label="Confirmar entrada"
          onSubmit={async () => {
            const id = await repo.joinCommunity(invitation.code);
            onClose();
            await navigate({
              to: "/comunidade/$communityId",
              params: { communityId: id },
            });
          }}
        >
          <div className="invitation-preview">
            <Users size={24} />
            <span className="caption">VOCÊ ESTÁ ENTRANDO EM</span>
            <h3>{invitation.name}</h3>
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => setInvitation(null)}
          >
            Usar outro código
          </button>
        </ActionForm>
      ) : (
        <ActionForm
          label="Encontrar comunidade"
          onSubmit={async (data) => {
            const code = inviteSchema.parse(data.get("code"));
            const found = await repo.previewInvite(code);
            if (!found)
              throw new Error(
                "Não encontramos uma comunidade com esse código.",
              );
            setInvitation({ code, name: found.name });
          }}
        >
          <Field
            name="code"
            label="Código de convite"
            placeholder="8 letras ou números"
            maxLength={8}
          />
        </ActionForm>
      )}
    </Modal>
  );
}
function Tick({ item }: { item: ChecklistItem }) {
  const repo = useRepository();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <li>
      <label className={"checklist-item" + (item.checked ? " checked" : "")}>
        <input
          type="checkbox"
          checked={item.checked}
          disabled={pending}
          onChange={async (event) => {
            const checked = event.target.checked;
            setPending(true);
            setError("");
            try {
              await repo.setTick(item.id, checked);
            } catch (e) {
              setError(validationMessage(e));
            } finally {
              setPending(false);
            }
          }}
        />
        <span className="check-visual">
          <CheckCheck size={15} />
        </span>
        <span className="check-text">
          {item.text}
          <small>
            {pending
              ? "Salvando…"
              : item.count === 1
                ? "1 pessoa marcou"
                : item.count + " pessoas marcaram"}
          </small>
        </span>
      </label>
      {error && <ErrorMessage message={error} />}
    </li>
  );
}
export function CommunityPage({
  id,
  tab = "mural",
}: {
  id: string;
  tab?: "mural" | "listas" | "membros";
}) {
  const repo = useRepository();
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, error } = useCommunity(id, cursor);
  const [modal, setModal] = useState<
    "message" | "list" | "scripture" | "invite" | null
  >(null);
  const [removing, setRemoving] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  if (error)
    return (
      <div className="page">
        <ErrorMessage message={error} />
      </div>
    );
  if (data === undefined)
    return (
      <div className="page">
        <Loading />
      </div>
    );
  if (data === null)
    return (
      <div className="page">
        <Empty title="Um caminho diferente.">
          <p>{copy.revoked}</p>
          <Link to="/comunidade" className="button secondary">
            Suas comunidades
          </Link>
        </Empty>
      </div>
    );
  const group = data.community;
  const admin = canManage(group.role);
  return (
    <div className="page community-detail">
      <Link to="/comunidade" className="back-link">
        <ArrowLeft size={15} />
        Suas comunidades
      </Link>
      <div className="group-heading">
        <div>
          <p className="eyebrow">UM ESPAÇO DE COMUNHÃO</p>
          <h1>{group.name}</h1>
          <p className="intro-copy">
            {group.description || "Palavra, presença e cuidado, juntos."}
          </p>
        </div>
        {admin && (
          <button
            className="button secondary small"
            onClick={() => setModal("invite")}
          >
            <KeyRound size={16} />
            Convidar
          </button>
        )}
      </div>
      {(group.scripture || admin) && (
        <aside className="group-scripture">
          <Leaf size={21} />
          <p>
            {group.scripture || "Escolha uma palavra para guiar a comunidade."}
          </p>
          {admin && (
            <button
              className="icon-button"
              aria-label="Editar escritura da comunidade"
              onClick={() => setModal("scripture")}
            >
              <Pencil size={16} />
            </button>
          )}
        </aside>
      )}
      <nav className="group-tabs" aria-label="Áreas da comunidade">
        <Link
          activeOptions={{ exact: true }}
          to="/comunidade/$communityId"
          params={{ communityId: id }}
          className={tab === "mural" ? "active" : ""}
        >
          <MessageSquare size={17} />
          Mural
        </Link>
        <Link
          to="/comunidade/$communityId/listas"
          params={{ communityId: id }}
          className={tab === "listas" ? "active" : ""}
        >
          <CheckCheck size={17} />
          Listas
        </Link>
        <Link
          to="/comunidade/$communityId/membros"
          params={{ communityId: id }}
          className={tab === "membros" ? "active" : ""}
        >
          <Users size={17} />
          Membros
        </Link>
      </nav>
      {tab === "mural" ? (
        <section className="community-section">
          <div className="section-top">
            <div>
              <h2>Palavras para a comunidade</h2>
              <p className="caption">
                Avisos e mensagens de quem cuida deste espaço.
              </p>
            </div>
            {admin && (
              <button
                className="button small"
                onClick={() => setModal("message")}
              >
                <Plus size={16} />
                Escrever
              </button>
            )}
          </div>
          {cursor && (
            <button
              className="text-button load-more"
              onClick={() => setCursor(null)}
            >
              Voltar às recentes
            </button>
          )}
          {data.hasMore && (
            <button
              className="text-button load-more"
              onClick={() => setCursor(data.nextCursor)}
            >
              Carregar anteriores
            </button>
          )}
          {data.messages.length ? (
            <div className="message-list">
              {data.messages.map((message) => (
                <article className="message-card" key={message.id}>
                  <header>
                    <span className="avatar">{initials(message.name)}</span>
                    <div>
                      <strong>{message.name}</strong>
                      <span>{formatMessageDate(message.sentAt)}</span>
                    </div>
                    <span className="message-author">Liderança</span>
                  </header>
                  <p>{message.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <Empty title="As palavras vão chegar.">
              <p>Os avisos da comunidade aparecerão aqui.</p>
            </Empty>
          )}
        </section>
      ) : tab === "listas" ? (
        <section className="community-section">
          <div className="section-top">
            <div>
              <h2>Pequenos gestos, juntos.</h2>
              <p className="caption">
                Suas marcações são pessoais. A comunidade vê apenas a contagem.
              </p>
            </div>
            {admin && (
              <button className="button small" onClick={() => setModal("list")}>
                <Plus size={16} />
                Criar lista
              </button>
            )}
          </div>
          {data.lists.length ? (
            <div className="checklists">
              {data.lists.map((list) => (
                <section className="checklist-card" key={list.id}>
                  <h3>
                    <Leaf size={18} />
                    {list.name}
                  </h3>
                  <ul>
                    {list.items.map((item) => (
                      <Tick item={item} key={item.id} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <Empty title="Espaço para o cuidado.">
              <p>As listas compartilhadas pela liderança aparecerão aqui.</p>
            </Empty>
          )}
        </section>
      ) : (
        <section className="community-section">
          <div className="section-top">
            <div>
              <h2>Quem caminha com você</h2>
              <p className="caption">
                Pessoas que fazem parte desta comunidade.
              </p>
            </div>
            <span className="caption">{data.members.length} pessoas</span>
          </div>
          <ul className="member-list">
            {data.members.map((member) => (
              <li key={member.id}>
                <span className="avatar">{initials(member.name)}</span>
                <div>
                  <strong>{member.name}</strong>
                  <span>
                    {member.role === "admin" ? "Liderança" : "Membro"}
                  </span>
                </div>
                {admin && (
                  <button
                    className="icon-button"
                    aria-label={"Remover " + member.name}
                    title={
                      canRemoveMember(
                        member.role,
                        data.members.filter((m) => m.role === "admin").length,
                      )
                        ? "Remover membro"
                        : copy.lastAdmin
                    }
                    disabled={
                      !canRemoveMember(
                        member.role,
                        data.members.filter((m) => m.role === "admin").length,
                      )
                    }
                    onClick={() =>
                      setRemoving({ id: member.id, name: member.name })
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {modal && (
        <Modal
          title={
            modal === "message"
              ? "Uma palavra para a comunidade."
              : modal === "list"
                ? "Um convite ao cuidado."
                : modal === "scripture"
                  ? "A Palavra que nos reúne."
                  : "Convide alguém para caminhar."
          }
          onClose={() => setModal(null)}
        >
          {modal === "invite" ? (
            <div className="invite-content">
              <p>
                Compartilhe este código apenas com quem você deseja receber em{" "}
                <strong>{group.name}</strong>.
              </p>
              <code>{group.inviteCode}</code>
              <button
                className="button secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(group.inviteCode ?? "");
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <Copy size={16} />
                Copiar código
              </button>
              {copied && <Success>Código copiado.</Success>}
            </div>
          ) : (
            <ActionForm
              label={
                modal === "message"
                  ? "Publicar mensagem"
                  : modal === "list"
                    ? "Criar lista"
                    : "Salvar escritura"
              }
              onDone={() => setModal(null)}
              onSubmit={async (form) => {
                if (modal === "message")
                  await repo.sendMessage(
                    id,
                    messageSchema.parse(form.get("content")),
                  );
                if (modal === "scripture")
                  await repo.updateScripture(
                    id,
                    scriptureSchema.parse(form.get("scripture")),
                  );
                if (modal === "list") {
                  const value = checklistSchema.parse({
                    name: form.get("name"),
                    items: String(form.get("items"))
                      .split("\n")
                      .filter((line) => line.trim()),
                  });
                  await repo.createChecklist(id, value.name, value.items);
                }
              }}
            >
              {modal === "message" ? (
                <>
                  <p className="dialog-description">
                    Sua mensagem será lida pelos membros de {group.name}.
                  </p>
                  <Field
                    name="content"
                    label="Mensagem"
                    placeholder="Escreva com cuidado e simplicidade…"
                    textarea
                    maxLength={1000}
                  />
                </>
              ) : modal === "scripture" ? (
                <Field
                  name="scripture"
                  label="Texto e referência"
                  defaultValue={group.scripture}
                  textarea
                  maxLength={500}
                  required={false}
                />
              ) : (
                <>
                  <Field
                    name="name"
                    label="Nome da lista"
                    placeholder="Ex.: Motivos de oração"
                    maxLength={80}
                  />
                  <Field
                    name="items"
                    label="Itens (um por linha)"
                    placeholder="Pelas famílias da comunidade&#10;Por quem precisa de acolhimento"
                    textarea
                  />
                </>
              )}
            </ActionForm>
          )}
        </Modal>
      )}
      {removing && (
        <Modal title="Remover da comunidade?" onClose={() => setRemoving(null)}>
          <p className="dialog-description">
            {removing.name} perderá o acesso a {group.name}. O histórico será
            preservado.
          </p>
          <ActionForm
            label="Confirmar remoção"
            onSubmit={async () => repo.removeMember(id, removing.id)}
            onDone={() => setRemoving(null)}
          />
        </Modal>
      )}
    </div>
  );
}

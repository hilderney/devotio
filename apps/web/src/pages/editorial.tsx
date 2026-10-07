import { useMemo, useState } from "react";
import { useRepository, useWatch } from "domain/react";
import { canPublish, localDate, publicationSchema, type Devotional, type ReadingRepository } from "domain/core";
import { useApp } from "../context";
import { ActionForm, Field, Empty, ErrorMessage, Loading, Modal, Success } from "../components";
export function EditorialPage() {
  const app = useApp(), repository = useRepository();
  if (!canPublish(app.localProfile?.editorial) || !repository.reading) return <Empty title="Acesso reservado à equipe editorial." />;
  return <Editorial reading={repository.reading} name={app.localProfile!.name} />;
}
function Editorial({ reading, name }: { reading: ReadingRepository; name: string }) {
  const state = useWatch(useMemo(() => reading.watchEditorial(), [reading]));
  const [editing, setEditing] = useState<Devotional | "new" | null>(null);
  const [withdrawing, setWithdrawing] = useState<Devotional | null>(null);
  const [success, setSuccess] = useState("");
  const draft = editing && editing !== "new" ? editing : null;
  return <div className="page editorial-page"><p className="eyebrow">DESENVOLVIMENTO · EQUIPE EDITORIAL</p><h1>Palavras com<br /><em>responsabilidade.</em></h1><p className="intro-copy">Prepare, confira e publique no ambiente local. Favoritos já salvos preservam o texto anterior.</p>
    <button className="button" onClick={() => setEditing("new")}>Preparar devocional</button>
    {success && <Success>{success}</Success>}
    {state.error ? <ErrorMessage message={state.error} /> : !state.data ? <Loading /> : <div className="editorial-list">{state.data.map(entry => <article key={entry.devotional.date}>
      <div><p className="eyebrow">{entry.devotional.date} · {entry.withdrawn ? "RETIRADO" : entry.publishedAt > Date.now() ? "AGENDADO" : "PUBLICADO"}</p><h2>{entry.devotional.reference}</h2></div>
      <div className="editorial-actions"><button className="button secondary small" onClick={() => setEditing(entry.devotional)}>Editar / publicar</button><button className="text-button" disabled={entry.withdrawn} onClick={() => setWithdrawing(entry.devotional)}>Retirar</button></div>
    </article>)}</div>}
    {editing && <Modal title={draft ? "Revisar devocional" : "Preparar devocional"} onClose={() => setEditing(null)}><ActionForm label="Publicar no ambiente local" onDone={() => { setEditing(null); setSuccess("Devocional publicado no banco local."); }} onSubmit={async form => {
      const values = Object.fromEntries(form.entries());
      await reading.publish(publicationSchema.parse({ ...values, translation: "AA · ABíbliaDigital", publishedAt: Date.now(), audioUrl: values.audioUrl || undefined }));
    }}>
      <Field name="date" label="Data (AAAA-MM-DD)" defaultValue={draft?.date ?? localDate()} maxLength={10} />
      <Field name="reference" label="Referência bíblica" defaultValue={draft?.reference} maxLength={160} />
      <Field name="scripture" label="Texto bíblico AA conferido" defaultValue={draft?.scripture} textarea maxLength={6000} />
      <Field name="reflection" label="Reflexão" defaultValue={draft?.reflection} textarea maxLength={12000} />
      <Field name="prayerSuggestion" label="Sugestão de oração" defaultValue={draft?.prayerSuggestion} textarea maxLength={2000} />
      <Field name="credit" label="Crédito / autoria" defaultValue={draft?.credit} maxLength={1000} />
      <Field name="reviewedBy" label="Revisado por" defaultValue={name} maxLength={160} />
      <Field name="licenseEvidence" label="Registro da fonte e condições de uso" placeholder="Fonte consultada e autorização aplicável ao texto" maxLength={2000} />
      <Field name="reason" label="Motivo desta publicação ou correção" maxLength={1000} />
      <Field name="audioUrl" label="Áudio HTTPS (opcional)" defaultValue={draft?.audioUrl} required={false} />
    </ActionForm></Modal>}
    {withdrawing && <Modal title="Retirar esta publicação?" onClose={() => setWithdrawing(null)}><p>O devocional de {withdrawing.date} deixará de aparecer nas leituras recentes. Cópias favoritas já salvas serão preservadas.</p><ActionForm label="Confirmar retirada" onSubmit={form => reading.withdraw(withdrawing.date, String(form.get("reason")))} onDone={() => { setWithdrawing(null); setSuccess("Publicação retirada. Os favoritos pessoais foram preservados."); }}><Field name="reason" label="Motivo" maxLength={1000} /></ActionForm></Modal>}
  </div>;
}

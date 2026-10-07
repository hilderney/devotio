import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRepository, useWatch } from "domain/react";
import type { ReadingRepository } from "domain/core";
import { Empty, ErrorMessage, Loading, Ornament } from "../components";

export function BiblePage() {
  const repository = useRepository();
  if (!repository.reading) return <Empty title="Leitura bíblica em preparação." />;
  return <BibleReader reading={repository.reading} />;
}
function BibleReader({ reading }: { reading: ReadingRepository }) {
  const params = useSearch({ from: "/_reader/biblia" });
  const navigate = useNavigate();
  const catalog = useWatch(useMemo(() => reading.watchBible(), [reading]));
  const chapter = useWatch(useMemo(() => reading.watchChapter(params.book, params.chapter), [reading, params.book, params.chapter]));
  const [text, setText] = useState("");
  const [search, setSearch] = useState<{ query: string; page: number } | null>(null);
  const chapterReady = !!chapter.data;
  useEffect(() => {
    if (chapterReady && params.verse) document.getElementById(`verse-${params.verse}`)?.scrollIntoView({ block: "center" });
  }, [chapterReady, params.book, params.chapter, params.verse]);
  const open = (book: string, chapter: number) => { setSearch(null); void navigate({ to: "/biblia", search: { book, chapter } }); };
  return <div className="page bible-page">
    <header className="page-heading bible-heading">
      <div><p className="eyebrow"><BookOpen size={16} /> A PALAVRA, POR INTEIRO</p>
        <h1>Leia com calma.<br /><em>Encontre sentido.</em></h1>
        <p className="intro-copy">AA · Uma leitura de cada vez.</p></div><Ornament />
    </header>
    {catalog.error ? <ErrorMessage message={catalog.error} /> : !catalog.data ? <Loading /> : !catalog.data.books.length ?
      <Empty title="A Bíblia ainda não foi preparada."><p>Execute a preparação dos dados indicada no README e reinicie o servidor local.</p></Empty> : <>
      <div className="bible-controls">
        <label className="field"><span>Livro</span><select value={params.book} onChange={e => open(e.target.value, 1)}>
          {(["VT", "NT"] as const).map(testament => <optgroup key={testament} label={testament === "VT" ? "Antigo Testamento" : "Novo Testamento"}>
            {catalog.data!.books.filter(book => book.testament === testament).map(book => <option key={book.abbrev} value={book.abbrev}>{book.name}</option>)}
          </optgroup>)}
        </select></label>
        <label className="field"><span>Capítulo</span><select value={params.chapter} onChange={e => open(params.book, Number(e.target.value))}>
          {Array.from({ length: catalog.data.books.find(b => b.abbrev === params.book)?.chapters ?? 1 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
        </select></label>
      </div>
      <form className="bible-search" onSubmit={e => { e.preventDefault(); setSearch({ query: text.trim(), page: 0 }); }}>
        <label className="sr-only" htmlFor="bible-search">Buscar palavras na Bíblia</label>
        <Search size={18} aria-hidden="true" /><input id="bible-search" placeholder="Buscar uma palavra na Bíblia…" minLength={3} maxLength={100} required value={text} onChange={e => setText(e.target.value)} />
        <button className="button small" type="submit">Buscar</button>
      </form>
      {search ? <BibleSearch reading={reading} query={search.query} page={search.page} onPage={page => setSearch({ ...search, page })} onClose={() => setSearch(null)} /> :
        chapter.error ? <ErrorMessage message={chapter.error} /> : chapter.data === undefined ? <Loading /> : !chapter.data ?
          <Empty title="Capítulo não encontrado."><button className="button secondary" onClick={() => open("jo", 1)}>Abrir João 1</button></Empty> : <>
            <div className="bible-chapter-heading"><p className="eyebrow">{chapter.data.book.testament === "VT" ? "ANTIGO" : "NOVO"} TESTAMENTO</p>
              <h2>{chapter.data.book.name} <em>{params.chapter}</em></h2><span className="caption">Versão AA</span></div>
            <article className="bible-verses" aria-label={`${chapter.data.book.name}, capítulo ${params.chapter}`}>
              {chapter.data.verses.map(verse => <p key={verse.number} id={`verse-${verse.number}`} className={params.verse === verse.number ? "selected-verse" : ""}>
                <Link to="/biblia" search={{ ...params, verse: verse.number }} aria-label={`Versículo ${verse.number}, link direto`}>{verse.number}</Link>{verse.text}
              </p>)}
            </article>
            <nav className="chapter-navigation" aria-label="Capítulos">
              <button className="button secondary" disabled={params.chapter === 1} onClick={() => open(params.book, params.chapter - 1)}><ChevronLeft size={17} />Anterior</button>
              <span className="caption">{params.chapter} de {chapter.data.book.chapters}</span>
              <button className="button secondary" disabled={params.chapter >= chapter.data.book.chapters} onClick={() => open(params.book, params.chapter + 1)}>Próximo<ChevronRight size={17} /></button>
            </nav>
          </>}
      <p className="bible-source caption">Texto AA fornecido pela <a href="https://abibliadigital.api.br" target="_blank" rel="noreferrer">ABíbliaDigital</a>. Leitura a partir da cópia local.</p>
    </>}
  </div>;
}
function BibleSearch({ reading, query, page, onPage, onClose }: { reading: ReadingRepository; query: string; page: number; onPage: (page: number) => void; onClose: () => void }) {
  const result = useWatch(useMemo(() => reading.watchSearch(query, page), [reading, query, page]));
  return <section className="bible-results" aria-label="Resultados da busca">
    <div className="section-top"><h2>Encontros na Palavra</h2><button className="text-button" onClick={onClose}>Voltar à leitura</button></div>
    {result.error ? <ErrorMessage message={result.error} /> : !result.data ? <Loading /> : <>
      <p role="status" className="caption">{result.data.total} {result.data.total === 1 ? "resultado" : "resultados"} para “{query}”</p>
      {!result.data.total && <Empty title="Nenhum versículo encontrado."><p>Experimente outra palavra.</p></Empty>}
      {result.data.verses.map(verse => <Link className="verse-result" key={`${verse.abbrev}-${verse.chapter}-${verse.number}`} to="/biblia" search={{ book: verse.abbrev, chapter: verse.chapter, verse: verse.number }} onClick={onClose}>
        <span className="eyebrow">{verse.bookName} {verse.chapter}:{verse.number}</span><p>{verse.text}</p><span className="caption">Ler no capítulo →</span>
      </Link>)}
      {result.data.total > 40 && <nav className="chapter-navigation" aria-label="Páginas da busca"><button className="button secondary" disabled={page === 0} onClick={() => onPage(page - 1)}>Anterior</button><span className="caption">Página {page + 1}</span><button className="button secondary" disabled={(page + 1) * 40 >= result.data.total} onClick={() => onPage(page + 1)}>Próxima</button></nav>}
    </>}
  </section>;
}

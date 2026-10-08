import { Link } from "@tanstack/react-router";
import type { BibleQuote } from "domain/core";
export function Quote({ quote }: { quote: BibleQuote }) {
  return (
    <blockquote className="community-quote">
      <p>{quote.text}</p>
      <footer>
        {quote.reference} · {quote.versionName}
      </footer>
      <Link
        to="/biblia"
        search={{
          book: quote.book,
          chapter: quote.chapter,
          verse: quote.first,
        }}
      >
        Ler na Bíblia
      </Link>
    </blockquote>
  );
}

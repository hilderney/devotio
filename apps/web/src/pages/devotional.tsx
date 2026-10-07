import { ArrowDown, Leaf, Sun } from "lucide-react";
import { formatDate, copy } from "domain/core";
import { useReader } from "../context";
import { Empty, Loading, ErrorMessage, Ornament } from "../components";
export function DevotionalPage() {
  const { data, error, date } = useReader();
  return (
    <div className="devotional-page">
      <section className="reading-intro">
        <div>
          <p className="eyebrow">
            <Sun size={15} />
            Deixe o ruído lá fora. Acolha a Palavra aqui.
          </p>
        </div>
        <Ornament />
      </section>
      <div className="reading-meta">
        <a href="#palavra" className="text-button">
          <span className="date-label">{formatDate(date)}</span>
          Começar a leitura <ArrowDown size={14} />
        </a>
      </div>
      {error ? (
        <div className="reading-column">
          <ErrorMessage message={error} />
          <button
            className="button secondary"
            onClick={() => location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      ) : !data ? (
        <Loading />
      ) : !data.devotional ? (
        <Empty title="Um espaço à espera da Palavra.">
          <p>{copy.emptyDevotional}</p>
        </Empty>
      ) : (
        <>
          <article className="reading-column" id="palavra">
            <header className="section-heading">
              <span className="section-number">01</span>
              <span className="eyebrow">PALAVRA</span>
              <span className="section-rule" />
            </header>
            <h2 className="scripture-reference">{data.devotional.reference}</h2>
            <p className="translation">{data.devotional.translation}</p>
            <div className="scripture-text">
              {data.devotional.scripture
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>
                    <span className="verse-marker" aria-hidden="true">
                      ✦
                    </span>
                    {paragraph}
                  </p>
                ))}
            </div>
            <div className="reading-divider">
              <span />
              <Leaf size={18} />
              <span />
            </div>
            <header className="section-heading">
              <span className="section-number">02</span>
              <span className="eyebrow">MEDITAR</span>
              <span className="section-rule" />
            </header>
            <div className="reflection-text">
              {data.devotional.reflection
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
            <div className="section-heading">
                <span className="section-number">03</span>
                <span className="eyebrow">ORAÇÃO</span>
                <span className="section-rule" />
            </div>
            <div className="reading-divider">
              <span />
              <Leaf size={18} />
              <span />
            </div>
            <section className="prayer-card">
              <p>{data.devotional.prayerSuggestion}</p>
              <span className="prayer-end" aria-hidden="true">
                ✧
              </span>
            </section>
            <p className="editorial-credit">{data.devotional.credit}</p>
          </article>
          {data.settings?.weeklyVerse && (
            <aside className="weekly-theme">
              <span className="eyebrow">AO LONGO DESTA SEMANA</span>
              <p>{data.settings.weeklyVerse}</p>
              <span className="caption">{data.settings.weeklyReference}</span>
            </aside>
          )}
          <div className="reading-close">
            <span className="tiny-line" />
            <p>Leve a Palavra com você.</p>
            <span className="caption">
              O encontro continua nas pequenas coisas.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

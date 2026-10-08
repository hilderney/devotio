import { Button } from "../ui/button";
import { Leaf } from "lucide-react";
import { copy } from "domain/core";
import { useReader } from "../context";
import { Empty, Loading, ErrorMessage } from "../components";
export function DevotionalPage() {
  const { data, error } = useReader();
  return (
    <div className="devotional-page">
      <h1 className="sr-only">Devocional</h1>
      {error ? (
        <div className="reading-column">
          <ErrorMessage message={error} />
          <Button variant="secondary" onClick={() => location.reload()}>
            Tentar novamente
          </Button>
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
            <div className="reading-divider">
              <span />
              <Leaf size={18} />
              <span />
            </div>
            <div className="section-heading">
              <span className="section-number">03</span>
              <span className="eyebrow">ORAÇÃO</span>
              <span className="section-rule" />
            </div>

            <section className="prayer-card">
              <p>{data.devotional.prayerSuggestion}</p>
              <span className="prayer-end" aria-hidden="true">
                ✧
              </span>
            </section>
            <div className="reading-divider">
              <span />
              <Leaf size={18} />
              <span />
            </div>
            <p className="editorial-credit">{data.devotional.credit}</p>
          </article>
          {data.settings?.weeklyVerse && (
            <aside className="weekly-theme">
              <span className="eyebrow">AO LONGO DESTA SEMANA</span>
              <p>{data.settings.weeklyVerse}</p>
              <span className="caption">{data.settings.weeklyReference}</span>
            </aside>
          )}
        </>
      )}
    </div>
  );
}

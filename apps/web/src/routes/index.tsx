import { createFileRoute } from '@tanstack/react-router';
import { todayLocalISODate } from '@devocional/domain/date';
import { useDailyDevotional, useMonthlyAndWeeklyVerse } from '@devocional/domain/hooks';

export const Route = createFileRoute('/')({
  component: DevocionalPage,
});

function DevocionalPage() {
  const date = todayLocalISODate();
  const { data: settings } = useMonthlyAndWeeklyVerse();
  const { data: devotional, isLoading, isEmpty } = useDailyDevotional(date);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-neutral-400">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      {settings && (
        <div className="mb-8 space-y-4">
          <div className="rounded-lg bg-scripture-bg border border-scripture-border p-6">
            <p className="text-sm font-medium text-scripture-text uppercase tracking-wide">
              Versículo do Mês
            </p>
            <p className="mt-2 text-lg font-serif text-scripture-text">
              {settings.monthlyVerse}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-100 border border-neutral-200 p-6">
            <p className="text-sm font-medium text-neutral-700 uppercase tracking-wide">
              Versículo da Semana
            </p>
            <p className="mt-2 text-lg font-serif text-neutral-900">
              {settings.weeklyVerse}
            </p>
          </div>
        </div>
      )}

      <article className="space-y-6">
        <header className="text-center">
          <time className="text-sm text-neutral-500" dateTime={date}>
            {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </time>
        </header>

        {isEmpty ? (
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-8 text-center">
            <p className="text-neutral-600">
              O devocional de hoje ainda não foi publicado.
            </p>
          </div>
        ) : devotional && (
          <>
            <section className="rounded-lg bg-neutral-50 border-l-4 border-primary-600 p-6">
              <h1 className="text-xl font-semibold text-neutral-900">
                {devotional.scripture}
              </h1>
            </section>

            <section className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {devotional.reflection}
              </p>
            </section>

            {devotional.audioUrl && (
              <section>
                <audio
                  src={devotional.audioUrl}
                  controls
                  className="w-full"
                  preload="metadata"
                />
              </section>
            )}

            <section className="rounded-lg bg-prayer-bg border border-prayer-border p-6">
              <p className="text-sm font-medium text-prayer-text uppercase tracking-wide mb-2">
                Sugestão de Oração
              </p>
              <p className="text-prayer-text leading-relaxed">
                {devotional.prayerSuggestion}
              </p>
            </section>
          </>
        )}
      </article>
    </main>
  );
}
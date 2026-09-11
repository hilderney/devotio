import React, { useState, useEffect } from "react";
import {
  useDailyDevotional,
  useMonthlyAndWeeklyVerse,
  type DevotionalData,
  type GlobalSettingsData,
} from "domain";
import { MonthlyVerseBanner } from "../components/MonthlyVerseBanner";
import { WeeklyVerseBanner } from "../components/WeeklyVerseBanner";
import { DevotionalScripture } from "../components/DevotionalScripture";
import { DevotionalReflection } from "../components/DevotionalReflection";
import { PrayerSuggestionCard } from "../components/PrayerSuggestionCard";
import { AudioPlayerWeb } from "../components/AudioPlayerWeb";
import { EmptyDevotionalState } from "../components/EmptyDevotionalState";
import { DevotionalSkeleton } from "../components/DevotionalSkeleton";

// Seed de exemplo para visualização em modo de desenvolvimento enquanto o Convex estiver sem dados
const DEV_SAMPLE_SETTINGS: GlobalSettingsData = {
  monthlyVerse:
    "Permancei em mim, e eu permanecerei em vós. Como a vara de si mesma não pode dar fruto, se não estiver na videira, assim também vós, se não permanecerdes em mim. (João 15:4)",
  weeklyVerse:
    "Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fidelidade. (Gálatas 5:22)",
  updatedAt: Date.now(),
};

const DEV_SAMPLE_DEVOTIONAL: DevotionalData = {
  date: new Date().toISOString().slice(0, 10),
  scripture:
    "1 O Senhor é o meu pastor; nada me faltará.\n2 Deitar-me faz em verdes pastos, guia-me mansamente a águas tranqüilas.\n3 Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
  reflection:
    "No silêncio das primeiras horas, a promessa da presença do Pastor não é um apelo a um otimismo vazio, mas o fundamento inabalável da nossa suficiência em Cristo.\n\nQuando Davi declara que nada lhe faltará, ele não ignora os vales de sombra, mas repousa na certeza de que a provisão do Senhor não é primariamente circunstancial, mas pessoal: o próprio Deus é a herança e o sustento do Seu povo.\n\nQue a nossa oração hoje seja despir o coração de ansiedades terrenas e descansar nas águas mansas da fidelidade divina.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  prayerSuggestion:
    "Apresente diante de Deus as áreas da sua vida onde a ansiedade tem tentado roubar o descanso. Peça a graça de reconhecer a voz do Bom Pastor.",
  createdAt: Date.now(),
};

export const DevotionalPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [useDevMock, setUseDevMock] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hook do Tema do Mês e Tema da Semana
  const { data: settings } = useMonthlyAndWeeklyVerse({
    queryResult: useDevMock ? DEV_SAMPLE_SETTINGS : undefined,
  });

  // Hook do Devocional Diário
  const {
    data: devotional,
    isLoading,
    isEmpty,
    currentDate,
  } = useDailyDevotional({
    queryResult: isClient
      ? useDevMock
        ? DEV_SAMPLE_DEVOTIONAL
        : null
      : undefined,
  });

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* 1. Tema do Mês (Sticky no topo) */}
      <MonthlyVerseBanner verse={settings?.monthlyVerse} />

      {/* 2. Tema da Semana (Secundário, logo abaixo) */}
      <WeeklyVerseBanner verse={settings?.weeklyVerse} />

      {/* Controle discreto de ambiente (somente para inspeção em desenvolvimento) */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-4 flex justify-end">
        <button
          onClick={() => setUseDevMock(!useDevMock)}
          className="text-[11px] text-textMuted hover:text-textSecondary underline transition-colors"
          title="Alternar entre dados de exemplo e estado vazio para teste"
        >
          {useDevMock
            ? "Modo Demo ativo (Clique para testar Estado Vazio)"
            : "Testando Estado Vazio (Clique para ativar Demo)"}
        </button>
      </div>

      {/* 3. Corpo Principal do Devocional */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8">
        <article className="space-y-8">
          {/* Cabeçalho da Data Sóbrio */}
          <header className="border-b border-subtleBg pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-textPrimary tracking-tight">
              Palavra do Dia
            </h1>
            <time
              dateTime={currentDate}
              className="text-xs sm:text-sm text-textSecondary uppercase tracking-widest font-sans"
            >
              {new Intl.DateTimeFormat("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </time>
          </header>

          {/* Renderização Condicional de Conteúdo */}
          {!isClient || isLoading ? (
            <DevotionalSkeleton />
          ) : isEmpty || !devotional ? (
            <EmptyDevotionalState
              dateLabel={new Intl.DateTimeFormat("pt-BR", {
                day: "numeric",
                month: "long",
              }).format(new Date())}
            />
          ) : (
            <div className="space-y-8 animate-fadeIn">
              {/* Áudio do Devocional (quando presente, sem autoplay) */}
              <AudioPlayerWeb
                audioUrl={devotional.audioUrl}
                dateLabel={new Intl.DateTimeFormat("pt-BR", {
                  day: "numeric",
                  month: "long",
                }).format(new Date())}
              />

              {/* Texto Bíblico (3-5 versículos corridos) */}
              <DevotionalScripture scripture={devotional.scripture} />

              {/* Reflexão Pastoral */}
              <DevotionalReflection reflection={devotional.reflection} />

              {/* Card de Sugestão de Oração */}
              <PrayerSuggestionCard
                prayerSuggestion={devotional.prayerSuggestion}
              />
            </div>
          )}
        </article>
      </main>

      {/* Rodapé Sóbrio */}
      <footer className="border-t border-subtleBg py-6 text-center text-xs text-textMuted font-sans">
        <p>Devotio — Reverência sobre engajamento.</p>
      </footer>
    </div>
  );
};

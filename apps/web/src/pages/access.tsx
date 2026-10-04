import { useState } from "react";
import { Link, Navigate, useSearch } from "@tanstack/react-router";
import { loginDestination } from "domain/core";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useApp } from "../context";
import { Brand, Ornament, ErrorMessage } from "../components";
export function SignInPage() {
  const app = useApp();
  const search = useSearch({ from: "/entrar" });
  const destination = loginDestination(search.redirect);
  const [error, setError] = useState(
    search.error
      ? "O acesso não foi concluído. Você pode tentar novamente."
      : "",
  );
  const [pending, setPending] = useState(false);
  if (app.repository) return <Navigate to={destination} replace />;
  return (
    <div className="access-page">
      <Link to="/entrar">
        <Brand />
      </Link>
      <div className="access-content">
        <Ornament />
        <p className="eyebrow">UM ENCONTRO, TODOS OS DIAS</p>
        <h1>
          Menos ruído.
          <br />
          <em>Mais presença.</em>
        </h1>
        <p>
          Um lugar para ler a Palavra, encontrar descanso
          <br className="desktop-only" /> e caminhar em comunidade.
        </p>
        {app.configured || app.preview ? (
          <button
            className="button login-button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              setError("");
              try {
                await app.onLogin(destination);
              } catch {
                setError("Não foi possível entrar. Tente novamente.");
              } finally {
                setPending(false);
              }
            }}
          >
            {pending
              ? "Entrando…"
              : app.preview
                ? "Explorar a prévia local"
                : "Continuar com Google"}
            <ArrowRight size={17} />
          </button>
        ) : (
          <div className="setup-notice">
            <BookOpen size={23} />
            <h2>Estamos preparando este espaço.</h2>
            <p>O acesso ainda não está disponível. Volte em breve.</p>
          </div>
        )}
        {app.preview && (
          <p className="caption">
            Ambiente local · dados ilustrativos e temporários.
          </p>
        )}
        {error && <ErrorMessage message={error} />}
        <p className="privacy-note">
          <ShieldCheck size={15} />
          Sua fé merece um espaço de cuidado.
        </p>
        <Link to="/privacidade" className="underlined">
          Conheça nossa proposta de privacidade
        </Link>
      </div>
      <footer className="access-footer">
        devotio · Palavra, presença e oração
      </footer>
    </div>
  );
}
export function InfoPage({ kind }: { kind: "help" | "privacy" }) {
  const app = useApp();
  return (
    <article className="info-page">
      <Link
        to={app.repository ? "/devocional" : "/entrar"}
        className="back-link"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <p className="eyebrow">
        DEVOTIO · {kind === "help" ? "PERTO DE VOCÊ" : "CUIDADO E DISCRIÇÃO"}
      </p>
      <h1>
        {kind === "help" ? (
          <>
            Um espaço simples.
            <br />
            Sempre por perto.
          </>
        ) : (
          <>
            Sua caminhada
            <br />
            merece cuidado.
          </>
        )}
      </h1>
      {kind === "help" ? (
        <>
          <p className="lead">
            Leia no seu tempo. Participe da sua comunidade. Não há metas,
            sequências ou pressa.
          </p>
          <section>
            <h2>
              <Smartphone size={22} />
              Leve o Devotio para a tela inicial
            </h2>
            <p>
              No iPhone, abra no Safari, toque em Compartilhar e escolha
              “Adicionar à Tela de Início”. No Android, abra o menu do navegador
              e procure “Instalar aplicativo” ou “Adicionar à tela inicial”.
            </p>
            <p>
              A instalação é opcional. Para carregar o conteúdo, você precisa de
              internet.
            </p>
          </section>
          <section>
            <h2>Sua comunidade</h2>
            <p>
              Peça o código de oito caracteres à liderança. Em Comunidade,
              escolha “Entrar com código”. O mural é publicado pela liderança;
              suas marcações pessoais não são mostradas nominalmente aos demais
              membros.
            </p>
          </section>
          {app.preview && (
            <section className="notice">
              <h2>Sobre esta prévia</h2>
              <p>
                As pessoas, mensagens e textos deste ambiente são ilustrativos.
                As alterações funcionam apenas nesta sessão e são descartadas ao
                recarregar. Para experimentar convites, use{" "}
                <strong>ESPERANC</strong>.
              </p>
            </section>
          )}
          <section>
            <h2>Precisa de ajuda?</h2>
            <p>
              Durante a preparação do piloto, procure a pessoa que compartilhou
              esta prévia. O canal oficial de atendimento será informado antes
              da abertura pública.
            </p>
          </section>
        </>
      ) : (
        <>
          <p className="lead">
            Um ambiente de leitura e comunidade deve respeitar o que é pessoal.
          </p>
          <section className="notice">
            <h2>Aplicação em preparação</h2>
            <p>
              Este é um aviso de pré-lançamento, não a política definitiva do
              serviço. Responsável pelo tratamento, contato, base legal, prazos
              de retenção e processo de exclusão precisam ser definidos antes do
              piloto com dados reais.
            </p>
          </section>
          <section>
            <h2>Na prévia local</h2>
            <p>
              Usamos dados ilustrativos mantidos na memória. Não há autenticação
              real, envio de mensagens a outras pessoas, analytics ou
              armazenamento das suas marcações neste dispositivo.
            </p>
          </section>
          <section>
            <h2>Na versão conectada</h2>
            <p>
              Nome, identificação da conta e associações às comunidades serão
              usados para acesso e permissões. O e-mail não será exibido na
              lista de membros. Conteúdo comunitário exige participação no grupo
              e cada pessoa altera apenas suas próprias marcações.
            </p>
          </section>
          <section>
            <h2>O que é compartilhado</h2>
            <p>
              As listas mostram uma contagem agregada. Em grupos pequenos, ela
              pode permitir inferências; por isso, não equivale a anonimização
              garantida. Nenhuma marcação gera ranking ou avaliação espiritual.
            </p>
          </section>
          <section>
            <h2>Seus direitos e atendimento</h2>
            <p>
              O canal para acesso, correção e exclusão dos dados será
              disponibilizado antes da abertura do piloto. Não use dados
              pessoais reais para avaliar esta prévia.
            </p>
          </section>
        </>
      )}
    </article>
  );
}

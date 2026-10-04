# Spec: Publicação do piloto gratuito

**ID:** 005-piloto-publicacao  
**Status:** rascunho — decisões de canal e ambiente registradas em 03/10/2026; execução e aprovação formal pendentes  
**Versão alvo:** piloto v1 na web  
**Criada:** 03/10/2026  
**Relacionadas:** [004-fundacao-lancamento](../004-fundacao-lancamento/spec.md) (produto e portões R1/R2); [ADR 001](../../docs/adr/001-web-first-free-launch.md); não altera contratos de 001/002.

## 1. Contexto e problema

A base web da spec 004 está implementada localmente, mas ainda não existe um endereço público HTTPS com identidade real e conteúdo aprovado. Para a fase de testes com convidados, precisamos publicar o app com custo de serviços zero, contas a criar do zero e um único ambiente — sem domínio pago nem lojas.

## 2. Papéis envolvidos

- Operador técnico: cria contas nos provedores, configura autenticação e publica a interface.
- Editorial: libera conteúdo revisado antes do convite a leitores.
- Responsável pelo produto: decide abertura do piloto e limites de convite.
- Leitor convidado: acessa pelo navegador no URL público; papéis de comunidade seguem a spec 002.
- Sem diferenciação nova de AG/AC/membro nesta spec — apenas o canal de distribuição e a operação do piloto.

## 3. Histórias de usuário

- Como operador, quero um endereço HTTPS estável para o app, para que convidados testem sem instalar loja.
- Como leitor convidado, quero entrar com minha conta Google e usar o app no celular, para validar leitura e comunidade.
- Como responsável pelo produto, quero manter o piloto nas cotas gratuitas e expandir só com evidência de uso.
- Como editorial, quero que nenhum texto de demonstração apareça no ambiente compartilhado com convidados.

## 4. Requisitos funcionais

1. O piloto deve ser acessível por um URL HTTPS público no navegador (desktop e celular), sem exigir loja de aplicativos.
2. Autenticação real (Google) deve funcionar no URL público, incluindo cancelamento, falha, logout e retorno ao destino interno após login — conforme 004.
3. Deve existir um único ambiente compartilhado nesta fase (sem homologação/produção separados).
4. A interface publicada não pode expor fixtures, bypass de desenvolvimento nem conteúdo editorial não aprovado.
5. Rotas da SPA devem abrir por link direto e sobreviver a refresh no URL público.
6. Instalação opcional como PWA permanece desejável; não é obrigatória para participar do piloto.
7. O operador deve poder acompanhar cotas dos provedores e interromper expansão se os gatilhos de custo forem atingidos.
8. A abertura a convidados só ocorre após smoke test no URL final (login, comunidade básica, estados vazios/erro recuperáveis).

## 5. Requisitos não-funcionais

- Meta de custo de serviços: R$ 0/mês enquanto o piloto permanecer nas cotas gratuitas documentadas.
- Um ambiente apenas; domínio próprio fica fora desta fase.
- Sem áudio no primeiro convite, salvo medição prévia de armazenamento/egresso (áudio ausente é versão válida).
- Segredos de autenticação e deploy nunca no client nem no repositório.
- Recuperação: rollback da interface estática e preservação/restauração de dados conforme processo de release; não migrar automaticamente para plano pago ao bater limite.
- Distribuição nativa (Expo/lojas) permanece adiada.

## 6. Regras de visibilidade/permissão

Sem alteração das regras de 001/002/004. Esta spec só exige que o ambiente público respeite as mesmas barreiras de servidor.

| Papel | Pode ver | Pode criar | Pode editar/remover |
|---|---|---|---|
| Visitante no URL público | Acesso, ajuda e aviso de privacidade | Não | Não |
| Usuário autenticado | Conteúdo e comunidades conforme 001/002/004 | Conforme 002 | Conforme 002/004 |
| Editorial/operador | Painéis/ferramentas internas de publicação e deploy | Configuração do piloto e publicação aprovada | Correções/retiradas e rollback operacional |
| AG/AC/membro | Inalterado | Inalterado | Inalterado |

## 7. Fora de escopo

- Domínio próprio, CDN de arquivos à parte, e-mail/SMS, analytics pagos.
- Ambiente de homologação separado do piloto.
- CI/CD além do build do hospedeiro estático escolhido.
- Lojas (App Store / Play), Expo, push.
- Troca de backend ou de provedor de login.
- Ativação automática de plano pago ou excedentes faturáveis.
- Aprovação de tradução/licença em si (permanece em R2 / processo editorial da 004).

## 8. Dados envolvidos

Nenhuma tabela ou campo novo. Usa o schema e as funções já previstos pela 004 (contas, auth, devocionais, comunidades). Dados de demonstração locais não devem ser migrados para o ambiente do piloto.

## 9. Perguntas em aberto

1. Nome definitivo do projeto no Pages e do deployment Convex (rótulos operacionais).
2. Lista inicial de e-mails no consentimento OAuth em modo Testing e tamanho do primeiro convite (meta sugerida: 20–50).
3. Responsável nomeado para monitoramento diário de cotas na primeira semana.
4. Data de abertura do piloto após smoke test (depende de R1/R2 da 004).

## 10. Aprovação e lançamento

- Responsável e data de aprovação: pendentes.
- Canal inicial: navegador / PWA no subdomínio gratuito do hospedeiro estático; nativo adiado.
- Dependências: contas Cloudflare, Convex Free e Google OAuth; portões R1/R2 da 004; conteúdo revisado.
- Critério de liberação: URL HTTPS com OAuth verificado em dispositivos reais, sem fixtures, cotas Free confirmadas e convite limitado registrado.
- Decisões já registradas nesta conversa (03/10/2026): provedores Pages + Convex; um só ambiente; contas ainda inexistentes — criação fará parte da execução guiada do plano.

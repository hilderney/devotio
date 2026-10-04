# Spec: Fundação do lançamento web

**ID:** 004-fundacao-lancamento  
**Status:** implementação autorizada pelo pedido do usuário de 02/10/2026; publicação depende dos portões operacionais  
**Versão alvo:** piloto v1 na web  
**Criada:** 02/10/2026  
**Relacionadas:** specs 001 e 002; não substitui seus contratos.

## 1. Contexto e problema

O protótipo demonstra leitura e comunidade, mas ainda não permite uma operação real com identidade, publicação confiável e distribuição inicial. Precisamos disponibilizar o app no celular sem cobrança ao leitor e com custo inicial de serviços zero, dentro de limites mensurados.

## 2. Papéis envolvidos

- Leitor/membro: acessa o conteúdo e usa as funções da comunidade conforme associação.
- AG: administra somente suas comunidades, sem privilégio editorial global automático.
- Editorial: aprova textos e gravações que serão publicados para os leitores.
- Operador: configura distribuição e publica material aprovado por processo restrito.
- Responsável pelo produto: decide canal, público, direitos de uso e limites do piloto.

## 3. Histórias de usuário

- Como leitor, quero acessar o app no meu celular e voltar facilmente ao devocional.
- Como membro, quero que minha conta e meus dados não sejam confundidos com os de outra pessoa.
- Como editorial, quero publicar conteúdo revisado e corrigir erros sem expor rascunhos.
- Como operador, quero acompanhar consumo e recuperar uma publicação com falha sem custos inesperados.

## 4. Requisitos funcionais propostos

1. Permitir acesso pelo navegador no celular e desktop, com instalação opcional na tela inicial quando suportada; instalar não é obrigatório para ler.
2. Autenticar antes de ler, preservando spec 001. Proposta inicial: conta Google, sem senha própria. Cancelamento, falha e expiração devem permitir recuperação clara.
3. Criar/vincular uma única conta de produto por identidade autenticada; retornar ao destino após login. Criar comunidade não concede papel editorial.
4. Logout/troca de conta removem dados apresentados da sessão anterior. Membro removido perde acesso ao grupo nas leituras e escritas seguintes.
5. Publicação exige responsável humano, referência/tradução conferidas e registro de licença. Manter rascunhos fora do alcance do leitor.
6. Definir uma política explícita para conteúdo futuro e data de liberação. Data local de leitura da spec 001 permanece; pedir uma data arbitrária não pode contornar a política.
7. Garantir apenas uma publicação por data e um conjunto vigente de temas. Repetir a operação de publicação não duplica o conteúdo.
8. Permitir correção/retirada por operação restrita, com registro mínimo de quem, quando e motivo. Não exige painel editorial completo.
9. Oferecer privacidade, ajuda e contato de atendimento; estabelecer processo para solicitações de dados/exclusão.
10. Sem conexão, explicar a necessidade de internet. O piloto não oferece leitura offline de conteúdo autenticado nem sincronização de escrita offline.
11. Instalação/atualização não podem mostrar conteúdo de outra conta. Atualização deve preservar a leitura em andamento até uma retomada segura.

## 5. Requisitos não funcionais

- Custo de serviços alvo zero com cotas acompanhadas; não ativar excedentes pagos automaticamente.
- Texto e tarefas essenciais independem de áudio; instalação e reprodução em segundo plano variam por navegador.
- Interface conforme guia visual e acessível a teclado, leitor de tela, zoom e telas pequenas.
- Nenhum dado de demonstração ou privilégio de desenvolvimento acessível na publicação real.
- Recuperação de versão e restauração de dados ensaiadas antes do piloto.
- Funcionalidade web e distribuição nativa em etapas diferentes, documentadas; não há entrega Expo nesta spec.

## 6. Visibilidade e permissão

| Papel | Pode ver | Pode criar/publicar | Pode corrigir/remover |
|---|---|---|---|
| Visitante | Acesso, ajuda e aviso de privacidade | Não | Não |
| Usuário autenticado | Conteúdo publicado conforme política; comunidade apenas se associado | Ações já permitidas por 002 | Próprios dados conforme processo definido |
| AG | Mesmo escopo do usuário, mais gestão de seu grupo | Ações de comunidade de 002 | Dentro do próprio grupo; sem privilégio global |
| Editorial/operador autorizado | Material editorial sob responsabilidade | Publicação aprovada pelo processo interno | Correções/retiradas editoriais registradas |

O operador técnico pode ter acesso administrativo ao banco; restringir esse acesso e não confundi-lo com capacidade oferecida a líderes na interface. Não alterar `bibleMarkings.visibility` nem liberar progresso nominal.

## 7. Fora de escopo

Aplicativos de loja, leitura pública sem conta, novos provedores de login, e-mail/SMS, push, leitura offline privada, Bíblia completa, painel editorial completo, cobrança e geração automática de reflexões/áudio.

## 8. Dados envolvidos

Contas, devocionais, temas, associações e arquivos de áudio existentes. Será necessário registrar responsabilidade/licença e histórico operacional de correções; o plano posterior decidirá onde, quais campos/índices e como migrar. Não há alteração de schema nesta revisão.

## 9. Decisões para aprovação

1. Confirmar navegador instalável como canal inicial e Google como único acesso; validar inclusão do público.
2. Nomear responsáveis e definir público/faixa etária, retenção e exclusão.
3. Selecionar tradução/edição e documentar direitos de texto e gravação.
4. Definir publicação futura: liberação por data local permitida ou por instante editorial comum? Explicitar efeito para leitores em outros fusos.
5. Confirmar operação interna inicial e política de correção/retirada, sem painel completo.
6. Resolver conflitos da spec 002 sobre exclusão de mensagens, convite e retenção quando houver pedido de exclusão de conta.

## 10. Escopo autorizado em 02/10/2026

O usuário solicitou iniciar uma aplicação nova seguindo a documentação, primeiro
na web. Essa solicitação autoriza a reconstrução, o plano e as tasks desta etapa.
Mantêm-se as recomendações: SPA/PWA, Google, duas áreas principais e operação
editorial interna. Nenhuma conta paga ou publicação externa é autorizada por isso.

Decisões de implementação: instante editorial explícito determina liberação;
data local seleciona a leitura, mas nunca ultrapassa publishedAt. Mensagens do
mural não têm edição/remoção na v1. Convites por código; ticks recebem estado
desejado para serem idempotentes. Credenciais, tradução autorizada, política de
privacidade definitiva e responsáveis continuam pendências para publicar.

A prévia local usa conteúdo ilustrativo identificado e dados efêmeros, isolados
do backend e excluídos do build de produção. Não é uma publicação pastoral nem
autenticação real. Não há persistência local de dados privados. Sem configuração
de produção, a interface apresenta indisponibilidade de acesso em vez de fingir login.

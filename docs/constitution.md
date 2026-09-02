# Constituição do Projeto

> Baseado no modelo de "constitution" do Spec-Driven Development: princípios que
> qualquer spec, plano ou linha de código deve respeitar. Mudar algo aqui exige
> decisão consciente e registro em `docs/adr/` — não é para ser editado de passagem.

## I. Minimalismo é lei, não estética

A tela principal existe para uma coisa: colocar a Palavra na frente do usuário sem
fricção. Toda proposta de feature deve responder: **"isso adiciona ruído entre o
usuário e o texto?"** Se sim, ela vai para uma aba secundária ou é descartada.
Carrosséis, badges, contadores de sequência (streaks) e notificações não-essenciais
estão fora por padrão em qualquer versão.

## II. Reverência acima de engajamento

Não otimizamos para tempo de tela, DAU ou retenção via mecanismos comportamentais
(gamificação, urgência artificial, notificações de FOMO). O sucesso do produto é
medido por profundidade de uso espiritual, não por métricas de engajamento de
growth hacking. Isso é uma restrição de produto que qualquer agente de IA deve
respeitar mesmo sem ser lembrado a cada spec.

## III. Núcleo agnóstico, casca específica

Toda regra de negócio, todo schema, toda validação e toda checagem de permissão
vivem em `packages/backend` (Convex) e `packages/domain` — código que não sabe se
está rodando em navegador ou em app nativo. `apps/web` e `apps/mobile` só decidem
**como mostrar**, nunca **o que é permitido**. Isso é o que torna o produto
sustentável para uma equipe pequena manter duas plataformas.

## IV. Supervisão pastoral por padrão

O app modela uma hierarquia real (AG → AC → membro) e essa hierarquia é uma
característica de produto, não um detalhe técnico. Qualquer feature nova que
envolva visibilidade de conteúdo entre usuários deve definir explicitamente, na
spec, quem pode ver o quê — a resposta padrão quando não especificado é **privado**.

## V. Privacidade e discrição

Comentários bíblicos, orações e progresso de leitura são privados até que o próprio
usuário (ou o AG/AC dentro do seu escopo de autoridade) decida liberar. Nunca
inferir consentimento de compartilhamento a partir de uma ação não relacionada.

## VI. Cada feature nasce como spec

Nenhum código de produto é escrito sem uma spec aprovada em `/specs`. A spec vem
antes do plano técnico, o plano vem antes das tasks, as tasks vêm antes do código.
Pular etapa é a causa mais comum de retrabalho neste tipo de projeto pastoral, onde
decisões de visibilidade/permissão erradas têm custo de confiança, não só técnico.

## VII. Sobriedade teológica no tom, neutralidade no código

O conteúdo (reflexões, comentários, citações históricas) é editorial e pastoral,
com um `publishedBy` humano responsável. O código nunca toma decisão teológica por
conta própria (ex: gerar reflexão automaticamente sem revisão humana) — geração
assistida por IA de conteúdo devocional, se algum dia existir, é sempre rascunho
para revisão do AG, nunca publicação direta.

## VIII. MVP é um compromisso, não uma limitação técnica

A v1 entrega apenas Aba Devocional + Aba Comunidade (funções base). Clubes e Fé
Madura são v2/v3 **por decisão de produto**, não porque sejam tecnicamente mais
difíceis. Um agente não deve "adiantar" código de v2/v3 dentro de uma task de v1
sem uma spec correspondente já aprovada.

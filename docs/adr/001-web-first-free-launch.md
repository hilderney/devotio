# ADR 001 — Web primeiro e stack do piloto gratuito

**Data:** 02/10/2026  
**Status:** direção recomendada nesta revisão; requisitos novos aguardam aprovação da spec 004.  
**Motivação:** publicação inicial gratuita, stack definida e experiência minimalista.

## Contexto

O repositório executa React + Vite em SPA. TanStack Router está declarado, mas a navegação usa estado local. Não há TanStack Start, SSR ou workspace mobile executável. Manter duas interfaces antes de validar leitura e comunidade aumenta o trabalho e introduz distribuição paga em lojas.

## Direção

- Publicar primeiro a web responsiva e prepará-la para instalação como PWA.
- Manter React, Vite, Tailwind 3, tokens Lora/Inter e componentes pequenos; integrar TanStack Router para URLs reais. Não migrar para Start/SSR no piloto.
- Usar Cloudflare Pages Free para arquivos estáticos e Convex Free para backend.
- Adotar Better Auth com o componente oficial `@convex-dev/better-auth`; propor Google como único login inicial na spec 004, sujeito a validação com o público.
- Começar sem áudio ou com poucas gravações no storage do Convex, conforme orçamento. R2 fica para uma decisão posterior de escala.
- Preservar backend/domain comuns. Expo + Expo Router + NativeWind + expo-audio é a direção nativa futura, sem fixar SDK antes de iniciar o app.

## Alternativas consideradas

| Alternativa | Motivo de não ser a primeira etapa |
|---|---|
| TanStack Start / SSR | Produto autenticado atual não requer indexação do conteúdo; adiciona runtime e migração |
| Expo e lojas desde o início | Outra UI, validação física e taxas de distribuição |
| Trocar Convex | Descarta a base sem resolver primeiro integração e autorização |
| R2 desde o início | Mais um serviço, operações cobradas além da franquia e configuração de entrega |
| Senha ou link por e-mail | Exige recuperação/verificação e operação de entrega ainda ausente |

## Consequências

Instalação e áudio estarão sujeitos ao navegador, sem promessa de equivalência nativa em segundo plano. Não oferecer conteúdo offline privado no piloto. Google como único provedor pode excluir participantes: validar antes de implementar.

Nenhum princípio da constituição é alterado: Devocional + Comunidade seguem na v1; permissões continuam no servidor; privacidade e supervisão pastoral permanecem. A diferença de cronograma entre web e nativo fica explícita neste ADR e nas tasks.

Reavaliar nativo quando houver necessidade demonstrada de recurso nativo, manutenção sustentável e orçamento para lojas. Mudança de provedor deve registrar migração, exportação e impacto financeiro.

Fontes: [custos](../operations/free-launch.md) e [compatibilidade da stack](../engineering/stack.md).

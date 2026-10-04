# AGENTS.md — apps/mobile

Estende [regras gerais](../../AGENTS.md) e [arquitetura](../../docs/architecture.md).

## Situação

Diretório reservado, sem package.json ou app executável. A proposta do piloto
atende celulares pela web; Expo fica para etapa posterior da
[ADR 001](../../docs/adr/001-web-first-free-launch.md). Tasks nativas continuam abertas.

## Direção quando o app for iniciado

- Expo + Expo Router + NativeWind; escolher versões compatíveis no plano da feature.
- Mesmas regras/validações/contratos de backend e domain; nenhuma autorização apenas no client.
- Componentes nativos próprios, consumindo tokens ui-kit; não compartilhar DOM.
- Usar expo-audio, com configuração de background e controles de mídia conforme
  documentação do SDK escolhido. Testar em iOS/Android físicos antes de concluir.
- Validar integração Better Auth/Expo e armazenamento seguro de credenciais;
  não armazenar tokens sensíveis em AsyncStorage sem proteção.
- Offline e push exigem spec própria; não presumir que a distribuição nativa os inclui.
- Antes de lojas, validar orçamento, requisitos de publicação, privacidade e
  ausência de features futuras expostas.

Não há comandos npm de mobile disponíveis hoje. Documentá-los quando o workspace
for criado e verificado.

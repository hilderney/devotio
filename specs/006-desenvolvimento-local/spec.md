# Spec: Produto local completo

**ID:** 006-desenvolvimento-local
**Status:** implementação autorizada pelo usuário em 04/10/2026: “pode implementar… perfis de acesso, login mockado e banco local”, delegando as decisões restantes à documentação.
**Versão alvo:** web de desenvolvimento; publicação e Expo adiados.

## Contexto e requisitos

Substituir a prévia efêmera por um ambiente de desenvolvimento persistente para
Devocional, Bíblia e Comunidades. O ambiente deve funcionar sem contas em serviços
externos depois da preparação dos dados bíblicos.

1. Login simulado explícito: escolher liderança (AG), membro, leitor sem grupo ou
   editorial. A sessão é validada no servidor e pode ser encerrada; recarregar não
   perde a conta nem o conteúdo. AC/clube continua fora de escopo da 002.
2. Três abas principais, Devocional como entrada, Bíblia e Comunidades. Preservar
   o visual de papel/tinta, navegação responsiva, teclado e estados de erro/vazio.
3. Devocionais: oito datas, favoritos privados como snapshots no banco e espelho
   JSON no navegador. Servidor calcula hoje no fuso informado e validado, sem
   confiar em um “hoje” arbitrário. Snapshot existente não muda ao repetir favorito.
   Desfavoritar e favoritar novamente captura o texto então disponível.
4. Favoritos offline somente da sessão já aberta; reabertura exige sessão validada.
   Limpar espelho no logout/troca/expiração. Sem escritas offline. Sem limite de
   favoritos no desenvolvimento; dimensionamento público adiado.
5. Bíblia completa AA da ABíbliaDigital importada, livros/capítulos/versículos,
   busca por palavras e links diretos. Leitura sem dependência de API externa.
   Importação manual, idempotente e atômica; nunca substituir AA por outra edição.
6. Comunidades: criação, convite confirmado, mural da liderança, escritura,
   listas, marcações próprias, membros e remoção; proteção do último administrador.
   Isolar comunidades em todas as operações; contagem só de participantes atuais.
7. Ferramenta editorial local mínima para publicar/corrigir/retirar devocionais,
   com auditoria e campos de revisão, motivo e licença. Somente perfil editorial;
   AG não recebe esse poder. Textos de seed são explicitamente ilustrativos.
8. Dados preservados após recarga e reinício do servidor. Login simulado e banco
   local jamais entram no build público ou no backend Convex de produção.

## Revisão autorizada em 05/10/2026 — leitura local e tráfego

Pedido explícito do usuário: eliminar consultas constantes, guardar oito dias de
devocionais e os seis capítulos mais recentemente acessados, mantendo o login.

- Baixar os oito dias em um lote inicial e persistir neste dispositivo. Na troca
  do dia, acrescentar apenas datas ausentes e descartar as que saíram da janela.
  Reabrir a página no mesmo dia reutiliza os textos; dias sem publicação também
  são lembrados, sem tentativas contínuas.
- Capítulos AA sob demanda, com seis posições persistentes por conta. Uma visita
  promove o capítulo ao mais recente (LRU); o sétimo remove o menos recentemente
  acessado. O catálogo também fica salvo. Não antecipar capítulos não solicitados.
- Nenhum polling HTTP de sessão, devocional, Bíblia ou comunidades. Consultas
  simultâneas iguais são compartilhadas. Alterações invalidam somente seus dados.
- Sessão persistente por 30 dias, revogável no logout; validar uma vez ao abrir e
  nas operações reais. Logout, troca ou expiração limpam dados da conta. Reabrir
  ainda requer servidor para validar a sessão; sessão aberta lê cache sem rede.
- Comunidades não ficam no armazenamento persistente: consultar ao entrar e após
  ações pertinentes. Oferecer atualização manual para novidades de outras pessoas.
- Correções/retiradas editoriais invalidam o texto afetado na sessão que as fez;
  outros dispositivos recebem pela atualização manual. Atualização automática
  diária transfere somente novas datas, não garante correções de datas antigas.
  Favoritos continuam snapshots independentes.
- O armazenamento indisponível não impede leitura online: usar memória e avisar.
  Mobile e política do ambiente público continuam adiados.

## Visibilidade e permissões (mantidas)

| Perfil | Leitura | Escrita |
|---|---|---|
| Visitante | Acesso/ajuda e lista de perfis fictícios | Escolher perfil local |
| Leitor/membro | Bíblia, devocionais e seus favoritos; grupos associados | Próprios favoritos/ticks; criar/entrar em grupo |
| AG | Mesmo acesso + gestão dos seus grupos | Mural, listas, escritura e remoção dos próprios grupos |
| Editorial | Mesmo acesso de leitor + ferramenta editorial local | Publicar/corrigir/retirar com auditoria |

Qualquer pessoa com acesso à máquina pode escolher os perfis fictícios. Isso é
simulação de identidade, não autenticação segura para publicação. As permissões
de cada sessão continuam sendo verificadas no servidor, não só ocultadas na UI.

## Fora de escopo

Produção, Google real, lojas, clubes/AC, chat, anotações bíblicas, notificações,
áudio gerado, CMS completo e garantia de direitos de redistribuição pública.
Importação AA autorizada para avaliação local pelo pedido atual; registrar fonte
e hash, mantendo verificação editorial/licença pública como portão posterior.

## Dados e aceite

Contas/sessões fictícias, comunidades/associações/mural/listas/ticks, devocionais,
auditoria, favoritos, livros e versículos AA. Testar persistência, rejeição de
acesso entre perfis, janela, snapshots, revogação e integridade da importação.
Não exigir aprovação adicional de escolhas rotineiras: usuário delegou essas
decisões explicitamente. Diferenças de implementação estão no plano.

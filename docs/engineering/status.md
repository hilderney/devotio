# Estado real do projeto

## Correção da entrada travada — verificação de 06/10/2026

Reproduzido travamento ao abrir `/` como visitante: a rota raiz decidia acesso
pela localização ainda em transição e redirecionava repetidamente, impedindo a
tela pública de concluir sua apresentação. API de sessão respondeu normalmente.

Rotas públicas agora renderizam sob a raiz; Devocional, Bíblia, Comunidades e
Editorial compartilham um layout de leitura separado. Redirecionamentos usam
efeito com destino estável e preservam a rota protegida apresentada. Cada montagem
da aplicação mantém sua instância do roteador, reutilizando o histórico do navegador.

**Checks:** 85 testes passaram (60 domain + 19 backend + 6 web), sem skips.
Os novos testes integrados usam React StrictMode, jsdom e HTTP simulado: visitante
na raiz, sessão existente, login/logout, falha de conexão, retorno à rota pedida
e navegação entre as três áreas. Lint/typecheck e `verify:web` passaram. O teste
HTTP real da suíte precisou executar fora da restrição de rede do sandbox após
`EACCES` ao conectar a loopback; passou na execução autorizada.

Não houve nova inspeção visual no Chrome. Esta rodada comprova o fluxo integrado
em DOM simulado e a compilação, preservando a pendência de revisão visual física.

## Cache local e tráfego — verificação de 05/10/2026

Revisão da spec 006 implementada a pedido do usuário. Removidos polling de sessão
a cada 3 segundos, polling de cada leitura a cada 5 segundos e invalidação global
após qualquer mutation. O modo Convex/publicação continua fora desta entrega.

- Devocionais: um lote inicial de oito datas, cache persistente por conta e carga
  somente das datas ausentes ao mudar o dia. Recarregar reutiliza os textos.
- Bíblia: catálogo persistente e seis capítulos LRU, carregados sob demanda.
- Sessão: token opaco HttpOnly por 30 dias, bootstrap deduplicado, expiração por
  relógio local e eventos de storage para logout/troca entre abas. Sem polling.
- Favoritos e comunidades: invalidação direcionada após escrita. Comunidades
  atualizam ao entrar e manualmente, sem persistir dados de grupo no navegador.
- Menu da conta: atualização manual de conteúdo e correções editoriais. Cache
  permanece legível se uma tentativa de atualização falhar por falta de rede.

**Evidências:** 79 testes passaram (60 domain + 19 backend), sem skips. Os 18
testes do adaptador cobrem orçamento de rede, 10 minutos simulados sem consultas,
recarga, diferença diária, ausência de vários dias, LRU, deduplicação, invalidação,
expiração, armazenamento cheio e respostas em voo durante logout/virada do dia.
Lint/typecheck do monorepo, build/PWA, `verify:web` e `verify:local` passaram.
Verificação HTTP inclui o lote real de oito datas e cookie de 30 dias.

**Limites:** as medições de chamadas são testes automatizados do adaptador, não
uma captura do DevTools. Revisão visual continua pendente pelo bloqueio anterior
da ferramenta. Correções em outras sessões exigem atualização manual; não há
sincronização comunitária em tempo real. Reabrir exige validação da sessão no
servidor. Cache bíblico corresponde ao corpus AA fixado; futuras atualizações do
corpus precisam versionar/inutilizar esse cache. O aviso de chunk JS acima de
500 kB permanece (533,35 kB minificado nesta rodada).

## Produto local — verificação de 04/10/2026

Implementado conforme [spec 006](../../specs/006-desenvolvimento-local/spec.md).
Use o [guia local](local-development.md) para executar e testar os perfis.

| Área | Evidência atual |
|---|---|
| Identidade | Quatro perfis fictícios, cookie HttpOnly, expiração/logout e vínculo de conta nas requisições |
| Persistência | SQLite em `.data/devotio.sqlite`; teste fecha/reabre banco e confirma favoritos/retirada preservados |
| Devocional | Oito datas calculadas no servidor por fuso validado; favoritos privados e snapshots imutáveis |
| Espelho local | JSON no navegador, limpeza de sessão e rejeição de respostas em voo após logout testadas |
| Bíblia AA | 66 livros, 1.189 capítulos, 31.104 versículos; importação idempotente e rollback integral testados |
| Busca | FTS5, acentos normalizados e páginas de 40 resultados; dez referências comparadas com API oficial |
| Comunidades | Permissões por grupo, convites, mural por cursor, listas/ticks e proteção do último admin |
| Editorial local | Perfil separado publica/corrige/retira; auditoria no banco e sem atualizar favoritos existentes |
| Web | Três abas, perfis, favoritos, Bíblia e editorial compilados; revisão visual desta rodada pendente |

**Checks:** 63 testes passaram (45 domain + 18 backend), incluindo os dois testes
do corpus AA real, sem skips nesta máquina. Typecheck/lint do monorepo e build/PWA
passaram. `verify:web` confirmou ausência de fixtures, endpoints e adaptador mock
nos assets públicos. `verify:local` confirmou login, leitura, busca, permissões e
resposta 403 para tentativa de servir o arquivo SQLite pelo Vite.

**Limites:** a ferramenta de navegador rejeitou o controle da página local por
política de URL/protocolo; não houve inspeção visual nova em desktop/celular.
Build avisa sobre um chunk JS acima de 500 kB e comentários de dependência
ignorados pelo Rollup; não são erros de compilação. Google real, migração destas
novas capacidades para Convex, publicação e mobile continuam pendentes.

## Evidências anteriores — base Convex e prévia efêmera

**Verificação local: 03/10/2026.** Nova base web implementada a partir da spec 004. Nenhuma implantação externa, migração de banco ou publicação editorial foi realizada.

| Área | Implementado | Limite de verificação |
|---|---|---|
| Web | React/Vite, rotas reais, leitura, mural, listas, membros, conta e ajuda | Navegador local; Expo adiado |
| Design | Papel e tinta, Lora/Inter locais, leitura estreita, navegação responsiva | Conferido em 390px e 1440px; auditoria AA completa pendente |
| Domain | Contratos, Zod, regras, hooks e adaptadores separados | Prévia efêmera só em DEV |
| Backend | Builders oficiais, schema tipado, identidade e autorização por grupo | Testado com convex-test; deployment não configurado |
| Auth | Better Auth/Google, CORS e provider | OAuth real depende das credenciais e origens |
| Editorial | Revisão/licença obrigatórias, upsert por data, auditoria e retirada | Conteúdo humano autorizado ainda necessário |
| Agendamento | publishedAt como barreira e scheduler para atualizar subscriptions | Relógio controlado nos testes |
| Comunidade | Convites transacionais, mural por cursor e ticks idempotentes | Contagens excluem removidos; sem edição/exclusão de mural |
| PWA | Manifest, ícones, precache estático e atualização opcional | Instalação, atualização e offline em aparelhos reais pendentes |

## Evidências

- Lint e typecheck passaram nos quatro workspaces.
- 45 testes passaram: 38 de domínio (regras, acesso, ambiente, sessão e data) e 7 de backend (autorização, isolamento, ticks, paginação e publicação).
- Build web/PWA passou. O caminho conectado também compilou com URLs de verificação, sem acessar esses serviços.
- Navegador: rotas, criação de comunidade, mural local e marcação pessoal verificados. Nenhum erro de console observado nesses fluxos.
- A prévia não persiste alterações após recarga. Nenhuma mensagem foi enviada a pessoas reais.
- Continuação: login preserva destino interno validado; erros OAuth e logout têm recuperação. Configuração parcial não ativa fixtures. Offline aparece antes da espera pela sessão.
- npm run verify:web verifica manifest, dimensões dos ícones, licenças, ausência de fixtures e registros de cache do service worker gerado. É inspeção automatizada do artefato; não substitui instalação física.
- Nesta continuação, a ferramenta bloqueou o controle do navegador por política de URL/protocolo. Os checks de 390px/1440px acima pertencem à rodada anterior; o novo fluxo OAuth ainda requer homologação.

## Antes do piloto

1. Configurar Convex e Google OAuth; verificar sessão, login/logout, revogação e origens.
2. Aprovar edição bíblica, textos, áudio, política definitiva e responsáveis.
3. Testar instalação/atualização/offline em Android/iOS, áudio real, múltiplas sessões e restauração.
4. Acompanhar cotas gratuitas; listas e membros ainda carregam o grupo inteiro, adequado apenas ao piloto pequeno.
5. Completar o [checklist de release](../operations/release.md).

Código anterior preservado no Git e em .legacy local ignorado. Nenhum banco externo foi alterado. Veja as [tasks](../../specs/004-fundacao-lancamento/tasks.md).

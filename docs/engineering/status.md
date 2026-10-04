# Estado real do projeto

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

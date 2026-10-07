# Plano técnico — desenvolvimento local

1. Adaptador HTTP de desenvolvimento implementa os contratos Repository/domain.
   SQLite via node:sqlite (Node 24), em `.data/devotio.sqlite`, com transações,
   prepared statements e constraints. Servidor em packages/backend/local,
   montado pelo Vite apenas em serve/development e sem configuração Convex.
   Produção continua Convex/Better Auth, sem rotas de mock ou banco embarcado.
2. Cookie HttpOnly/SameSite=Strict, sessão opaca aleatória com expiração e
   revogação. Restringir servidor a loopback e validar Host/Origin em mutações.
   Nunca aceitar identidade/papel nos argumentos das operações de produto.
3. Reusar Zod/regras do domain. Novo contrato de leitura estendido é opcional
   no Repository para não simular capacidades ainda ausentes em produção.
4. Importar o arquivo AA versionado do repositório oficial do mesmo provedor,
   validando 66 livros, capítulos, versículos e metadados. Fonte, commit e SHA256
   registrados no banco. Esta otimização evita milhares de chamadas por capítulo;
   não muda a escolha do provedor nem a leitura a partir de cópia própria.
5. Favoritos: chave única usuário/data; snapshot JSON imutável até remoção;
   cache persistente por conta no navegador via adaptador de storage, atualizado com
   respostas do servidor. Mudanças de conta invalidam assinaturas pendentes.
6. Sem polling HTTP. Cache versionado por conta via adaptador de localStorage,
   validado com Zod no domain. Lote de até oito datas validado no backend; diferença
   da janela calculada no domain. Relógio local detecta mudança de dia sem rede.
   Catálogo e LRU de seis capítulos persistentes; deduplicação de assinaturas.
   Invalidação por área após mutation; comunidades somente em memória enquanto
   observadas, atualização manual explícita. Busca sob demanda e FTS5 paginado.
7. Web: seleção de perfil, três abas, oito datas/favoritos, livro/capítulo/busca,
   referência por URL, ferramenta editorial DEV e fluxos comunitários existentes.
8. Testes de domínio e integração SQLite/HTTP, lint/typecheck/build/verify:web,
   verificação de servidor e interface. Mobile adiado, sem tasks nativas concluídas.

Este plano complementa 001–004 somente no ambiente local. Migração das novas
capacidades para Convex será tratada antes da publicação, sem apresentar a base
de desenvolvimento como backend público homologado.

Revisão de 05/10: manter o token opaco aleatório em cookie HttpOnly/SameSite,
estender a expiração para 30 dias e expor o vencimento para encerrar a apresentação
local sem polling. JWT não é necessário para persistir a sessão. Eventos de
storage propagam troca/logout entre abas; requisições continuam vinculadas ao
perfil esperado. Cache permanece após desmontagem/reload; limpeza somente em
fronteiras de identidade. Service worker continua guardando somente arquivos.

Correção de 06/10: reproduzir o travamento de entrada com teste integrado web
(LocalApp + roteador + bootstrap HTTP em StrictMode), cobrindo abertura pela raiz,
sessão existente, seleção de perfil e falha de conexão. Corrigir a transição que
mantém o carregamento e oferecer recuperação de erros sem polling.

Implementação: raiz renderiza páginas públicas via Outlet; layout sem caminho
`_reader` agrupa rotas de produto e provider do repositório. Destino de retorno
vem do match apresentado, não da localização anterior à conclusão da navegação.
Redirecionamentos usam efeito com dependências primitivas estáveis. Roteador por
montagem do App com histórico de navegador compartilhado. Testes web em jsdom
usam o roteador real e fetch simulado; não substituem inspeção visual em aparelhos.

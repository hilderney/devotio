# Lançamento com infraestrutura gratuita

**Fontes consultadas em 02/10/2026.** Valores em USD quando aplicável; confirmar no painel da conta antes de publicar. Meta de custo: **R$ 0/mês em serviços**, enquanto o piloto permanece nas cotas. Não inclui trabalho, dispositivos ou internet.

## 1. Configuração de partida

| Necessidade | Escolha | Condição |
|---|---|---|
| Site HTTPS | Cloudflare Pages Free + subdomínio pages.dev | Apenas saída estática; sem Pages Functions no piloto |
| Banco, funções e autenticação hospedada | Convex Free | Selecionar Free; Starter inclui cobrança por uso além da franquia |
| Login | Better Auth + Google, proposta | Sem SMS/e-mail transacional; validar OAuth e público antes de implementar |
| Conteúdo | Texto revisado manualmente | Tradução e materiais precisam de direito de uso comprovado |
| Áudio opcional | Poucos arquivos no Convex | Só após medir armazenamento e egresso; sem áudio é uma versão válida |
| Monitoramento | Dashboards dos fornecedores | Revisão manual; não pressupor alertas automáticos configurados |
| Domínio | Subdomínio gratuito | Domínio próprio é custo futuro |
| Distribuição | Navegador / futura PWA | Sem contas de loja no piloto |

## 2. Cotas que orientam o orçamento

| Serviço/recurso | Referência gratuita consultada |
|---|---|
| Pages builds | 500/mês, uma execução por vez, timeout de 20 minutos |
| Pages arquivos | 20.000 por site; até 25 MiB por arquivo |
| Convex chamadas | 1 milhão/mês |
| Convex banco | 0,5 GB |
| Convex arquivos | 1 GB |
| Convex database I/O | 1 GB/mês |
| Convex saída de dados | 1 GB/mês |
| Convex actions | 20 GB-horas/mês |
| Convex busca | 0,5 GB de storage de busca; não necessário no piloto |

Fontes: [limites Pages](https://developers.cloudflare.com/pages/platform/limits/), [preços Convex](https://www.convex.dev/pricing) e [limites Convex](https://docs.convex.dev/production/state/limits). No Convex, os limites são normalmente por equipe: desenvolvimento e outros projetos podem consumir a mesma capacidade. Free tem teto rígido; Starter permite excedentes faturados. Atingir limites pode interromper operações. Não tratar “US$ 0 de base” como ausência de cobrança possível.

Os números devem ser reconferidos no plano efetivamente selecionado, incluindo regras de região e contabilização. Índices, reexecuções, autenticação e tráfego de desenvolvimento também importam; número de usuários sozinho não define custo.

## 3. Cenário de capacidade do piloto

Hipóteses internas, em unidades decimais; não são benchmark nem garantia:

| Item | Cálculo | Estimativa mensal |
|---|---|---|
| Leitura | 50 leitores × 30 dias × 2 aberturas × 20 KB de dados | 60 MB de payload |
| Chamadas base | 50 × 30 × 2 × 4 consultas | 12.000 chamadas, antes de reatividade/auth |
| Arquivo de voz | 180 s × 64 kbit/s ÷ 8 | 1,44 MB por gravação |
| Catálogo de voz | 30 gravações × 1,44 MB | 43,2 MB armazenados |
| Reprodução pequena | 10 ouvintes/dia × 30 × 1,44 MB | 432 MB transferidos |
| Reprodução ampliada | 100 ouvintes/dia × 30 × 1,44 MB | 4,32 GB: acima da franquia considerada |

Comunidade, retries, indexação, protocolo e auth não estão incluídos nesses cálculos. Medir I/O e egresso no painel; não inferir I/O a partir do tamanho do retorno. Evitar download antecipado de áudio e suspender subscriptions desnecessárias ao trocar de contexto.

Começar com 20–50 convidados e expandir somente após uma semana de uso medido. Isso é estratégia de recrutamento, não um limite de comunidades imposto silenciosamente à spec 002.

## 4. Controles de custo

Responsável de operação registra diariamente na primeira semana e semanalmente depois: plano, chamadas, I/O, banco, arquivos, egresso, builds e tendência mensal.

- **50% de qualquer cota:** revisar tendência e descobrir o principal consumidor.
- **70% ou projeção de esgotamento:** interromper expansão do piloto, reduzir payload/reexecuções e avaliar suspender novos áudios.
- **85%:** priorizar texto; retirar oferta de áudio de forma consistente com `audioUrl` opcional, avisar sobre limitação e investigar.
- **Teto atingido:** comunicar indisponibilidade, preservar dados e recuperar serviço segundo limites do provedor; não migrar automaticamente para plano pago.

São gatilhos manuais propostos, não automações já instaladas. Avisos de orçamento não são necessariamente bloqueios de cobrança. Qualquer ativação de plano faturado precisa de decisão explícita do responsável pelo projeto.

## 5. O que exige dinheiro ou outra decisão

| Opção futura | Referência | Implicação |
|---|---|---|
| App Store | US$ 99/ano como regra geral | Possível isenção para entidades elegíveis; não pressupor aprovação |
| Google Play | US$ 25 de cadastro único | Cadastro e requisitos de publicação precisam ser atendidos |
| Domínio próprio | Preço depende do registrador | Não necessário no piloto |
| R2 Standard | Franquia: 10 GB-mês, 1 milhão de operações A e 10 milhões B; egresso direto gratuito | Excedentes são cobrados; configuração de entrega e controles adicionais |
| E-mail, SMS, observabilidade externa | Serviço ainda não escolhido | Não são dependências iniciais |

Fontes: [Apple](https://developer.apple.com/support/compare-memberships/), [Google Play](https://support.google.com/googleplay/android-developer/answer/6112435), [R2](https://developers.cloudflare.com/r2/pricing/). Egresso gratuito do R2 não significa armazenamento e operações ilimitados.

PWA evita a dependência inicial das lojas. No iOS a instalação acontece pelo menu de compartilhamento; a experiência varia por navegador. Não prometer instalação automática ou comportamento nativo completo. [Instalação de PWA](https://web.dev/learn/pwa/installation/).

## 6. Registro operacional a preencher

| Data | Responsável | Plano confirmado | Cota mais usada | Projeção mensal | Decisão |
|---|---|---|---|---|---|
| Antes do piloto | A definir | A confirmar nos painéis | Ainda não medida | Ainda não medida | Sem produção publicada nesta revisão |

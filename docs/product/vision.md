# Visão e primeiro lançamento

## Promessa

**Abrir o app, encontrar a Palavra e ter espaço para responder em oração.** A beleza vem da leitura confortável, da composição e do silêncio visual. O app deve parecer um pequeno livro bem cuidado.

O público inicial são pessoas de uma comunidade cristã de língua portuguesa, incluindo leitores com pouca familiaridade digital. O piloto começa com um grupo acompanhado pela liderança, usando os próprios celulares. Faixa etária e participação de menores precisam ser definidas antes dos convites.

## Jornadas principais

1. **Leitor:** entra, encontra o devocional de hoje, lê o texto e a reflexão, ora; pode ouvir quando houver gravação.
2. **Membro:** abre Comunidade, identifica seu grupo, lê avisos e marca apenas seus próprios itens de uma lista.
3. **AG:** administra a própria comunidade, publica avisos e organiza listas. Criar um grupo não concede acesso a anotações privadas nem à publicação editorial global.
4. **Responsável editorial:** revisa o conteúdo e responde por sua publicação. No piloto pode ser a mesma pessoa da operação, com responsabilidades explícitas.

## Escopo da v1

> Atualização de 04/10/2026: o marco atual é a versão local com Devocional,
> Bíblia e Comunidades; publicação será planejada depois. Ver [ADR 002](../adr/002-local-complete-product.md).
> O recorte de lançamento abaixo é histórico e será revisto nessa etapa.

| Entra | Limite de escopo |
|---|---|
| Devocional diário | Texto bíblico curto, reflexão completa, oração e temas do mês/semana; spec 001 |
| Áudio opcional | Voz humana, sem autoplay; ausência de áudio não bloqueia publicação |
| Comunidade base | Convite, mural do AG, membros e listas; spec 002 |
| Acesso autenticado | Já exigido na spec 001; integração ainda falta |
| Operação editorial mínima | Publicação humana controlada, sem construir um CMS completo |
| Distribuição web | Navegador no celular e desktop; instalação depende da fundação PWA proposta na spec 004 |

O lançamento mantém as duas áreas da constituição. O faseamento proposto muda o canal de distribuição: a web atende celulares primeiro; Expo permanece no roteiro futuro. Isso não torna as tasks nativas concluídas.

## Fica para depois

Apps nas lojas, push, leitura offline de conteúdo autenticado, histórico navegável, Bíblia completa, clubes, diário pessoal, comentários bíblicos, IA editorial e novos provedores de login. Não exibir abas vazias ou botões “em breve”. Gamificação, rankings e sequências continuam excluídos.

## Gratuito significa

O usuário não paga para ler ou participar. O piloto busca custo de serviços de **R$ 0/mês**, condicionado às cotas, sem domínio próprio e sem publicação em lojas. Trabalho editorial, equipamentos, conexão e manutenção continuam necessários. A expansão depende de uso medido; não se promete infraestrutura gratuita ilimitada.

## Critérios de sucesso do piloto

- Cinco participantes encontram e iniciam a leitura sem orientação depois do acesso inicial.
- Cada participante identifica a comunidade aberta e entende quem vê sua marcação pessoal.
- Texto legível em celular pequeno, zoom de 200% e leitor de tela; nenhum fluxo essencial depende de áudio.
- Sete dias consecutivos de conteúdo revisado disponíveis conforme o calendário editorial, sem falhas de permissão conhecidas.
- Infraestrutura abaixo dos limites internos de atenção definidos no documento de custos.

São metas propostas, não resultados medidos. Perguntar voluntariamente sobre clareza, conforto e utilidade espiritual; não inferir profundidade espiritual por cliques, duração de sessão ou frequência de abertura.

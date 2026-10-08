# Spec: Gestão dos temas mensal e semanal

**ID:** 010-temas-mensal-semanal
**Status:** rascunho para aprovação dos requisitos
**Versão alvo:** web de desenvolvimento local, antes da publicação
**Revisão:** 08/10/2026

## 1. Contexto e problema

Os temas mensal e semanal exibidos na leitura precisam ser configuráveis pelo Gestor do sistema. A tela deve repetir a experiência simples do cadastro de devocionais: escolher a Palavra pela leitura bíblica, escrever o conteúdo editorial e voltar sem perder o preenchimento. Hoje a experiência local usa temas ilustrativos; sua presença não comprova gestão implementada.

## 2. Papéis envolvidos

- Gestor do sistema: acessar a gestão, escolher os trechos e salvar os temas.
- Gestor de comunidade, membro e leitor sem comunidade: ler os temas disponibilizados; não acessar nem alterar esta gestão.
- Não autenticado: sem acesso à gestão.

## 3. Histórias de usuário

- Como Gestor do sistema, quero escolher um trecho bíblico para o mês e outro para a semana, sem editar manualmente as escrituras.
- Como Gestor do sistema, quero escrever os temas com os limites de caracteres solicitados.
- Como Gestor do sistema, quero alternar entre formulário e Bíblia preservando texto, pesquisa, posição e seleção de cada período.
- Como leitor, quero ver os temas configurados no devocional sem consultas constantes ao servidor.

## 4. Requisitos funcionais

1. Disponibilizar uma tela de gestão dos temas, exclusiva do Gestor do sistema, com entrada na área administrativa/menu da conta. Proteger também acesso direto e gravação no servidor.
2. Manter a apresentação minimalista da tela de CRUD de devocionais: tipografia uniforme, campos rotulados e cores do tema de aparência escolhido. Reutilizar a experiência de escolha da Palavra, sem incluir Meditação ou Oração.
3. Exibir os campos:

   | Identificador existente | Rótulo | Comportamento |
   |---|---|---|
   | `monthlyVerse` | Texto Base mês | Somente leitura; preenchido pela seleção bíblica |
   | `monthlyReference` | Tema do mês | Texto editável, máximo de 256 caracteres |
   | `weeklyVerse` | Texto Base Semana | Somente leitura; preenchido pela seleção bíblica |
   | `weeklyReference` | Tema da semana | Texto editável, máximo de 512 caracteres |

4. Os campos `monthlyReference` e `weeklyReference` contêm o tema escrito pelo gestor, conforme o pedido; não devem ser substituídos automaticamente pelo endereço bíblico. Referência bíblica e nome da versão acompanham o trecho separadamente.
5. Cada Texto Base oferece pesquisa textual e ação de escolher/rever trecho na Bíblia, como Palavra no cadastro de devocionais. A pesquisa pode ser deixada em branco. Não permitir digitar ou alterar manualmente o texto bíblico.
6. Na Bíblia aberta por essa tela, a seleção não abre o menu lateral de compartilhamento. Um botão flutuante retorna à gestão e preenche apenas o período de origem com corpo numerado dos versículos, endereço e versão AA. Preservar o outro período e os temas digitados.
7. Voltar à Bíblia permite rever a seleção do período correspondente. A navegação pelo menu principal mantém o fluxo bíblico normal. Cancelar a escolha bíblica não substitui o trecho anterior.
8. Proposta para aprovação: configurar os períodos independentemente, com **Salvar** e **Cancelar**. Salvar disponibiliza a alteração imediatamente; não requer data nem cria agendamento. Alterar um período não altera o outro. A decisão sobre vigência está em §9 e bloqueia plano/código.
9. Para salvar um período, exigir Texto Base escolhido e Tema preenchido. Validar os limites também no servidor, com mensagens em português. Uma falha preserva o preenchimento e permite repetir a tentativa.
10. Cancelar descarta alterações não salvas e retorna à área de origem; não modifica temas já salvos. Ao reabrir, carregar a configuração persistida.
11. O conteúdo salvo permanece após recarga e reinício do ambiente local. A tela de leitura continua usando Texto Base e Tema nos espaços mensal e semanal existentes, sem trocar um pelo outro.
12. Não implementar Peregrino/IA nesta entrega. Auxílio do CRUD não implica incluir geração de temas nesta tela.

## 5. Requisitos não-funcionais

- Web utilizável no celular e computador, com rótulos, foco visível, navegação por teclado e mensagens de erro compreensíveis.
- Preservar janela de oito devocionais, cache de seis capítulos e seleção contextual. Sem polling, API bíblica externa ou dependência paga.
- Atualizar somente configuração e leituras afetadas após salvar; não recarregar capítulos ou comunidades.
- Escrita exige conexão com o servidor local. Não implementar gravação offline.

## 6. Regras de visibilidade/permissão

| Papel | Ler temas disponibilizados | Acessar gestão | Salvar temas |
|---|---|---|---|
| Gestor do sistema | Sim | Sim | Sim |
| Gestor de comunidade sem papel de sistema | Sim | Não | Não |
| Membro/leitor sem comunidade | Sim | Não | Não |
| Não autenticado | Conforme regras gerais de leitura | Não | Não |

Apenas a alteração confirmada passa a ser exibida aos leitores. Seleções, pesquisas e textos em preparação não são publicados por abrir a Bíblia. A autorização é obrigatória no servidor; esconder a entrada na UI não basta. O servidor resolve o texto da seleção bíblica, sem aceitar escrituras arbitrárias enviadas pelo navegador.

## 7. Fora de escopo

- Peregrino, prompts e integrações de IA.
- Gestão de temas por comunidade ou novos poderes para gestores de comunidade.
- Histórico editorial, agenda e troca automática de mês/semana, salvo escolha explícita em §9.
- Novas traduções, publicação externa, autenticação pública e aplicativo nativo.
- Redesenhar o restante do devocional, rascunhos colaborativos ou autosave.

## 8. Dados envolvidos

Reutilizar os identificadores existentes de `globalSettings`: `monthlyVerse`, `monthlyReference`, `weeklyVerse`, `weeklyReference`. Registrar separadamente a seleção de cada período e seus metadados de referência/versão, para rever o trecho na Bíblia. A persistência local desses temas ainda precisa ser implementada; o desenho de dados e alterações necessárias serão definidos no plano após aprovação. Não há migração ou tabela nova autorizada por este rascunho.

## 9. Perguntas em aberto

**Vigência das alterações**, necessária antes do plano:

1. **Salvar imediatamente (recomendado):** configurar os temas atuais, sem agenda; fluxo mínimo com Salvar/Cancelar e períodos independentes.
2. **Programar por data/período:** escolher vigência do mês/semana e ativar automaticamente, aproximando também o agendamento do CRUD de devocionais. Exige definir início da semana e tratamento de períodos ocupados.
3. **Salvar e programar:** oferecer as duas operações; aumenta a tela e as regras necessárias.

Os demais pontos são propostas explícitas deste rascunho para aprovação, não decisões previamente atribuídas ao usuário.

## 10. Aprovação e lançamento

- Responsável/data de aprovação: pendentes; usuário solicitou a feature em 08/10/2026, mas ainda não aprovou este rascunho nem a vigência.
- Canal inicial: web local. Mobile adiado, sem tasks nativas concluídas.
- Liberação: requisitos aprovados, plano/tasks, autorização verificada no servidor, testes dos limites e seleção, persistência, lint/typecheck/build e homologação visual.
- Conteúdo editorial humano; AA e referências seguem as condições de uso já documentadas. Não autoriza distribuição pública do corpus.
- Próximo passo: aprovação da spec e escolha da vigência; depois plano/tasks/código conforme AGENTS.md.

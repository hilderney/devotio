# Plano: versões da Bíblia

Spec aprovada em 09/10/2026. Implementação diretamente na `main`.

## Backend/domain

Corpus público estático separado de contas/comunidades: script determinístico valida
o JSON com Zod compartilhado, fixa SHA256 e gera catálogo, 1 JSON por capítulo e
índice textual para busca sob demanda, em caminho que contém o hash. Nada de tabelas
novas no Convex, downloads externos ou alteração de usuários. O build gera o pacote.

Contrato `BibleRepository` separado das funções privadas de favoritos/editorial de
`ReadingRepository`. Adaptador compartilhado combina AA local existente e ALM1911
estática. Validação compartilhada de versão, capítulo/catálogo e preferência. Cache
de seis capítulos por instância/perfil, deduplicação, proteção contra respostas
após unsubscribe e descarte do corpus de busca ao terminar a busca. Fonte integral
fica fora do JavaScript inicial e do precache PWA. Busca por palavras normalizadas,
prefixos, página de 40 resultados; índice só carregado ao pesquisar.

Backend SQLite local reconstrói citações ALM1911 a partir do mesmo arquivo validado;
não aceita texto do cliente e preserva os fluxos AA. Nenhuma migração de schema.

## Web

Configurações lista versões realmente oferecidas pelo adaptador. Preferências antigas
recebem padrão compatível. Troca mantém endereço atual, limpa seleção, resultados
antigos e retenção de capítulos, reconsulta o termo com página zero. Novo rótulo e
cópia identificam a edição; snapshots antigos intactos. Links para citações levam
a versão. Build da web conectada oferece ALM1911 via adaptador de Bíblia separado,
preservando funções Convex de produto. Cache do navegador contém somente capítulos
públicos, separado de preferências e dados privados.

## Mobile

Contratos e regras compartilhados; Expo adiado, sem implementação/aceite nativo.

## Verificação e operação

Testar corpus real, edições/cópias, cache/deduplicação/erros, compatibilidade das
preferências, troca de versão e busca. Executar lint/typecheck/testes e verify:web;
inspecionar assets e conferir que nenhum JSON bíblico entra no precache. Publicar
o build no Worker existente após os checks e verificar capítulo e catálogo públicos.
Nenhum deploy de backend Convex é necessário.

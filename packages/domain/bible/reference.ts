/**
 * Mapeamento canônico de abreviações bíblicas em português para os nomes oficiais dos livros.
 */
export const BIBLE_BOOK_NAMES: Record<string, string> = {
  gn: "Gênesis",
  ex: "Êxodo",
  lv: "Levítico",
  nm: "Números",
  dt: "Deuteronômio",
  js: "Josué",
  jz: "Juízes",
  rt: "Rute",
  "1sm": "1 Samuel",
  "2sm": "2 Samuel",
  "1rs": "1 Reis",
  "2rs": "2 Reis",
  "1cr": "1 Crônicas",
  "2cr": "2 Crônicas",
  ed: "Esdras",
  ne: "Neemias",
  et: "Ester",
  job: "Jó",
  sl: "Salmos",
  pv: "Provérbios",
  ec: "Eclesiastes",
  ct: "Cânticos",
  is: "Isaías",
  jr: "Jeremias",
  lm: "Lamentações",
  ez: "Ezequiel",
  dn: "Daniel",
  os: "Oséias",
  jl: "Joel",
  am: "Amós",
  ob: "Obadias",
  jn: "Jonas",
  mq: "Miquéias",
  na: "Naum",
  hc: "Habacuque",
  sf: "Sofonias",
  ag: "Ageu",
  zc: "Zacarias",
  ml: "Malaquias",
  mt: "Mateus",
  mc: "Marcos",
  lc: "Lucas",
  jo: "João",
  at: "Atos",
  rm: "Romanos",
  "1co": "1 Coríntios",
  "2co": "2 Coríntios",
  gl: "Gálatas",
  ef: "Efésios",
  fp: "Filipenses",
  cl: "Colossenses",
  "1ts": "1 Tessalonicenses",
  "2ts": "2 Tessalonicenses",
  "1tm": "1 Timóteo",
  "2tm": "2 Timóteo",
  tt: "Tito",
  fm: "Filemom",
  hb: "Hebreus",
  tg: "Tiago",
  "1pe": "1 Pedro",
  "2pe": "2 Pedro",
  "1jo": "1 João",
  "2jo": "2 João",
  "3jo": "3 João",
  jd: "Judas",
  ap: "Apocalipse",
};

/**
 * Função pura para formatar referências bíblicas de maneira padronizada.
 * Exemplos:
 * formatReference("jo", 3, 16) -> "João 3:16"
 * formatReference("João", 3) -> "João 3"
 * formatReference("sl", 23, 1) -> "Salmos 23:1"
 */
export function formatReference(
  bookOrAbbrev: string,
  chapter: number,
  verseNumber?: number
): string {
  const normalizedKey = bookOrAbbrev.trim().toLowerCase();
  const bookName = BIBLE_BOOK_NAMES[normalizedKey] ?? bookOrAbbrev.trim();

  if (verseNumber !== undefined && verseNumber !== null) {
    return `${bookName} ${chapter}:${verseNumber}`;
  }

  return `${bookName} ${chapter}`;
}

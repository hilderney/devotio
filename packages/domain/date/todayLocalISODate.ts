/**
 * Retorna a data no formato ISO YYYY-MM-DD considerando o fuso horário local ou especificado.
 * Função pura e determinística quando fornecidos date e timeZone.
 */
export function todayLocalISODate(
  date: Date = new Date(),
  timeZone?: string
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  let year = "";
  let month = "";
  let day = "";

  for (const part of parts) {
    if (part.type === "year") year = part.value;
    if (part.type === "month") month = part.value;
    if (part.type === "day") day = part.value;
  }

  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

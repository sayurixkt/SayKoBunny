export function localDate(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function databaseDate(date: string) { return new Date(`${date}T12:00:00-03:00`); }
export function dayRange(date: string) { const start = databaseDate(date); const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1); return { gte: start, lt: end }; }

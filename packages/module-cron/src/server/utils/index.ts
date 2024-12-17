export function parseDateWithoutMs(date: Date) {
  return Math.floor(date.getTime() / 1000) * 1000;
}

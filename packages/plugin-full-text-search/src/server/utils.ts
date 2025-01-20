export function escapeLike(value: string): string {
  return value.replace(/[_%]/g, '\\$&');
}

export function convertTimezoneOffset(utcOffset: string): string {
  if (!/^[+-]?\d{2}:\d{2}$/.test(utcOffset)) {
    throw new Error('Invalid UTC offset format. Expected format: (+/-)HH:MM');
  }
  const parts = utcOffset.split(':');
  const hours = parseInt(parts[0].replace('+', ''), 10);
  const minutes = parseInt(parts[1], 10);
  const totalMinutes = hours * 60 + (hours >= 0 ? minutes : -minutes);
  return `${totalMinutes} minutes`;
}

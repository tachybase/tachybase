export function escapeLike(value: string): string {
  return value.replace(/[_%]/g, '\\$&');
}

export function convertTimezoneOffset(utcOffset: string): string {
  // 假设您需要将 UTC 偏移转换为某种格式
  // 这里是一个示例实现，您可以根据需要进行调整
  const parts = utcOffset.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return `${hours * 60 + minutes} minutes`;
}

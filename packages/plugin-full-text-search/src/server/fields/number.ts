import { Dialect } from '../dialects/Dialect';

export function handleNumberField(fieldName: string, keywords: string[], handler: Dialect): any[] {
  const conditions = [];
  for (const keyword of keywords) {
    const condition = handler.handleNumberQuery(fieldName, keyword);
    if (!condition) {
      continue;
    }
    conditions.push(condition);
  }
  return conditions;
}

import { FieldBase } from '../dialects/FieldBase';

export function handleStringField(field: string, keywords: string[], handler: FieldBase): any[] {
  const conditions = [];
  for (const keyword of keywords) {
    const condition = handler.handleStringQuery(field, keyword);
    if (!condition) {
      continue;
    }
    conditions.push(condition);
  }
  return conditions;
}

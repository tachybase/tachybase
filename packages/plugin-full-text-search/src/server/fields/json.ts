import { FieldBase } from '../dialects/FieldBase';

export function handleJsonField(fieldName: string, keywords: string[], handler: FieldBase) {
  const results = [];
  for (const keyword of keywords) {
    results.push(handler.handleJsonQuery(fieldName, keyword));
  }
  return results;
}

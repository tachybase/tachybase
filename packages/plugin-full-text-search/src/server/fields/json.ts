import { Dialect } from '../dialects/Dialect';

export function handleJsonField(fieldName: string, keywords: string[], handler: Dialect) {
  const results = [];
  for (const keyword of keywords) {
    results.push(handler.handleJsonQuery(fieldName, keyword));
  }
  return results;
}

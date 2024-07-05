import jsonata from 'jsonata';

export function getAssociationName(str) {
  const lastIndex = str.lastIndexOf('.');
  if (lastIndex !== -1) {
    return str.substring(lastIndex + 1);
  }
  return str;
}

export async function jsonParse(expression, scope): Promise<any[]> {
  const result = await jsonata(expression).evaluate(scope);
  if (result === null || result === undefined) {
    return [];
  } else if (Array.isArray(result)) {
    return result;
  } else {
    return [result];
  }
}

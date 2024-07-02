import jsonata from 'jsonata';

export function getAssociationName(str) {
  const lastIndex = str.lastIndexOf('.');
  if (lastIndex !== -1) {
    return str.substring(lastIndex + 1);
  }
  return str;
}

export function jsonParse(expression, scope) {
  const result = jsonata(expression).evaluate(scope);
  return result;
}

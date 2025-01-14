export const REGEX_OF_VARIABLE = /^\s*\{\{\s*([a-zA-Z0-9_$-.]+?)\s*\}\}\s*$/g;
export const REGEX_OF_VARIABLE_IN_EXPRESSION = /\{\{\s*([a-zA-Z0-9_$-.]+?)\s*\}\}/g;

export const isVariable = (str: unknown) => {
  if (typeof str !== 'string') {
    return false;
  }
  const matches = str.match(REGEX_OF_VARIABLE);

  if (!matches) {
    return false;
  }

  return true;
};

export const getVariablesFromExpression = (str: string) => {
  const matches = str.match(REGEX_OF_VARIABLE_IN_EXPRESSION);
  if (!matches) {
    return [];
  }
  return matches;
};

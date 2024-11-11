export function normalizeRequestOptionsKey(value) {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.map((item) => {
        const key = item.name;
        const value2 = item.value;
        return [key, value2];
      }),
    );
  }
  return value;
}
export function normalizeRequestOptions(actionOptions) {
  const arrayKeys = ['headers', 'variables', 'params'];
  for (const key of arrayKeys) {
    if (actionOptions[key]) {
      actionOptions[key] = normalizeRequestOptionsKey(actionOptions[key]);
    }
  }
  return actionOptions;
}

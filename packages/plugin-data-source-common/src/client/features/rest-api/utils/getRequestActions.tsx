export function getRequestActions(sourceMethod) {
  return ['list', 'get'].filter((method) => !sourceMethod.includes(method));
}

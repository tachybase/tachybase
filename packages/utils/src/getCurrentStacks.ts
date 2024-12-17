export function getCurrentStacks() {
  const myObject = { stack: '' };
  Error.captureStackTrace(myObject);
  const stackLines = myObject.stack.split('\n');
  stackLines.splice(0, 3);
  return stackLines.join('\n');
}

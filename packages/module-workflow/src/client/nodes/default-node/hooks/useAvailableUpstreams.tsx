export function useAvailableUpstreams(node, filter?) {
  const stack: any[] = [];
  if (!node) {
    return [];
  }
  for (let current = node.upstream; current; current = current.upstream) {
    if (typeof filter !== 'function' || filter(current)) {
      stack.push(current);
    }
  }

  return stack;
}

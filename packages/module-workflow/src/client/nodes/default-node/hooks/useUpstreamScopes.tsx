export function useUpstreamScopes(node) {
  const stack: any[] = [];
  if (!node) {
    return [];
  }

  for (let current = node; current; current = current.upstream) {
    if (current.upstream && current.branchIndex != null) {
      stack.push(current.upstream);
    }
  }

  return stack;
}

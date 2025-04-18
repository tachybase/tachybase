export function isApprovalReturnFunc(upstream, branchIndex = null, filter) {
  for (let currU = upstream, currB = branchIndex; currU; currU = currU.upstream) {
    const currentUpstream = findCurrentUpstream(currU, currB);
    if (filter(currentUpstream, currB)) {
      return true;
    }
    currB = currU.branchIndex;
  }
  return false;
}

function findCurrentUpstream(upstream, branchIndex = null) {
  for (let currU = upstream, currB = branchIndex; currU; currU = currU.upstream) {
    if (branchIndex != null) {
      return currU;
    }
    currB = currU.branchIndex;
  }
  return null;
}

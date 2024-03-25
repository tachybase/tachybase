export function fuzzysearch(needle: string, haystack: string): boolean {
  const hlen = haystack.length;
  const nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

// 数组去重
const getArrayOfNoDuplicateValue = (arr: Array<string | number>): Array<string | number> => {
  return [...new Set(arr)];
};

// 判断两个对象是否包含有相同的key
export function hasDuplicateKeys(A: Object, B: Object): boolean {
  const keysA = getArrayOfNoDuplicateValue(Object.keys(A));
  const keysB = getArrayOfNoDuplicateValue(Object.keys(B));
  const keysA_B = getArrayOfNoDuplicateValue([...keysA, ...keysB]);
  return keysA_B.length < keysA.length + keysB.length;
}

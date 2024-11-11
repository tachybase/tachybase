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

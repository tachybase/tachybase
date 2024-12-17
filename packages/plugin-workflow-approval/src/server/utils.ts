// 根据一系列唯一性字段, 去重对象数组
// result = [{id:1,name,2,weight:10, time:1}]
// 用法示例: findUniquifyObjects(result, ['name', 'weight'], 'time', (a, b) => a - b);
export function findUniqueObjects(
  sourceArray = [],
  uniqueByArray: string[],
  compareByKey = '',
  compareByFunc = (a, b) => a - b,
): any[] {
  const uniqueMap = {};
  let result = [];
  sourceArray.forEach((obj) => {
    const uniqueKey = uniqueByArray.map((field) => obj[field]).join('|');
    const existingObj = uniqueMap[uniqueKey];

    if (!existingObj || compareByFunc(obj[compareByKey], existingObj[compareByKey]) > 0) {
      uniqueMap[uniqueKey] = obj;
    }
  });

  result = Object.values(uniqueMap);

  return result;
}

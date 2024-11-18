import jsonata from 'jsonata';

export function getAssociationName(str) {
  const lastIndex = str.lastIndexOf('.');
  if (lastIndex !== -1) {
    return str.substring(lastIndex + 1);
  }
  return str;
}

export async function jsonParse(expression, scope): Promise<any[]> {
  const result = await jsonata(expression).evaluate(scope);
  if (result === null || result === undefined) {
    return [];
  } else if (Array.isArray(result)) {
    return result;
  } else {
    return [result];
  }
}

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

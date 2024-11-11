// 这个函数的目的是筛选出参数对象中的属性，这些属性必须满足两个条件：有一个 method 属性和一个 path 属性。然后，它将这些属性的值作为新对象的键值对

export function filterObjectWithMethodAndPath(obj: Record<string, any>): Record<string, any> {
  const keys = Object.keys(obj);

  const filteredKeys = keys.filter((key) => {
    const value = obj[key];

    return value.method && value.path;
  });

  const resultObj = filteredKeys.reduce(
    (filteredObj, key) => ({
      ...filteredObj,
      [key]: obj[key],
    }),
    {},
  );

  return resultObj;
}

export function flatSchemaArray(sourceData, filter, needRecursion = false) {
  const flatArray = [];
  if (!sourceData) {
    return flatArray;
  }

  if (filter(sourceData) && (!needRecursion || !sourceData.properties)) {
    flatArray.push(sourceData);
  } else {
    sourceData.properties &&
      Object.keys(sourceData.properties).forEach((key) => {
        flatArray.push(...flatSchemaArray(sourceData.properties[key], filter));
      });
  }

  return flatArray;
}

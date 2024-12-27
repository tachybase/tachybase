export function getFilterBlockParams(params) {
  const { blockList, collection } = params;

  let filterParams = {};

  for (const currentBlock of blockList) {
    if (Object.keys(currentBlock.defaultFilter).length && currentBlock.collection.name === collection) {
      filterParams = {
        ...filterParams,
        ...currentBlock.defaultFilter,
      };
    }
  }

  return filterParams;
}

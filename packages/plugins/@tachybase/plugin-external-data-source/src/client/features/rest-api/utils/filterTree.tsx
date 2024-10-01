// 过滤一个树状结构的数据，只保留那些子项的 availableTypes 包含 type 的项
export const filterTree = (items, type) => {
  const filteredItems = items
    .filter((item) => {
      const matchingChildren = item.children.filter(
        (child) => child.availableTypes && child.availableTypes.includes(type),
      );
      return matchingChildren.length > 0;
    })
    .map((item) => ({
      label: item.label,
      key: item.key,
      children: item.children.filter((child) => child.availableTypes && child.availableTypes.includes(type)),
    }));

  return filteredItems;
};

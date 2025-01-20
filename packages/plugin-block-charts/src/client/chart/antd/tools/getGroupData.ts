/**
 * 根据 groupField 动态分组数据，并对数字类型字段进行累加，同时构造唯一 key
 * @param datas 原始数据
 * @param groupField 分组字段数组
 * @returns 分组后的嵌套结构
 */
export function getGroupData(datas: any[], groupField: string[], isVisibleField: boolean, measures: string[]) {
  // 递归分组函数
  const recursiveGroupByField = (
    data: any[],
    fields: string[],
    currentIndex: number = 0,
    parentKey: string = '',
    parentGroup: any = {},
  ) => {
    // 如果已经处理完所有分组字段，返回原始数据
    // XXX: 这里要重构, 依赖了groupField的长度, 总是忽略了最后一个分组
    if (currentIndex + 1 >= fields.length) {
      return data;
    }
    // 当前分组字段
    const currentField = fields[currentIndex];

    // 使用 reduce 对当前字段进行分组
    const grouped = data.reduce((acc, item) => {
      // 获取当前字段的值
      const keyValue = item[currentField];

      // 构造唯一 key
      const currentKey = parentKey ? `${parentKey}-${keyValue}` : keyValue;

      // 如果分组不存在，则初始化
      if (!acc[currentKey]) {
        // 初始化分组对象
        acc[currentKey] = {
          ...parentGroup, // 继承父级的分组字段
          [currentField]: keyValue, // 当前字段的值
          key: currentKey, // 唯一 key
          children: [], // 用于存储子数据
        };

        // 初始化数字类型字段的累加值
        Object.keys(item).forEach((field) => {
          if (typeof item[field] === 'number' && !fields.includes(field)) {
            acc[currentKey][field] = 0; // 初始化为 0
          }
        });

        // 添加其他非数字字段
        Object.keys(item).forEach((field) => {
          if (!fields.includes(field) && typeof item[field] !== 'number') {
            acc[currentKey][field] = item[field];
          }
        });
      }

      // 累加数字类型字段的值
      Object.keys(item).forEach((field) => {
        if (typeof item[field] === 'number' && !fields.includes(field)) {
          acc[currentKey][field] += item[field];
        }
      });

      // 将当前数据添加到分组中
      acc[currentKey].children.push(item);

      return acc;
    }, {});

    // 对每个分组递归处理下一个字段
    return Object.values(grouped).map((group: any) => ({
      ...group,
      children: recursiveGroupByField(group.children, fields, currentIndex + 1, group.key, group), // 传递当前 key 和分组对象
    }));
  };

  // 调用递归函数并返回结果
  return recursiveGroupByField(datas, groupField);
}

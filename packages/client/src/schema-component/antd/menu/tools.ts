import { type Schema } from '@tachybase/schema';

// 从原始 schema JSON 数据出, 构造平铺的 json
export function getNewSideMenuSchema(sideMenuSchema, searchMenuTitle) {
  const newSchema = flattenAndFilterJson(sideMenuSchema, searchMenuTitle);

  return newSchema;
}

function flattenAndFilterJson(data: Schema, targetTitle) {
  const { title, properties, ...rest } = data;

  const result = {
    title, // 保留根层级的 title
    ...rest,
    properties: {}, // 初始化第二级
  };

  // 递归函数，用于遍历和提取符合条件的子级
  const traverse = (node) => {
    if (!node) return;

    // 如果当前节点没有 properties，说明不是分组
    if (!node.properties) {
      if (node?.title?.includes(targetTitle)) {
        // 提取符合条件的叶子节点到第二级
        result.properties[node.name] = { ...node };
      }
      return; // 提前终止递归
    }

    // 如果当前节点有 properties，递归遍历子级
    Object.values(node.properties).forEach((child: Schema) => {
      if (child?.title?.includes(targetTitle)) {
        // 提取符合条件的子节点到第二级
        result.properties[child.name] = { ...child };
      }
      traverse(child); // 继续递归遍历
    });
  };

  // 从根节点开始遍历
  traverse(data);

  return result;
}

interface IOptions {
  fieldProps: { [key: string]: any };
  dataIndex: string;
  render?: Function | undefined;
  dimensions: string[];
  isHiddenField: boolean;
  measures: string[];
}
// 格式化器
export function renderText(
  text: string | number | null | undefined,
  record: Record<string, any>,
  options: IOptions,
): string | number {
  const { fieldProps, dataIndex, dimensions, isHiddenField, measures } = options;

  // 数据格式化配置的格式化器
  const transformer = fieldProps[dataIndex]?.transformer;
  const formattedText = transformer ? transformer(text) : text;

  // 是否隐藏分组字段
  // 判断当前 record 的层级,
  // 如果是第一级, 显示第一个分组的字段; 2-2, n-n, n 的长度必然是 dimensions 的长度
  if (isHiddenField) {
    const currentLevel = record.currentLevel;
    if (dimensions[currentLevel] !== dataIndex && !measures.includes(dataIndex)) {
      return '';
    }
  }
  return formattedText;
}

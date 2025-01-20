interface IOptions {
  fieldProps: { [key: string]: any };
  dataIndex: string;
  render?: Function | undefined;
  dimensions: string[];
  isHiddenField: boolean;
}
// 格式化器
export function renderText(
  text: string | number | null | undefined,
  record: Record<string, any>,
  options: IOptions,
): string | number {
  const { fieldProps, dataIndex, dimensions, isHiddenField } = options;

  // 数据格式化配置的格式化器
  const transformer = fieldProps[dataIndex]?.transformer;
  const formattedText = transformer ? transformer(text) : text;

  // 分组字段, 且判断是否隐藏
  if (dimensions.includes(dataIndex) && isHiddenField) {
    const keepField = dimensions.findLast((dim) => typeof record[dim] !== 'undefined');
    if (dataIndex !== keepField) {
      return '';
    }
  }

  return formattedText;
}

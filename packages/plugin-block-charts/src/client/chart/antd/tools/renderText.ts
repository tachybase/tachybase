interface IOptions {
  fieldProps: { [key: string]: any };
  dataIndex: string;
  render?: Function | undefined;
}
// 格式化器
export function renderText(
  text: string | number | null | undefined,
  record: Record<string, any>,
  options: IOptions,
): string | number {
  const { fieldProps, dataIndex, render } = options;
  // 数据格式化配置的格式化器
  const transformer = fieldProps[dataIndex]?.transformer;
  const formattedText = transformer ? transformer(text) : text;

  // 图表配置中的 render 函数
  if (typeof render === 'function') {
    return render(formattedText, record);
  }

  return formattedText;
}

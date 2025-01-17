export function renderByConfig(text, record, configs) {
  //  TODO: 在渲染阶段先进行数据转换机制, 然后走用户的配置机制; transform
  const { transformer, transform } = configs;
  const trans1 = transformer ? transformer(text) : text;
  // const trans2 = transform ? transform(trans1) : trans1;
  return trans1;
}

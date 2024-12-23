// 将类似 欢迎{{$context.roleName}} 的变量替换为实际值
// 比如欢迎{{$context.data.name}},{{$context.roleName}}  => '欢迎张三,管理员'
export async function replaceContextVariables(content: string, { nodeId, userId }, processor: any) {
  const context = processor.execution.context;

  // 替换 $context
  const reg = /\{\{\s*\$context\.([^{}]+)\s*\}\}/g;
  const content1 = content.replace(reg, (match, key) => {
    return context[key] || '';
  });

  // 替换 {{$messageVariables.notifiedPerson.nickname}}
  const repo = processor.execution.db.getRepository('users');
  const user = await repo.findOne({
    filterByTk: userId,
    appends: ['roles'],
  });

  const regMessage = /\{\{\s*\$messageVariables\.notifiedPerson.([^{}]+)\s*\}\}/g;

  const content2 = content1.replace(regMessage, (match, key) => {
    return user[key] || '';
  });

  const result = processor.getParsedValue(content2, nodeId);
  return result;
}

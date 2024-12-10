// 将类似 欢迎{{$context.roleName}} 的变量替换为实际值
// 比如欢迎{{$context.data.name}},{{$context.roleName}}  => '欢迎张三,管理员'
export function replaceContextVariables(content: string, context: any) {
  const reg = /\{\{\s*\$context\.([^{}]+)\s*\}\}/g;
  return content.replace(reg, (match, key) => {
    return context[key] || '';
  });
}

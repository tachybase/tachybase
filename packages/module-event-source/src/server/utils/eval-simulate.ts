export async function evalSimulate(jsCode: string, { ctx, lib }) {
  const AsyncFunction: any = async function () {}.constructor;
  return await new AsyncFunction('$root', `with($root) { ${jsCode}; }`)({
    ctx,
    console,
    // 允许用户覆盖，这个时候可以使用 _ctx
    __ctx: ctx,
    lib,
  });
}

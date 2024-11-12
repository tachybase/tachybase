import { Context, Next } from '@tachybase/actions';

export const getAuthCfg = async (ctx: Context, next: Next) => {
  const { redirect } = ctx.action.params.values;
  ctx.body = await ctx.auth.getAuthCfg(redirect);
  await next();
};

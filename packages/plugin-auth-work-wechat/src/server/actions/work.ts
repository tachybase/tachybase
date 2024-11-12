import { Context, Next } from '@tachybase/actions';
import { AppSupervisor } from '@tachybase/server';

export const getAuthUrl = async (ctx: Context, next: Next) => {
  const { redirect } = ctx.action.params.values;
  const url = await ctx.auth.getAuthUrl(redirect);
  ctx.body = { url };
  await next();
};

export const redirect = async (ctx: Context, next: Next) => {
  const { code, state } = ctx.request.query;

  // 如果 state 是数组，取第一个元素
  const stateString = Array.isArray(state) ? state[0] : state;
  const search = new URLSearchParams(stateString);

  const authenticator = search.get('name');
  const appName = search.get('app');
  const redirect = search.get('redirect') || '/admin';
  let prefix = process.env.APP_PUBLIC_PATH || '';
  if (appName && appName !== 'main') {
    const appSupervisor = AppSupervisor.getInstance();
    if (appSupervisor?.runningMode !== 'single') {
      prefix += `apps/${appName}`;
    }
  }
  const auth = await ctx.app.authManager.get(authenticator, ctx);
  if (prefix.endsWith('/')) {
    prefix = prefix.slice(0, -1);
  }
  try {
    const { token } = await auth.signIn();
    ctx.redirect(`${prefix}${redirect}?authenticator=${authenticator}&token=${token}`);
  } catch (error) {
    ctx.logger.error('Work auth error', { error });
    ctx.redirect(`${prefix}/signin?redirect=${redirect}&authenticator=${authenticator}&error=${error.message}`);
  }
  await next();
};

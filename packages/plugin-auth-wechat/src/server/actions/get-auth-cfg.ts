import { Context, Next } from '@tachybase/actions';
import { AUTH_TIMEOUT_SECOND, weChatApiOauthScope } from '../../constants';
import Application from '@tachybase/server';
import { dayjs } from '@tachybase/utils';

export const getAuthCfg = async (ctx: Context, next: Next) => {
  const { redirect, bind } = ctx.action.params.values;
  if (bind) {
    const { authenticator } = ctx.action.params.values;
    const app = ctx.app as Application;
    const options = await app.authManager.getOptions(authenticator);
    ctx.body = getBindAuthCfg(ctx, redirect, options?.wechatAuth?.AppID);
  } else {
    ctx.body = await ctx.auth.getAuthCfg(redirect, bind);
  }
  await next();
};

const getBindAuthCfg = (ctx, redirect: string, appID: string) => {
  const userId = ctx.auth?.user?.id;
  if (!userId) {
    ctx.throw(400, 'Bind user failed: no user found');
  }
  const app = ctx.app.name;
  const referer = ctx.req.headers['referer'];
  let redirectUrl;
  if (referer) {
    const clientUrl = new URL(referer);
    redirectUrl = `${clientUrl.protocol}//${clientUrl.host}${process.env.API_BASE_PATH}wechatAuth:redirect`;
  } else {
    redirectUrl = `${ctx.protocol}://${ctx.host}${process.env.API_BASE_PATH}wechatAuth:redirect`;
  }
  let state = `redirect=${redirect}&app=${app}&name=${ctx.headers['x-authenticator']}`;

  const token = ctx.app.authManager.jwt.sign(
    { userId: ctx.auth.user.id },
    { expiresIn: AUTH_TIMEOUT_SECOND },
  );
  state += `&bindToken=${token}`;
  return {
    appId: appID,
    scope: weChatApiOauthScope,
    redirectUrl: encodeURIComponent(redirectUrl),
    state: encodeURIComponent(encodeURIComponent(state)),
  };
}

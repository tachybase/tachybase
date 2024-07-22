import { Context } from '@tachybase/actions';

import { NAMESPACE } from '../../constants';

// 禁止访客进行任何鉴权操作，除了 check 和 signOut
function banGuestActionMiddleware() {
  return async (ctx: Context, next) => {
    // 注意由于已经注入访客 token, 还需要判断请求体里面用户是否为 guest
    const reqBody = ctx.request.body;
    if (
      ctx.action.resourceName === 'auth' &&
      !['check', 'signOut'].includes(ctx.action.actionName) &&
      ctx.auth.user &&
      (reqBody.account === 'guest' || reqBody.account === 'guest@tachybase.com')
    ) {
      const { username, email } = ctx.auth.user;
      if (username === 'guest' || email === 'guest@tachybase.com') {
        ctx.withoutDataWrapping = true;
        ctx.status = 401;
        ctx.body = {
          errors: [
            {
              message: ctx.t('Unauthorized', { ns: NAMESPACE }),
            },
          ],
        };
        return;
      }
    }

    await next();
  };
}

export { banGuestActionMiddleware };

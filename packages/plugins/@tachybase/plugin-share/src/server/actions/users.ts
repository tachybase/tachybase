import { Context, Next } from '@tachybase/actions';

import { NAMESPACE } from '../../constants';

export async function update(ctx: Context, next: Next) {
  const { values } = ctx.action.params;
  const targetUserId = Number(ctx.request.url.split('filterByTk=')[1]);
  const guestUser = await ctx.db.getRepository('users').findOne({
    filter: {
      username: 'guest',
    },
    raw: true,
  });

  if (!guestUser) {
    ctx.throw(401, ctx.t('Guest user not found.', { ns: NAMESPACE }));
  }

  // 只拦截 update guest 用户的请求
  if (targetUserId === guestUser.id) {
    if (
      (values.username && values.username !== guestUser.username) ||
      (values.email && values.email !== guestUser.email) ||
      values.password
    ) {
      ctx.throw(401, ctx.t('Not allowed to modify login information of guest user.', { ns: NAMESPACE }));
    }
  }

  const UserRepo = ctx.db.getRepository('users');
  const result = await UserRepo.update({
    filterByTk: targetUserId,
    values,
  });
  ctx.body = result;
  await next();
}

export async function updateProfile(ctx: Context, next: Next) {
  const { values } = ctx.action.params;
  const { currentUser } = ctx.state;
  if (!currentUser || currentUser.username === 'guest' || currentUser.email === 'guest@tachybase.com') {
    ctx.throw(401, ctx.t('Not allowed to modify login information of guest user.', { ns: NAMESPACE }));
  }
  const UserRepo = ctx.db.getRepository('users');
  const result = await UserRepo.update({
    filterByTk: currentUser.id,
    values,
  });
  ctx.body = result;
  await next();
}

import { Context } from '@tachybase/actions';

export async function setSelfRole(ctx: Context, next) {
  if (!ctx.state.currentUser) {
    return next();
  }
  const currentUser = await ctx.db.getRepository('users').findOne({
    filterByTk: ctx.state.currentUser.id,
    appends: ['selfRole'],
  });
  if (!currentUser.selfRole) {
    return next();
  }
  const sourceRoles = await currentUser.selfRole.getSourceRoles();
  if (sourceRoles.find((r) => r.name === 'root')) {
    if (!ctx.get('X-Role') || ctx.get('X-Role') === 'anonymous') {
      ctx.headers['x-role'] = 'root';
    }
    return next();
  }
  if (!ctx.state.attachRoles) {
    ctx.state.attachRoles = [];
  }
  ctx.state.currentRole = currentUser.selfRole.name;
  ctx.state.attachRoles.push(currentUser.selfRole);

  if (!ctx.get('X-Role') || ctx.get('X-Role') === 'anonymous') {
    ctx.headers['x-role'] = currentUser.selfRole.name;
  }

  return next();
}

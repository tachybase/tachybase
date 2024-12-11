import { Context } from '..';
import { getRepositoryFromParams } from '../utils';

export async function count(ctx: Context, next) {
  const repository = getRepositoryFromParams(ctx);
  const { filter } = ctx.action.params;

  const count = await repository.count({
    filter,
    context: ctx,
  });

  ctx.body = count;
  await next();
}

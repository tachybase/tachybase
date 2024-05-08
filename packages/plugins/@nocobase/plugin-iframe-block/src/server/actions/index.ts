import { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';

export async function getHtml(ctx: Context, next: Next) {
  const { filterByTk } = ctx.action.params;
  const { resourceName } = ctx.action;
  const repository = ctx.db.getRepository<any>(resourceName) as Repository;
  const model = await repository.findById(filterByTk);
  ctx.body = model.get('html');
  ctx.withoutDataWrapping = true;

  ctx.set({
    'Content-Type': 'text/html; charset=UTF-8',
  });

  await next();
}

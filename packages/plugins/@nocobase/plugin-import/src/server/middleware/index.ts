import { Context, Next } from '@tachybase/actions';
import { koaMulter as multer } from '@tachybase/utils';

export async function importMiddleware(ctx: Context, next: Next) {
  if (ctx.action.actionName !== 'importXlsx') {
    return next();
  }
  const upload = multer().single('file');
  return upload(ctx, next);
}

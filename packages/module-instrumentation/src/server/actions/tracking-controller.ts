import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('instrumentation')
export class TrackingController {
  @Action('create', { acl: 'public' })
  async create(ctx: Context, next: () => Promise<any>) {
    const repo = ctx.db.getRepository('trackingEvents');
    const version = process.env.npm_package_version;
    const currentTime = new Date().toISOString();
    const values = ctx.action.params.values.values
      ? {
          ...ctx.action.params.values,
          values: {
            ...ctx.action.params.values.values,
            version,
            createdAt: currentTime,
          },
        }
      : { ...ctx.action.params.values, createdAt: currentTime };
    await repo.create({
      values,
    });
    return next();
  }
}

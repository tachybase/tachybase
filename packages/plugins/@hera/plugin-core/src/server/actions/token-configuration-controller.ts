import { Context } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('token-configuration')
export class TokenConfigurationController {
  @Action('get')
  async getConfiguration(ctx: Context, next: () => Promise<any>) {
    const {
      params: { type },
    } = ctx.action;

    const repo = ctx.db.getRepository('tokenConfiguration');
    const record = await repo.findOne({
      filter: {
        type,
      },
    });

    ctx.body = record;
    return next();
  }

  @Action('set')
  async setConfiguration(ctx: Context, next: () => Promise<any>) {
    const { params: values } = ctx.action;
    const repo = ctx.db.getRepository('tokenConfiguration');
    const record = await repo.findOne({
      filter: {
        type: values.type,
      },
    });

    if (record) {
      await repo.update({
        values,
        filter: {
          type: values.type,
        },
      });
    } else {
      await repo.create({
        values,
      });
    }

    ctx.body = 'ok';
    return next();
  }
}

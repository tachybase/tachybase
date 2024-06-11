import { Context } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('webhooks')
export class WebhookController {
  @Action('trigger')
  async getLink(ctx: Context) {
    const {
      params: { name },
    } = ctx.action;
    const where = {};
    if (name) {
      where['filter'] = {
        name: name,
        enabled: true,
      };
    }

    if (!name) {
      throw new Error('not support');
    }
    const repo = ctx.db.getRepository('webhooks');
    const webhook = await repo.findOne(where);
    const webhookCtx = {
      action: ctx.action,
      body: '',
    };
    run(webhook.code, {
      ctx: webhookCtx,
    });
    if (webhookCtx.body) {
      ctx.withoutDataWrapping = true;
      ctx.body = webhookCtx.body;
    }
  }
}

function run(jsCode: string, { ctx }) {
  try {
    return new Function('$root', `with($root) { ${jsCode}; }`)({ ctx });
  } catch (err) {
    console.log('err', err);
  }
}

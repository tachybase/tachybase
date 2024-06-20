import { Context } from '@tachybase/actions';
import { PluginWorkflow } from '@tachybase/plugin-workflow';
import { dayjs } from '@tachybase/utils';

export class WebhookController {
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
    const pluginWorkflow = ctx.app.getPlugin(PluginWorkflow) as PluginWorkflow;
    const repo = ctx.db.getRepository('webhooks');
    const webhook = await repo.findOne(where);
    const webhookCtx = {
      request: ctx.request,
      action: ctx.action,
      body: '',
    };
    run(webhook.code, {
      ctx: webhookCtx,
      lib: {
        JSON,
        Math,
        dayjs,
      },
    });
    if (webhook?.workflowKey) {
      const wfRepo = ctx.db.getRepository('workflows');
      const wf = await wfRepo.findOne({ filter: { key: webhook.workflowKey, enabled: true } });
      const processor = await pluginWorkflow.trigger(wf, { data: webhookCtx.body }, { httpContext: ctx });
      if (!processor) {
        return ctx.throw(500);
      }
      const { lastSavedJob } = processor;
      ctx.withoutDataWrapping = true;
      ctx.body = lastSavedJob.result;
      return;
    }
    if (webhookCtx.body) {
      ctx.withoutDataWrapping = true;
      ctx.body = webhookCtx.body;
      return;
    }
  }
}

function run(jsCode: string, { ctx, lib }) {
  try {
    return new Function('$root', `with($root) { ${jsCode}; }`)({ ctx, lib });
  } catch (err) {
    console.log('err', err);
  }
}

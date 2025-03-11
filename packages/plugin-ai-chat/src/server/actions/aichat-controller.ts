import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import axios from 'axios';

@Controller('aichat')
export class AIChatController {
  @Action('sendMessage', { acl: 'loggedIn' })
  async handleMessage(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('aisettings');
    const data = await repo.findOne();
    const { Model: model, AI_URL: apiUrl, AI_API_KEY: aitoken, System_messages: SystemMessages } = data || {};
    const userMessage = ctx.action?.params?.values?.message || undefined;

    if (!model || !apiUrl || !aitoken || !userMessage) {
      ctx.throw('Missing required fields for AI chat');
    }

    const requestData = {
      model,
      messages: [
        { role: 'system', content: SystemMessages },
        { role: 'user', content: userMessage },
      ],
    };
    const headers = {
      Authorization: `Bearer ${aitoken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(apiUrl, requestData, { headers });
      ctx.body = response.data;
    } catch (error) {
      ctx.throw(error?.response?.data?.error?.message || 'request error');
    }
    await next();
  }
  @Action('get', { acl: 'private' })
  async getAIsetting(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('aisettings');
    const data = await repo.findOne();
    ctx.body = data;
    await next();
  }
  @Action('set', { acl: 'private' })
  async setAIsetting(ctx: Context, next: () => Promise<any>) {
    const repo = ctx.db.getRepository('aisettings');
    const values = ctx.action.params.values;
    const data = await repo.findOne();
    await repo.update({
      values,
      filter: {
        id: values.id,
      },
    });
    return next();
  }
}

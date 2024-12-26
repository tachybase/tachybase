import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import axios from 'axios';

@Controller('aichat')
export class AIChatController {
  @Action('sendMessage', { acl: 'loggedIn' })
  async handleMessage(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('aisettings');
    const data = await repo.findOne();
    const model = data?.Model;
    const userMessage = ctx.action?.params?.values?.message || undefined;
    const apiUrl = data?.AI_URL;
    const aitoken = data?.AI_API_KEY;
    const requestData = {
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
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
  @Action('get', { acl: 'priviate' })
  async getAIsetting(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('aisettings');
    const data = await repo.findOne();
    ctx.body = data;
    await next();
  }
  @Action('set', { acl: 'priviate' })
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

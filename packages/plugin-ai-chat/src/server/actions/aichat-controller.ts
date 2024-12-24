import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import axios from 'axios';

@Controller('aichat')
export class AIChatController {
  @Action('sendMessage')
  async handleMessage(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('aisettings');
    const data = await repo.findOne();
    const model = data?.Model || 'deepseek-chat';
    const userMessage = ctx.action?.params?.values?.message || undefined;
    const apiUrl = data?.AI_URL || 'https://api.deepseek.com/chat/completions';
    const aitoken = data?.AI_API_KEY || process.env.AI_API_KEY;
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
      console.error('Error during API call:', error);
      ctx.body = {
        success: false,
        error:
          process.env.NODE_ENV === 'production'
            ? 'An error occurred while calling the AI API.'
            : error.response
              ? error.response.data
              : error.message,
      };
      ctx.status = error.response ? error.response.status : 500;
    }
    await next();
  }
  @Action('get')
  async getAIsetting(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('aisettings');
    const data = await repo.findOne();
    ctx.body = data;
    await next();
  }
  @Action('set')
  async setAIsetting(ctx: Context, next: () => Promise<any>) {
    const repo = ctx.db.getRepository('aisettings');
    const values = ctx.action.params.values;
    // if (!values.id) {
    //   await repo.create(values);
    //   return
    // };
    await repo.update({
      values,
      filter: {
        id: values.id,
      },
    });
    return next();
  }
}

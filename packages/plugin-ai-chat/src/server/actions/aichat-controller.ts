import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import axios from 'axios';

@Controller('aichat')
export class AIChatController {
  @Action('sendMessage')
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
    if (!data) {
      await repo.create({
        values: {
          id: 1,
          Model: 'deepseek-chat',
          AI_URL: 'https://api.deepseek.com/chat/completions',
          AI_API_KEY: 'sk-xxxxxxxxxx',
        },
      });
      ctx.body = await repo.findOne();
    } else {
      ctx.body = data;
    }
    await next();
  }
  @Action('set')
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

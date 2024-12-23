import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import axios from 'axios';
import OpenAI from 'openai';

@Controller('aichat')
export class aichatController {
  @Action('sendMessage')
  async handleMessage(ctx: Context, next: Next) {
    const userMessage = ctx.action?.params?.values?.message || undefined;
    const requestData = {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
    };
    const aitoken = process.env.AI_API_KEY;
    const headers = {
      Authorization: `Bearer ${aitoken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post('https://api.deepseek.com/chat/completions', requestData, { headers });
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
}

import { Context, Next } from '@tachybase/actions';
import axios from 'axios';
import { Action, Controller } from '@tachybase/utils';

@Controller('robot')
export class RobotController {
  async getFeishuToken(app_id: string, app_secret: string) {
    const url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
    const requestData = {
      app_id,
      app_secret,
    };
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
    };
    const response = await axios.post(url, requestData, { headers });

    return response.data.tenant_access_token;
  }

  @Action('sendMessage')
  async sendMessage(ctx: Context, next: Next) {
    const url = 'https://open.feishu.cn/open-apis/im/v1/messages';

    const repo = ctx.db.getRepository('tokenConfiguration');
    const record = await repo.findOne({
      filter: {
        type: 'feishu',
      },
    });
    const chat_id = record.chat_id;
    const access_token = await this.getFeishuToken(record.app_id, record.app_secret);
    const content = {
      text: ctx.action.params.values.message,
    };

    const requestData = {
      msg_type: 'text',
      content: JSON.stringify(content),
      receive_id: chat_id, // chat id
    };
    const headers = {
      Authorization: 'Bearer ' + access_token, // your access token
    };
    const response = await axios.post(url, requestData, { headers, params: { receive_id_type: 'chat_id' } });

    ctx.body = {
      data: response.data,
    };

    await next();
  }
}

import { Repository } from '@tachybase/database';
import Application, { Gateway, WSServer } from '@tachybase/server';

import {
  CHANNEL_SITE_SMS,
  MESSAGE_TYPE_MESSAGES,
  MESSAGES_UPDATE_BADGE_COUNT,
  PLUGIN_NAME_MESSAGE,
} from '../common/constants';
import type { IMessage, IMessageService } from '../types/types';

export class MessageService implements IMessageService {
  repo: Repository;
  ws: WSServer;
  constructor(public app: Application) {
    this.repo = this.app.db.getRepository('messages');
    const gateway = Gateway.getInstance();
    this.ws = gateway['wsServer'];
  }
  public async sendMessage(receiverId: number, message: IMessage, app?): Promise<void> {
    await this.repo.create({
      values: {
        userId: receiverId,
        ...message,
      },
    });
    const user = await this.app.db.getModel('users').findOne({
      where: {
        id: receiverId,
      },
    });

    // 如果用户开启了短信通知渠道, 发送短信通知
    if (user?.subPrefs?.[CHANNEL_SITE_SMS]?.enable && app) {
      const plugin = app.getPlugin(PLUGIN_NAME_MESSAGE);
      const providerItem = await plugin.getDefault();

      if (providerItem) {
        const ProviderType = plugin.providers.get(<string>providerItem.get('type'));
        const provider = new ProviderType(plugin, providerItem.get('options'));
        const { phone } = user;
        await provider.send(phone, {});
      }
    }

    this.ws.sendToConnectionsByTag(`app:${this.app.name}`, `${receiverId}`, {
      type: MESSAGE_TYPE_MESSAGES,
      payload: {
        message,
      },
    });
    // 通知前端更新全局未读消息数量
    this.app.noticeManager.notify(MESSAGES_UPDATE_BADGE_COUNT, {
      msg: MESSAGES_UPDATE_BADGE_COUNT,
    });
  }
}

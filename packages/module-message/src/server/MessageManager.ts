import { Repository } from '@tachybase/database';
import Application, { Gateway, WSServer } from '@tachybase/server';

import { MESSAGE_TYPE_MESSAGES, MESSAGES_UPDATE_BADGE_COUNT } from '../common/constants';
import type { IMessage, IMessageService } from '../types/types';

export class MessageService implements IMessageService {
  repo: Repository;
  ws: WSServer;
  constructor(public app: Application) {
    this.repo = this.app.db.getRepository('messages');
    const gateway = Gateway.getInstance();
    this.ws = gateway['wsServer'];
  }
  public async sendMessage(receiverId: number, message: IMessage): Promise<void> {
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

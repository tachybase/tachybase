import { Repository } from '@tachybase/database';
import Application, { Gateway, WSServer } from '@tachybase/server';

import type { IMessage, IMessageService } from './types';

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
    if (user?.subPrefs?.browser?.enable) {
      this.ws.sendToConnectionsByTag(`app:${this.app.name}`, `${receiverId}`, {
        type: 'messages',
        payload: {
          message,
        },
      });
    }
  }
}

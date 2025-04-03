import Application, { Gateway } from '@tachybase/server';
import { App, currentProcessNum, isMain, Service } from '@tachybase/utils';

import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

const KEY_ONLINE_USERS = 'online_users';

@Service()
export class ConnectionManager {
  @App()
  private app: Application;

  async unload() {
    for (const client of [this.app.online.all, this.app.online.pub, this.app.online.sub]) {
      if (client.isOpen) {
        await client.disconnect();
      }
    }
  }

  async load() {
    if (!this.app.online) {
      const all = createClient({
        url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
      });
      const pub = all.duplicate();
      const sub = all.duplicate();
      this.app.online = {
        all,
        pub,
        sub,
      };
    }
    this.app.on('afterStop', () => {
      this.unload();
    });
    if (this.app.online.all.isOpen) {
      return;
    }
    await this.app.online.all.connect();
    await this.app.online.pub.connect();
    await this.app.online.sub.connect();
    if (isMain()) {
      const keysToDelete: any = await this.app.online.all.KEYS(`${KEY_ONLINE_USERS}*`);
      if (keysToDelete.length > 0) {
        await this.app.online.all.DEL(...keysToDelete);
      }
    }
    await this.loadWsServer();
  }

  async loadWsServer() {
    const appName = this.app.name;
    const gateway = Gateway.getInstance();
    const ws = gateway['wsServer'];

    await this.app.online.sub.SUBSCRIBE(KEY_ONLINE_USERS + appName, async (num) => {
      if (num !== currentProcessNum()) {
        await notifyAllClients(false);
      }
    });

    const notifyAllClients = async (broadcast = true) => {
      // 有效在线用户
      const users = (await this.app.online.all.HVALS(KEY_ONLINE_USERS + appName)).map((u) => JSON.parse(u));
      ws.sendToConnectionsByTag('app', appName, {
        type: 'plugin-online-user',
        payload: {
          users,
        },
      });
      if (broadcast && this.app.online.pub.isOpen) {
        await this.app.online.pub.PUBLISH(KEY_ONLINE_USERS + appName, currentProcessNum());
      }
    };

    // 根据用户id获取用户信息
    const getUserById = async (id: number) => {
      return await this.app.db.getModel('users').findOne({
        where: {
          id,
        },
      });
    };

    // 注册WebSocket事件处理器
    this.app.registerWSEventHandler('close', async (clientId) => {
      if (!this.app?.online?.all?.isOpen) {
        return;
      }
      await this.app.online.all.HDEL(KEY_ONLINE_USERS + appName, clientId);
      await notifyAllClients();
    });

    this.app.registerWSEventHandler('error', async () => {
      await notifyAllClients();
    });

    this.app.registerWSEventHandler('message', async (clientId, data) => {
      if (data.toString() !== 'ping') {
        try {
          const userMeg = JSON.parse(data.toString());
          if (userMeg.type === 'plugin-online-user:client') {
            if (!userMeg.payload.token) {
              return;
            }
            if (this.app?.db?.closed()) {
              this.app.logger.warn('online user connect warn, app db is closed');
              return;
            }

            const analysis = jwt.verify(userMeg.payload.token, process.env.APP_KEY) as any;
            const userId = analysis.userId;
            const user = await getUserById(userId);
            await this.app.online.all.HSET(KEY_ONLINE_USERS + appName, clientId, JSON.stringify(user));
            await notifyAllClients();
          }
        } catch (error) {
          this.app.logger.warn('online user connect error', error);
        }
      }
    });
  }
}

import Application, { Gateway } from '@tachybase/server';
import { App, currentProcessNum, isMain, Service } from '@tachybase/utils';

import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import WebSocket from 'ws';

const KEY_ONLINE_USERS = 'online_users';

@Service()
export class ConnectionManager {
  private redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  });
  private redisPubClient = this.redisClient.duplicate();
  private redisSubClient = this.redisClient.duplicate();

  @App()
  private app: Application;

  async unload() {
    for (const client of [this.redisClient, this.redisPubClient, this.redisSubClient]) {
      if (client.isOpen) {
        await client.disconnect();
      }
    }
  }

  async load() {
    this.app.on('afterStart', async () => {
      if (this.redisClient.isOpen) {
        return;
      }
      for (const client of [this.redisClient, this.redisPubClient, this.redisSubClient]) {
        if (!client.isOpen) {
          await client.connect();
        }
      }
      if (isMain()) {
        const keysToDelete: any = await this.redisClient.KEYS(`${KEY_ONLINE_USERS}*`);
        if (keysToDelete.length > 0) {
          await this.redisClient.DEL(...keysToDelete);
        }
      }
      await this.loadWsServer();
    });
    this.app.on('beforeStop', async () => {
      await this.unload();
    });
  }

  async loadWsServer() {
    const appName = this.app.name;
    const gateway = Gateway.getInstance();
    const ws = gateway['wsServer'];
    await this.redisSubClient.SUBSCRIBE(KEY_ONLINE_USERS + appName, async (num) => {
      if (num !== currentProcessNum()) {
        await notifyAllClients(false);
      }
    });
    const notifyAllClients = async (broadcast = true) => {
      // 有效在线用户
      const users = (await this.redisClient.HVALS(KEY_ONLINE_USERS + appName)).map((u) => JSON.parse(u));
      ws.sendToConnectionsByTag('app', appName, {
        type: 'plugin-online-user',
        payload: {
          users,
        },
      });
      if (broadcast) {
        await this.redisPubClient.PUBLISH(KEY_ONLINE_USERS + appName, currentProcessNum());
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
    ws?.wss.on('connection', (ws: WebSocket & { id: string }) => {
      ws.on('error', async () => {
        await notifyAllClients();
      });
      ws.on('close', async () => {
        await this.redisClient.HDEL(KEY_ONLINE_USERS + appName, ws.id);
        await notifyAllClients();
      });

      // 监听客户端消息,保存客户端信息, 并通知所有客户端
      ws.on('message', async (data) => {
        if (data.toString() !== 'ping') {
          const userMeg = JSON.parse(data.toString());
          if (userMeg.type === 'plugin-online-user:client') {
            try {
              const analysis = jwt.verify(userMeg.payload.token, process.env.APP_KEY) as any;
              const userId = analysis.userId;
              const user = await getUserById(userId);
              await this.redisClient.HSET(KEY_ONLINE_USERS + appName, ws.id, JSON.stringify(user));
              await notifyAllClients();
            } catch (error) {
              console.warn(error.message);
            }
          }
        }
      });
    });
  }
}

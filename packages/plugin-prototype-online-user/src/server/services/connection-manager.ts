import Application, { Gateway } from '@tachybase/server';
import { App, currentProcessNum, isMain, Service } from '@tachybase/utils';

import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import WebSocket from 'ws';

const KEY_ONLINE_USERS = 'online_users';

// WebSocket 事件类型
type WSEventType = 'close' | 'error' | 'message';

// WebSocket 事件处理函数类型
type WSEventHandler = (ws: WebSocket & { id: string }, ...args: any[]) => Promise<void> | void;

@Service()
export class ConnectionManager {
  // private redisClient = createClient({
  //   url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  // });
  // private redisPubClient = this.app.online.app.duplicate();
  // private redisSubClient = this.app.online.app.duplicate();

  @App()
  private app: Application;

  // 存储注册的 WebSocket 事件处理函数，便于清理
  private registeredHandlers: Map<WSEventType, WSEventHandler> = new Map();

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

    // 添加 beforeStop 事件监听，用于清理 WebSocket 事件处理函数
    this.app.on('beforeStop', () => {
      this.unregisterWSEventHandlers();
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

  /**
   * 取消注册所有 WebSocket 事件处理函数
   */
  private unregisterWSEventHandlers() {
    this.app.logger.info('Unregistering WebSocket event handlers for online-user plugin');

    this.registeredHandlers.forEach((handler, eventType) => {
      this.app.emit('ws:removeEventHandler', {
        eventType,
        handler,
      });
    });

    // 清空处理函数集合
    this.registeredHandlers.clear();
  }

  /**
   * 注册 WebSocket 事件处理函数，并保存引用以便后续清理
   */
  private registerWSEventHandler(eventType: WSEventType, handler: WSEventHandler) {
    // 保存处理函数引用
    this.registeredHandlers.set(eventType, handler);

    // 发送事件注册消息
    this.app.emit('ws:registerEventHandler', {
      eventType,
      handler,
    });
  }

  async loadWsServer() {
    const appName = this.app.name;
    const gateway = Gateway.getInstance();
    const wss = gateway['wsServer'];
    await this.app.online.sub.SUBSCRIBE(KEY_ONLINE_USERS + appName, async (num) => {
      if (num !== currentProcessNum()) {
        await notifyAllClients(false);
      }
    });
    const notifyAllClients = async (broadcast = true) => {
      // 有效在线用户
      const users = (await this.app.online.all.HVALS(KEY_ONLINE_USERS + appName)).map((u) => JSON.parse(u));
      wss.sendToConnectionsByTag('app', appName, {
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

    // 注册 WebSocket 关闭事件处理函数
    const closeHandler = async (ws: WebSocket & { id: string }) => {
      if (!this.app?.online?.all?.isOpen) {
        return;
      }
      await this.app.online.all.HDEL(KEY_ONLINE_USERS + appName, ws.id);
      await notifyAllClients();
    };
    this.registerWSEventHandler('close', closeHandler);

    // 注册 WebSocket 错误事件处理函数
    const errorHandler = async () => {
      await notifyAllClients();
    };
    this.registerWSEventHandler('error', errorHandler);

    // 注册 WebSocket 消息事件处理函数
    const messageHandler = async (ws: WebSocket & { id: string }, data) => {
      if (data.toString() !== 'ping') {
        const userMeg = JSON.parse(data.toString());
        if (userMeg.type === 'plugin-online-user:client') {
          if (!userMeg.payload.token) {
            return;
          }
          if (this.app.db.closed()) {
            this.app.logger.warn('online user connect warn, db is closed');
            return;
          }
          try {
            const analysis = jwt.verify(userMeg.payload.token, process.env.APP_KEY) as any;
            const userId = analysis.userId;
            const user = await getUserById(userId);
            await this.app.online.all.HSET(KEY_ONLINE_USERS + appName, ws.id, JSON.stringify(user));
            await notifyAllClients();
          } catch (error) {
            this.app.logger.warn('online user connect error', error);
          }
        }
      }
    };
    this.registerWSEventHandler('message', messageHandler);
  }
}

import { IncomingMessage } from 'http';
import { Logger } from '@tachybase/logger';

import lodash from 'lodash';
import { nanoid } from 'nanoid';
import WebSocket, { WebSocketServer } from 'ws';

import { AppSupervisor } from '../app-supervisor';
import { Gateway, IncomingRequest } from '../gateway';
import { applyErrorWithArgs, getErrorWithCode } from './errors';

declare class WebSocketWithId extends WebSocket {
  id: string;
}

interface WebSocketClient {
  ws: WebSocketWithId;
  tags: Set<string>;
  url: string;
  headers: any;
  app?: string;
}

// 应用级别的事件处理器类型定义
interface AppEventHandlers {
  message?: Array<(clientId: string, data: any, appName: string) => Promise<void> | void>;
  close?: Array<(clientId: string, appName: string) => Promise<void> | void>;
  error?: Array<(clientId: string, error: Error, appName: string) => Promise<void> | void>;
}

// 不同事件类型的处理器类型
type MessageHandler = (clientId: string, data: any, appName: string) => Promise<void> | void;
type CloseHandler = (clientId: string, appName: string) => Promise<void> | void;
type ErrorHandler = (clientId: string, error: Error, appName: string) => Promise<void> | void;

function getPayloadByErrorCode(code, options) {
  const error = getErrorWithCode(code);
  return lodash.omit(applyErrorWithArgs(error, options), ['status', 'maintaining']);
}

export class WSServer {
  wss: WebSocket.Server;
  webSocketClients = new Map<string, WebSocketClient>();
  static KEY_CORE_MESSAGE = 'KEY_CORE_MESSAGE';
  private currentId = nanoid();
  logger: Logger;

  // 应用级别的事件处理器映射
  private appEventHandlers = new Map<string, AppEventHandlers>();

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on('connection', (ws: WebSocketWithId, request: IncomingMessage) => {
      this.addNewConnection(ws, request);

      console.log(`new client connected ${ws.id}`);

      ws.on('error', (error) => {
        // 触发应用级别的error事件处理器
        this.triggerAppEvent('error', ws.id, error);
        this.removeConnection(ws.id);
      });

      ws.on('close', () => {
        // 触发应用级别的close事件处理器
        this.triggerAppEvent('close', ws.id);
        this.removeConnection(ws.id);
      });

      ws.on('message', (data) => {
        // 触发应用级别的message事件处理器
        this.triggerAppEvent('message', ws.id, data);
      });
    });

    Gateway.getInstance().on('appSelectorChanged', () => {
      // reset connection app tags
      this.loopThroughConnections(async (client) => {
        const handleAppName = await Gateway.getInstance().getRequestHandleAppName({
          url: client.url,
          headers: client.headers,
        });

        for (const tag of client.tags) {
          if (tag.startsWith('app#')) {
            client.tags.delete(tag);
          }
        }

        client.tags.add(`app#${handleAppName}`);

        AppSupervisor.getInstance().bootStrapApp(handleAppName);
      });
    });

    AppSupervisor.getInstance().on('appError', async ({ appName, error }) => {
      this.sendToConnectionsByTag('app', appName, {
        type: 'notification',
        payload: {
          message: error.message,
          type: 'error',
        },
      });
    });

    AppSupervisor.getInstance().on('appMaintainingMessageChanged', async ({ appName, message, command, status }) => {
      const app = await AppSupervisor.getInstance().getApp(appName, {
        withOutBootStrap: true,
      });

      const payload = getPayloadByErrorCode(status, {
        app,
        message,
        command,
      });

      this.sendToConnectionsByTag('app', appName, {
        type: 'maintaining',
        payload,
      });
    });

    AppSupervisor.getInstance().on('appStatusChanged', async ({ appName, status, options }) => {
      const app = await AppSupervisor.getInstance().getApp(appName, {
        withOutBootStrap: true,
      });

      const payload = getPayloadByErrorCode(status, { app, appName });
      this.sendToConnectionsByTag('app', appName, {
        type: 'maintaining',
        payload: {
          ...payload,
          ...options,
        },
      });
    });

    AppSupervisor.getInstance().on('afterAppAdded', (app) => {
      this.bindAppWSEvents(app);
    });
  }

  /**
   * 为应用注册WebSocket事件处理器
   * @param appName 应用名称
   * @param eventType 事件类型 ('message'|'close'|'error')
   * @param handler 事件处理函数
   */
  registerAppEventHandler(
    appName: string,
    eventType: 'message' | 'close' | 'error',
    handler: (...args: any[]) => Promise<void> | void,
  ) {
    if (!this.appEventHandlers.has(appName)) {
      this.appEventHandlers.set(appName, {
        message: [],
        close: [],
        error: [],
      });
    }

    const handlers = this.appEventHandlers.get(appName);
    handlers[eventType].push(handler);
  }

  /**
   * 触发应用级别的事件处理器
   * @param eventType 事件类型
   * @param clientId 客户端ID
   * @param args 附加参数
   */
  private async triggerAppEvent(eventType: 'message' | 'close' | 'error', clientId: string, data?: any) {
    const client = this.webSocketClients.get(clientId);
    if (!client || !client.app) return;

    const appName = client.app;
    const handlers = this.appEventHandlers.get(appName);

    if (!handlers || !handlers[eventType] || handlers[eventType].length === 0) return;

    for (const handler of handlers[eventType]) {
      try {
        if (eventType === 'message') {
          const messageHandler = handler as MessageHandler;
          await messageHandler(clientId, data, appName);
        } else if (eventType === 'error') {
          const errorHandler = handler as ErrorHandler;
          await errorHandler(clientId, data as Error, appName);
        } else {
          const closeHandler = handler as CloseHandler;
          await closeHandler(clientId, appName);
        }
      } catch (error) {
        console.error(`Error in ${appName} ${eventType} handler:`, error);
      }
    }
  }

  /**
   * 清除应用的事件处理器
   * @param appName 应用名称
   */
  clearAppEventHandlers(appName: string) {
    this.appEventHandlers.delete(appName);
  }

  bindAppWSEvents(app) {
    if (app.listenerCount('ws:setTag') > 0) {
      return;
    }

    app.on('ws:setTag', ({ clientId, tagKey, tagValue }) => {
      this.setClientTag(clientId, tagKey, tagValue);
    });

    app.on('ws:removeTag', ({ clientId, tagKey }) => {
      this.removeClientTag(clientId, tagKey);
    });

    app.on('ws:sendToTag', ({ tagKey, tagValue, message }) => {
      this.sendToConnectionsByTags(
        [
          { tagName: tagKey, tagValue },
          { tagName: 'app', tagValue: app.name },
        ],
        message,
      );
    });

    app.on('ws:sendToClient', ({ clientId, message }) => {
      this.sendToClient(clientId, message);
    });

    app.on('ws:sendToCurrentApp', ({ message }) => {
      this.sendToConnectionsByTag('app', app.name, message);
    });

    app.on('ws:sendToTags', ({ tags, message }) => {
      this.sendToConnectionsByTags(tags, message);
    });

    app.on('ws:authorized', ({ clientId, userId }) => {
      this.sendToClient(clientId, { type: 'authorized' });
    });

    // 新增：添加注册WebSocket事件处理器的事件
    app.on('ws:registerEventHandler', ({ eventType, handler }) => {
      this.registerAppEventHandler(app.name, eventType, handler);
    });
  }

  addNewConnection(ws: WebSocketWithId, request: IncomingMessage) {
    const id = nanoid();

    ws.id = id;

    this.webSocketClients.set(id, {
      ws,
      tags: new Set(),
      url: request.url,
      headers: request.headers,
    });

    this.setClientApp(this.webSocketClients.get(id));

    return this.webSocketClients.get(id);
  }

  setClientTag(clientId: string, tagKey: string, tagValue: string) {
    const client = this.webSocketClients.get(clientId);
    if (!client) {
      return;
    }
    client.tags.add(`${tagKey}#${tagValue}`);
    console.log(`client tags: ${Array.from(client.tags)}`);
  }

  removeClientTag(clientId: string, tagKey: string) {
    const client = this.webSocketClients.get(clientId);
    // remove all tags with the given tagKey
    client.tags.forEach((tag) => {
      if (tag.startsWith(`${tagKey}#`)) {
        client.tags.delete(tag);
      }
    });
  }

  /**
   * 设置客户端所属的应用和应用标签
   */
  async setClientApp(client: WebSocketClient) {
    const req: IncomingRequest = {
      url: client.url,
      headers: client.headers,
    };

    const handleAppName = await Gateway.getInstance().getRequestHandleAppName(req);

    // 更新客户端的应用信息
    client.app = handleAppName;
    console.log(`client tags: app#${handleAppName}`);
    client.tags.add(`app#${handleAppName}`);

    const hasApp = AppSupervisor.getInstance().hasApp(handleAppName);

    if (!hasApp) {
      // 引导启动应用
      await AppSupervisor.getInstance().bootStrapApp(handleAppName);
    }

    const appStatus = AppSupervisor.getInstance().getAppStatus(handleAppName, 'initializing');

    if (appStatus === 'not_found') {
      this.sendMessageToConnection(client, {
        type: 'maintaining',
        payload: getPayloadByErrorCode('APP_NOT_FOUND', { appName: handleAppName }),
      });
      return;
    }

    if (appStatus === 'initializing') {
      this.sendMessageToConnection(client, {
        type: 'maintaining',
        payload: getPayloadByErrorCode('APP_INITIALIZING', { appName: handleAppName }),
      });

      return;
    }

    const app = await AppSupervisor.getInstance().getApp(handleAppName);

    // 确保应用已加载后才发送维护状态消息
    this.sendMessageToConnection(client, {
      type: 'maintaining',
      payload: getPayloadByErrorCode(appStatus, { app }),
    });

    // 如果应用正常运行，通知应用有新的WebSocket连接
    if (appStatus === 'running') {
      app.emit('ws:clientConnected', {
        clientId: client.ws.id,
        headers: client.headers,
        url: client.url,
      });
    }
  }

  removeConnection(id: string) {
    console.log(`client disconnected ${id}`);
    this.webSocketClients.delete(id);
  }

  sendMessageToConnection(client: WebSocketClient, sendMessage: object) {
    client.ws.send(JSON.stringify(sendMessage));
  }

  sendToConnectionsByTag(tagName: string, tagValue: string, sendMessage: object) {
    this.loopThroughConnections((client: WebSocketClient) => {
      if (client.tags.has(`${tagName}#${tagValue}`)) {
        this.sendMessageToConnection(client, sendMessage);
      }
    });
  }

  /**
   * Send message to clients that match all the given tag conditions
   * @param tags Array of tag conditions, each condition is an object with tagName and tagValue
   * @param sendMessage Message to be sent
   */
  sendToConnectionsByTags(tags: Array<{ tagName: string; tagValue: string }>, sendMessage: object) {
    this.loopThroughConnections((client: WebSocketClient) => {
      const allTagsMatch = tags.every(({ tagName, tagValue }) => client.tags.has(`${tagName}#${tagValue}`));

      if (allTagsMatch) {
        this.sendMessageToConnection(client, sendMessage);
      }
    });
  }

  sendToClient(clientId: string, sendMessage: object) {
    const client = this.webSocketClients.get(clientId);
    if (client) {
      this.sendMessageToConnection(client, sendMessage);
    }
  }

  loopThroughConnections(callback: (client: WebSocketClient) => void) {
    this.webSocketClients.forEach((client) => {
      callback(client);
    });
  }

  close() {
    this.wss.close();
  }
}

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

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on('connection', (ws: WebSocketWithId, request: IncomingMessage) => {
      const client = this.addNewConnection(ws, request);

      console.log(`new client connected ${ws.id}`);

      ws.on('error', () => {
        this.removeConnection(ws.id);
      });

      ws.on('close', () => {
        this.removeConnection(ws.id);
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

  async setClientApp(client: WebSocketClient) {
    const req: IncomingRequest = {
      url: client.url,
      headers: client.headers,
    };

    const handleAppName = await Gateway.getInstance().getRequestHandleAppName(req);

    client.app = handleAppName;
    console.log(`client tags: app#${handleAppName}`);
    client.tags.add(`app#${handleAppName}`);

    const hasApp = AppSupervisor.getInstance().hasApp(handleAppName);

    if (!hasApp) {
      AppSupervisor.getInstance().bootStrapApp(handleAppName);
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

    this.sendMessageToConnection(client, {
      type: 'maintaining',
      payload: getPayloadByErrorCode(appStatus, { app }),
    });
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

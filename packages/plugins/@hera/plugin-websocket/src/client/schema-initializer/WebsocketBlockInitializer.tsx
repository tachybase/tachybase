import React, { useCallback, useEffect, useState } from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import {
  Application,
  SchemaInitializer,
  SchemaInitializerItem,
  SchemaSettings,
  SchemaToolbar,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useFieldSchema } from '@nocobase/schema';

export class WebsocketBlockHelper {
  constructor(private app: Application) {}
  async load() {
    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.groupBlock', {
      title: 'Websocket',
      Component: 'WebsocketBlockInitializer',
    });
    this.app.schemaSettingsManager.add(websocketBlockSettings);
    this.app.schemaInitializerManager.add(WebsocketActionInitializer);
    this.app.addComponents({
      WebsocketBlockInitializer,
      WebsocketBlockToolbar,
      WebsocketBlock,
    });
    const WebsocketBlockItem = {
      title: 'Websocket',
      name: 'websocketBlock',
      Component: 'WebsocketBlockInitializer',
      type: 'item',
    };
    this.app.schemaInitializerManager.get('popup:common:addBlock').add(WebsocketBlockItem.name, WebsocketBlockItem);
  }
}

const WebsocketBlock: React.FC = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(() => setSocketUrl('wss://demos.kaazing.com/echo'), []);

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <button onClick={handleClickChangeSocketUrl}>Click Me to change Socket Url</button>
      <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Click Me to send Hello
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};

const WebsocketActionInitializer = new SchemaInitializer({
  name: 'WebsocketActionInitializer',
  title: 'Configure actions',
  icon: 'SettingOutlined',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      name: 'enbaleActions',
      type: 'itemGroup',
      title: 'Enable actions',
      children: [],
    },
  ],
});

const WebsocketBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<PrinterOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-toolbar': 'WebsocketBlockToolbar',
          'x-settings': 'websocketBlockSettings',
          'x-component': 'CardItem',
          properties: {
            actions: {
              type: 'void',
              'x-initializer': 'WebsocketActionInitializer',
              'x-component': 'ActionBar',
              'x-component-props': {},
              properties: {},
            },
            viewer: {
              type: 'void',
              'x-component': 'WebsocketBlock',
            },
          },
        });
      }}
    />
  );
};

export const websocketBlockSettings = new SchemaSettings({
  name: 'websocketBlockSettings',
  items: [
    {
      name: 'remove',
      type: 'remove',
    },
  ],
});

export const WebsocketBlockToolbar = (props) => {
  const fieldSchema = useFieldSchema();
  return <SchemaToolbar title={fieldSchema.title} settings={fieldSchema['x-settings']} {...props} />;
};

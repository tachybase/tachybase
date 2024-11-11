import React from 'react';
import {
  Action,
  BlockItem,
  CardItem,
  FormItem,
  Input,
  Plugin,
  SchemaComponent,
  SchemaSettings,
} from '@tachybase/client';

import { createApp } from './src/create-app';

const HomePage = () => {
  return (
    <SchemaComponent
      schema={{
        type: 'void',
        name: 'root',
        'x-component': 'div',
        properties: {
          hello1: {
            name: 'hello',
            type: 'void',
            'x-decorator': 'BlockItem',
            'x-settings': 'mySettings',
            'x-component': 'div',
            'x-content': '这是 BlockItem 的样式',
          },
          hello2: {
            type: 'void',
            'x-decorator': 'CardItem',
            'x-decorator-props': {
              title: '卡片',
              bordered: true,
            },
            'x-settings': 'mySettings',
            'x-component': 'h1',
            'x-content': 'Hello, World!',
          },
          hello3: {
            type: 'void',
            title: '字段',
            'x-decorator': 'FormItem',
            'x-settings': 'mySettings',
            'x-component': 'Input',
          },
          hello4: {
            type: 'void',
            title: '操作',
            'x-settings': 'mySettings',
            'x-component': 'Action',
          },
        },
      }}
    />
  );
};

class PluginDemoToolbar extends Plugin {
  async load() {
    this.app.addComponents({
      HomePage,
      Action,
      CardItem,
      FormItem,
      BlockItem,
      Input,
    });
    const mySettings = new SchemaSettings({
      name: 'mySettings',
      items: [],
    });
    this.schemaSettingsManager.add(mySettings);
  }
}

const app = createApp({ plugins: [PluginDemoToolbar] });

export default app.getRootComponent();

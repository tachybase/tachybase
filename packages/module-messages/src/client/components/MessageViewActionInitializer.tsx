import React from 'react';
import { ActionInitializer } from '@tachybase/client';

import { tval } from '../locale';
import { setMessageUid } from '../MessageProvider';

export const MessageViewActionInitializer = (props) => {
  const schema = {
    type: 'void',
    title: tval('View'),
    'x-action': 'view',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:view',
    'x-component': 'Action',
    'x-component-props': {
      openMode: 'drawer',
    },
    properties: {
      drawer: {
        type: 'void',
        title: tval('View record'),
        'x-component': 'Action.Container',
        'x-component-props': {
          className: 'tb-action-popup',
        },
        properties: {
          tabs: {
            type: 'void',
            'x-component': 'Tabs',
            'x-component-props': {},
            properties: {
              tab1: {
                type: 'void',
                title: tval('Details'),
                'x-component': 'Tabs.TabPane',
                'x-designer': 'Tabs.Designer',
                'x-component-props': {},
                properties: {
                  schemaName: {
                    type: 'void',
                    'x-decorator': 'SchemaComponentContextProvider',
                    'x-decorator-props': {
                      designable: false,
                    },
                    'x-component': 'MessageSchemaComponent',
                    'x-component-props': {
                      noForm: true,
                      refresh: props.refresh,
                    },
                    'x-reactions': `{{ ${setMessageUid.toString()} }}`,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return <ActionInitializer schema={schema} />;
};

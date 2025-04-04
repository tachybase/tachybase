import React from 'react';
import { ActionInitializer } from '@tachybase/client';

export const DuplicateActionInitializer = (props) => {
  const schema = {
    type: 'void',
    'x-action': 'duplicate',
    'x-acl-action': 'create',
    title: '{{ t("Duplicate") }}',
    'x-component': 'Action.Link',
    'x-decorator': 'ACLActionProvider',
    'x-component-props': {
      openMode: 'drawer',
      component: 'DuplicateAction',
    },
    properties: {
      drawer: {
        type: 'void',
        title: '{{ t("Duplicate") }}',
        'x-component': 'Action.Container',
        'x-component-props': {
          className: 'tb-action-popup',
        },
        properties: {
          tabs: {
            type: 'void',
            'x-component': 'Tabs',
            'x-component-props': {},
            'x-initializer': 'popup:addTab',
            properties: {
              tab1: {
                type: 'void',
                title: '{{t("Duplicate")}}',
                'x-component': 'Tabs.TabPane',
                'x-designer': 'Tabs.Designer',
                'x-component-props': {},
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'popup:addNew:addBlock',
                    properties: {},
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};

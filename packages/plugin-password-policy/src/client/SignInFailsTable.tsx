import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { signInFailsCollection } from './collections/signInFails';
import { tval } from './locale';

const table = {
  type: 'void',
  'x-decorator': 'TableBlockProvider',
  'x-acl-action': 'signInFails:list',
  'x-use-decorator-props': 'useTableBlockDecoratorProps',
  'x-decorator-props': {
    dataSource: 'main',
    collection: 'signInFails',
    action: 'list',
    params: {
      pageSize: 20,
      appends: ['user'],
    },
    rowKey: 'id',
    showIndex: true,
    dragSort: false,
  },
  'x-component': 'CardItem',
  properties: {
    actions: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': {
        style: {
          marginBottom: 'var(--tb-spacing)',
        },
      },
      properties: {
        filter: {
          type: 'void',
          title: `{{ t("Filter") }}`,
          'x-action': 'filter',
          'x-component': 'Filter.Action',
          'x-use-component-props': 'useFilterActionProps',
          'x-component-props': {
            icon: 'FilterOutlined',
          },
          'x-align': 'left',
        },
        refresh: {
          type: 'void',
          title: '{{ t("Refresh") }}',
          'x-action': 'refresh',
          'x-component': 'Action',
          'x-settings': 'actionSettings:refresh',
          'x-component-props': {
            icon: 'ReloadOutlined',
          },
          'x-use-component-props': 'useRefreshActionProps',
          'x-align': 'right',
        },
      },
    },
    table: {
      type: 'array',
      'x-component': 'TableV2',
      'x-use-component-props': 'useTableBlockProps',
      'x-component-props': {
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
      },
      properties: {
        username: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            username: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        nickname: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            nickname: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        ip: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'CollectionField',
          properties: {
            ip: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        address: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'CollectionField',
          properties: {
            address: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        createdAt: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'CollectionField',
          properties: {
            createdAt: {
              type: 'datetime',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
      },
    },
  },
};

const schema = {
  type: 'void',
  properties: {
    signInFails: table,
  },
};

export const SignInFailsTable: React.FC = () => {
  return (
    <ExtendCollectionsProvider collections={[signInFailsCollection]}>
      <SchemaComponent schema={schema} />
    </ExtendCollectionsProvider>
  );
};

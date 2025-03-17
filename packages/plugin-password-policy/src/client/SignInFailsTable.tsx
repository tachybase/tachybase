import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { signInFailsCollection } from './collections/signInFails';

const schema = {
  type: 'void',
  properties: {
    block1: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-use-decorator-props': 'useTableBlockDecoratorProps',
      'x-decorator-props': {
        collection: 'signInFails',
        dataSource: 'main',
        action: 'list',
        params: {
          pageSize: 20,
          appends: ['user'],
        },
        rowKey: 'id',
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
              title: '{{ t("Filter") }}',
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
              title: '{{t("Refresh")}}',
              'x-component': 'Action',
              'x-use-component-props': 'useRefreshActionProps',
            },
          },
        },
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'id',
            useProps: '{{ useTableBlockProps }}',
          },
          properties: {
            username: {
              type: 'void',
              'x-decorator': 'TableV2.Column',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
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
              'x-decorator': 'TableV2.Column',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
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
              'x-decorator': 'TableV2.Column',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
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
              'x-decorator': 'TableV2.Column',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
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
              'x-decorator': 'TableV2.Column',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
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
    },
  },
};

export const SignInFailsTable: React.FC = () => {
  return (
    <ExtendCollectionsProvider collections={[signInFailsCollection]}>
      <SchemaComponent schema={schema} />
    </ExtendCollectionsProvider>
  );
};

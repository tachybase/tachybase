import { collectionMultiApp } from '../base/collections/collectionMultiApp';

export const schemaViewMultiAppPane = {
  type: 'void',
  properties: {
    multiApp: {
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: collectionMultiApp,
        action: 'list',
        params: {
          pageSize: 10,
          sort: ['-createdAt'],
          appends: [],
          filter: {
            createdById: '{{ admin ? undefined : userId }}',
          },
        },
        rowKey: 'name',
      },
      properties: {
        actions: {},
        table: {
          type: 'array',
          'x-uid': 'appList',
          'x-component': 'AppList',
          'x-component-props': {},
        },
      },
    },
  },
};

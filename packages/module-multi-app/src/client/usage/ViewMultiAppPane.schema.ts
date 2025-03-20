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
            createdById: '{{ userId }}',
          },
        },
        rowKey: 'name',
      },
      'x-component': 'AppList',
    },
  },
};

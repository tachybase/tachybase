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
          pageSize: 20,
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

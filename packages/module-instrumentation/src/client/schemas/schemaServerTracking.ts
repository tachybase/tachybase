import { ISchema } from '@tachybase/schema';

import { serverTrackingCollection } from '../collections/serverTracking.collection';
import { tval } from '../locale';

// import { createServerTracking } from "./createServerTracking";

export const schemaServerTracking: ISchema = {
  type: 'void',
  properties: {
    serverTracking: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: serverTrackingCollection,
        action: 'list',
        params: {
          filter: {},
          appends: ['user'],
        },
      },
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 16,
            },
          },
          properties: {
            // filter: {
            //   type: 'void',
            //   title: '{{ t("Filter") }}',
            //   'x-action': 'filter',
            //   'x-designer': 'Filter.Action.Designer',
            //   'x-component': 'Filter.Action',
            //   'x-use-component-props': 'useFilterActionProps',
            //   'x-component-props': {
            //     icon: 'FilterOutlined',
            //   },
            //   'x-align': 'left',
            // },
            // refresher: {
            //   type: 'void',
            //   title: '{{ t("Refresh") }}',
            //   'x-action': 'refresh',
            //   'x-component': 'Action',
            //   'x-use-component-props': 'useRefreshActionProps',
            //   'x-designer': 'Action.Designer',
            //   'x-component-props': {
            //     icon: 'ReloadOutlined',
            //   },
            //   'x-align': 'right',
            // },
            // delete: {
            //   type: 'void',
            //   title: '{{ t("Delete") }}',
            //   'x-action': 'destroy',
            //   'x-component': 'Action',
            //   'x-decorator': 'ACLActionProvider',
            //   'x-use-component-props': 'useBulkDestroyActionProps',
            //   'x-component-props': {
            //     icon: 'DeleteOutlined',
            //     confirm: {
            //       title: "{{t('Delete')}}",
            //       content: "{{t('Are you sure you want to delete it?')}}",
            //     },
            //   },
            // },
            // enable: {
            //   type: 'void',
            //   title: '{{ t("Enable") }}',
            //   'x-action': 'update',
            //   'x-decorator': 'ACLActionProvider',
            //   'x-use-component-props': 'useApiLogsConfigEnableProps',
            //   'x-component': 'Action',
            //   'x-component-props': {
            //     icon: 'EditOutlined',
            //   },
            // },
            // disenable: {
            //   type: 'void',
            //   title: tval('Disable'),
            //   'x-action': 'update',
            //   'x-decorator': 'ACLActionProvider',
            //   'x-use-component-props': 'useApiLogsConfigDisenableProps',
            //   'x-component': 'Action',
            //   'x-component-props': {
            //     icon: 'EditOutlined',
            //   },
            // },
            // sync: {
            //   type: 'void',
            //   title: tval('Table sync'),
            //   'x-use-component-props': 'useApiLogsConfigSyncProps',
            //   'x-component': 'Action',
            //   'x-component-props': {
            //     icon: 'VerticalAlignBottomOutlined',
            //   },
            // },
            // create: createServerTrackingConfig,
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
            createdAt: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                createdAt: {
                  type: 'date',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            action: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                action: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            recordId: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                recordId: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            // collection: {
            //   type: 'void',
            //   'x-decorator': 'TableV2.Column.Decorator',
            //   'x-component': 'TableV2.Column',
            //   'x-component-props': {
            //     align: 'center',
            //   },
            //   properties: {
            //     collection: {
            //       type: 'string',
            //       'x-component': 'CollectionField',
            //       'x-read-pretty': true,
            //     },
            //   },
            // },
            collectionName: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                collectionName: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            user: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                user: {
                  type: 'string',
                  'x-collection-field': 'serverTracking.user',
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

import { ISchema } from '@tachybase/schema';

import { serverTrackingConfigCollection } from '../collections/serverTrackingConfig.collection';
import { tval } from '../locale';
import { createServerTrackingConfig } from './createServerTrackingConfig';

export const schemaServerTrackingConfig: ISchema = {
  type: 'void',
  properties: {
    serverTrackingConfig: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: serverTrackingConfigCollection,
        action: 'list',
        params: {
          filter: {},
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
            create: createServerTrackingConfig,
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
            title: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                title: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            resourceName: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                resourceName: {
                  type: 'string',
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
            apiConfig: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                apiConfig: {
                  type: 'boolean',
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

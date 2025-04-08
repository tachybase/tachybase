import { ISchema } from '@tachybase/schema';

import { clientTrackingCollection } from '../collections/instrumentation.collection';
import { NAMESPACE } from '../locale';
import { viewInstrumentation } from './viewInstrumentation';

export const schemaClientTracking: ISchema = {
  type: 'void',
  properties: {
    notificationconfig: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: clientTrackingCollection,
        action: 'list',
        params: {
          pageSize: 50,
          sort: ['-createdAt'],
        },
      },
      title: `{{t("Notification Config", { ns: "${NAMESPACE}" })}}`,
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
            filter: {
              type: 'void',
              title: '{{ t("Filter") }}',
              'x-action': 'filter',
              'x-designer': 'Filter.Action.Designer',
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
              'x-component': 'Action',
              'x-use-component-props': 'useRefreshActionProps',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
            },
            delete: {
              type: 'void',
              title: '{{ t("Delete") }}',
              'x-component': 'Action',
              'x-action': 'destroy',
              'x-decorator': 'ACLActionProvider',
              'x-use-component-props': 'useBulkDestroyActionProps',
              'x-component-props': {
                icon: 'DeleteOutlined',
                confirm: {
                  title: "{{t('Delete')}}",
                  content: "{{t('Are you sure you want to delete it?')}}",
                },
                actionCallback: '{{ dataSourceDeleteCallback }}',
              },
            },
          },
        },
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'key',
            rowSelection: {
              type: 'checkbox',
            },
          },
          properties: {
            id: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
                align: 'left',
              },
              properties: {
                id: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            key: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
                align: 'center',
              },
              properties: {
                key: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            type: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'left',
              },
              properties: {
                type: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    ellipsis: true,
                  },
                  'x-read-pretty': true,
                },
              },
            },
            values: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'left',
              },
              properties: {
                values: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            actions: {
              type: 'void',
              title: '{{t("Actions")}}',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
                align: 'center',
              },
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    view: viewInstrumentation,
                    destroy: {
                      type: 'void',
                      title: '{{ t("Delete") }}',
                      'x-action': 'destroy',
                      'x-decorator': 'ACLActionProvider',
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'useDestroyActionProps',
                      'x-component-props': {
                        icon: 'DeleteOutlined',
                        confirm: {
                          title: "{{t('Delete record')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

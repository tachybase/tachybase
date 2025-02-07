import { tval } from '../locale';
import { collectionCustomEventSources } from './collectionCustomEventSources';

export const schemaManagerPanne = {
  type: 'void',
  properties: {
    managerProvider: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-component': 'CardItem',
      'x-decorator-props': {
        collection: collectionCustomEventSources,
        action: 'list',
        params: {
          filter: {},
          except: ['config'],
          appends: ['workflow', 'uiSchema', 'completeUiSchema'],
        },
        rowKey: 'id',
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
            sync: {
              type: 'void',
              title: tval('Sync'),
              'x-component': 'Action',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
              'x-use-component-props': 'useSyncCustomEventSource',
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
            id: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 10,
                align: 'center',
              },
              properties: {
                id: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            workflow: {
              type: 'void',
              title: '{{t("Workflow", { ns: "workflow" })}}',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 200,
              },
              properties: {
                workflow: {
                  'x-component': 'ColumnWorkflow',
                  'x-read-pretty': true,
                },
              },
            },
            uiSchema: {
              type: 'void',
              title: '{{t("uiSchema", { ns: "workflow" })}}',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 200,
              },
              properties: {
                uiSchema: {
                  'x-component': 'ColumnUISchema',
                  'x-read-pretty': true,
                },
              },
            },
            completeUiSchema: {
              type: 'void',
              title: '{{t("completeUiSchema", { ns: "workflow" })}}',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 200,
              },
              properties: {
                completeUiSchema: {
                  'x-component': 'ColumnUISchema',
                  'x-read-pretty': true,
                },
              },
            },
            collectionName: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                collectionName: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            pathDesc: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                pathDesc: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    style: {
                      overflow: 'scroll',
                    },
                  },
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

import { tval } from '../../locale';

export const schemaTableMessages = {
  type: 'void',
  name: 'schemaTableMessages',
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
          'x-component-props': {
            icon: 'FilterOutlined',
          },
          'x-use-component-props': 'useFilterActionProps',
          'x-align': 'left',
        },
        refresher: {
          type: 'void',
          title: '{{ t("Refresh") }}',
          'x-action': 'refresh',
          'x-component': 'Action',
          'x-use-component-props': 'useRefreshActionProps',
          'x-component-props': {
            icon: 'ReloadOutlined',
          },
          'x-align': 'right',
        },
        delete: {
          type: 'void',
          title: '{{ t("Delete") }}',
          'x-action': 'destroy',
          'x-component': 'Action',
          'x-decorator': 'ACLActionProvider',
          'x-acl-action-props': {
            skipScopeCheck: true,
          },
          'x-use-component-props': 'useBulkDestroyActionProps',
          'x-component-props': {
            icon: 'DeleteOutlined',
            confirm: {
              title: "{{t('Delete record')}}",
              content: "{{t('Are you sure you want to delete it?')}}",
            },
          },
          'x-acl-action': 'messages:destroy',
          'x-align': 'right',
        },
        setHaveReaded: {
          type: 'void',
          title: tval('Mark as read'),
          'x-action': 'customize:bulkUpdate',
          'x-action-settings': {
            assignedValues: {
              read: true,
            },
            updateMode: 'selected',
            onSuccess: {
              manualClose: true,
              redirecting: false,
              successMessage: '{{t("Updated successfully")}}',
            },
          },
          'x-component': 'Action',
          'x-use-component-props': 'useCustomizeBulkUpdateActionProps',
          'x-component-props': {
            icon: 'InboxOutlined',
          },
          'x-align': 'right',
        },
        setAllHaveReaded: {
          type: 'void',
          title: tval('Mark all as read'),
          'x-component': 'Action',
          'x-use-component-props': 'useCustomizeBulkUpdateActionProps',
          'x-component-props': {
            icon: 'InboxOutlined',
          },
          'x-action': 'customize:bulkUpdate',
          'x-action-settings': {
            assignedValues: {
              read: true,
            },
            updateMode: 'all',
            onSuccess: {
              manualClose: true,
              redirecting: false,
              successMessage: '{{t("Updated successfully")}}',
            },
          },
          'x-align': 'right',
        },
      },
    },
    table: {
      type: 'array',
      'x-component': 'TableV2',
      'x-use-component-props': 'useTableBlockProps',
      'x-use-decorator-props': 'useTableBlockDecoratorProps',
      'x-component-props': {
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
        },
      },
      properties: {
        actions: {
          type: 'void',
          title: '{{ t("Actions") }}',
          'x-action-column': 'actions',
          'x-decorator': 'TableV2.Column.ActionBar',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 50,
            align: 'center',
          },
          'x-designer': 'TableV2.ActionColumnDesigner',
          'x-initializer': 'MessageTable:configureItemActions',
          properties: {
            actionList: {
              type: 'void',
              'x-decorator': 'DndContext',
              'x-component': 'Space',
              'x-component-props': {
                split: '|',
              },
              properties: {
                checkLink: {
                  'x-component': 'ViewCheckLink',
                },
                delete: {
                  'x-component': 'ViewDeleteLink',
                },
              },
            },
          },
        },
        read: {
          type: 'void',
          title: tval('Read'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 20,
            align: 'center',
          },
          properties: {
            read: {
              type: 'boolean',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
              'x-component-props': {
                showUnchecked: true,
              },
            },
          },
        },
        createdAt: {
          type: 'void',
          title: tval('Created at'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 100,
            align: 'center',
          },
          properties: {
            createdAt: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        title: {
          type: 'void',
          title: tval('Title'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 100,
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
        content: {
          type: 'void',
          title: tval('Content'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 100,
            align: 'center',
          },
          properties: {
            content: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        jsonContent: {
          type: 'void',
          title: tval('Summary'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 350,
            align: 'center',
          },
          properties: {
            jsonContent: {
              type: 'string',
              'x-component': 'ColumnShowJSON',
            },
          },
        },
        url: {
          type: 'void',
          title: tval('URL'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 100,
            align: 'center',
          },
          properties: {
            url: {
              type: 'string',
              'x-component': 'ColumnShowURL',
            },
          },
        },
      },
    },
  },
};

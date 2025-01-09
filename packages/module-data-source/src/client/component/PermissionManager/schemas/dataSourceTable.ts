import { ISchema } from '@tachybase/schema';

import { roleCollectionsSchema } from './roleCollections';

const collection = {
  name: 'dataSources',
  filterTargetKey: 'name',
  targetKey: 'name',
  fields: [
    {
      type: 'string',
      name: 'displayName',
      interface: 'input',
      uiSchema: {
        title: '{{t("Display name")}}',
        type: 'number',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'key',
      interface: 'input',
      uiSchema: {
        title: '{{t("Name")}}',
        type: 'number',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
  ],
};

export const view: ISchema = {
  type: 'void',
  title: '{{t("Configure")}}',
  'x-component': 'Action.Link',
  'x-decorator': 'ACLActionProvider',
  'x-acl-action': 'roles:update',
  'x-component-props': {},
  properties: {
    drawer: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'PermissionProvider',
      title: '{{t("Configure permissions")}}',
      properties: {
        tabs1: {
          type: 'void',
          'x-component': 'Tabs',
          'x-component-props': {},
          properties: {
            tab1: {
              type: 'void',
              title: '{{t("General action permissions")}}',
              'x-component': 'Tabs.TabPane',
              'x-component-props': {},
              properties: {
                role: {
                  'x-component': 'RoleConfigure',
                },
              },
            },
            tab2: {
              type: 'void',
              title: '{{t("Action permissions")}}',
              'x-component': 'Tabs.TabPane',
              'x-component-props': {},
              properties: {
                roleCollectionsSchema,
              },
            },
          },
        },
      },
    },
  },
};

export const dataSourceSchema: ISchema = {
  type: 'void',
  properties: {
    block1: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-component': 'CardItem',
      'x-decorator-props': {
        collection,
        action: 'list',
        params: {
          pageSize: 50,
          showAnonymous: true,
          appends: [],
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
          properties: {},
        },
        table: {
          type: 'array',
          'x-uid': 'input',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'name',
            rowSelection: {
              type: 'checkbox',
            },
          },
          properties: {
            column1: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                displayName: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            column2: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                key: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            column4: {
              type: 'void',
              title: '{{t("Actions")}}',
              'x-component': 'TableV2.Column',
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    view,
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

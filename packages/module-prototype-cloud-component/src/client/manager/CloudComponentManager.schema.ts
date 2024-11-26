import { fieldsets } from './CloudComponentManager.fields';
import SplitEditor from './SplitEditor';

const create = {
  type: 'void',
  'x-action': 'create',
  'x-acl-action': 'create',
  title: "{{t('Add new')}}",
  'x-component': 'Action',
  'x-decorator': 'ACLActionProvider',
  'x-component-props': {
    openMode: 'sheet',
    type: 'primary',
    component: 'CreateRecordAction',
    icon: 'PlusOutlined',
  },
  'x-align': 'right',
  'x-acl-action-props': {
    skipScopeCheck: true,
  },
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Add record") }}',
      'x-component': 'Action.Container',
      'x-component-props': {
        className: 'tb-action-popup',
      },
      properties: {
        card: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: true,
          },
          'x-acl-action': 'cloudComponents:create',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
          'x-decorator-props': {
            dataSource: 'main',
            collection: 'cloudComponents',
          },
          'x-component': 'CardItem',
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useCreateFormBlockProps',
              properties: {
                editor: {
                  type: 'void',
                  'x-component': 'FormTab',
                  properties: {
                    actions: {
                      type: 'void',
                      'x-component': 'FormTab.TabExtraContent',
                      properties: {
                        submit: {
                          title: '{{ t("Submit") }}',
                          'x-action': 'submit',
                          'x-component': 'Action',
                          'x-use-component-props': 'useCreateActionProps',
                          'x-component-props': {
                            type: 'primary',
                            htmlType: 'submit',
                          },
                          type: 'void',
                        },
                      },
                    },
                    name: {
                      type: 'void',
                      'x-component': 'FormTab.TabPane',
                      'x-component-props': {
                        tab: 'name',
                      },
                      properties: {
                        name: fieldsets.name,
                      },
                    },
                    code: {
                      type: 'void',
                      'x-component': 'FormTab.TabPane',
                      'x-component-props': {
                        tab: 'code',
                      },
                      properties: {
                        code: fieldsets.code,
                      },
                    },
                    data: {
                      type: 'void',
                      'x-component': 'FormTab.TabPane',
                      'x-component-props': {
                        tab: 'data',
                      },
                      properties: {
                        data: fieldsets.data,
                      },
                    },
                    description: {
                      type: 'void',
                      'x-component': 'FormTab.TabPane',
                      'x-component-props': {
                        tab: 'description',
                      },
                      properties: {
                        description: fieldsets.description,
                      },
                    },
                  },
                },
                // ...fieldsets,
              },
            },
          },
        },
      },
    },
  },
};
const edit = {
  type: 'void',
  title: '{{ t("Edit") }}',
  'x-action': 'update',
  'x-component': 'Action.Link',
  'x-component-props': {
    openMode: 'sheet',
    icon: 'EditOutlined',
  },
  'x-decorator': 'ACLActionProvider',
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Edit record") }}',
      'x-component': 'Action.Container',
      'x-component-props': {
        className: 'tb-action-popup',
      },
      properties: {
        card: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: false,
          },
          'x-acl-action': 'cloudComponents:update',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: 'cloudComponents',
          },
          'x-component': 'CardItem',
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useEditFormBlockProps',
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
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-action': 'submit',
                      'x-component': 'Action',
                      'x-use-component-props': 'useUpdateActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                      type: 'void',
                    },
                  },
                },
                ...fieldsets,
              },
            },
          },
        },
      },
    },
  },
};
export const table = {
  type: 'void',
  'x-decorator': 'TableBlockProvider',
  'x-acl-action': 'cloudComponents:list',
  'x-use-decorator-props': 'useTableBlockDecoratorProps',
  'x-decorator-props': {
    collection: 'cloudComponents',
    dataSource: 'main',
    action: 'list',
    params: {
      pageSize: 20,
    },
    rowKey: 'id',
    showIndex: true,
    dragSort: false,
  },
  'x-component': 'CardItem',
  'x-filter-targets': [],
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
        create,
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
        actions: {
          type: 'void',
          title: '{{ t("Actions") }}',
          'x-action-column': 'actions',
          'x-decorator': 'TableV2.Column.ActionBar',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 100,
            fixed: 'right',
          },
          properties: {
            actions: {
              type: 'void',
              'x-component': 'Space',
              properties: {
                edit,
              },
            },
          },
        },
        name: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            name: {
              'x-collection-field': 'cloudComponents.name',
              'x-component': 'CollectionField',
              'x-component-props': {
                ellipsis: true,
              },
              'x-read-pretty': true,
              'x-decorator': null,
              'x-decorator-props': {
                labelStyle: {
                  display: 'none',
                },
              },
            },
          },
        },
        // code: {
        //   type: 'void',
        //   'x-decorator': 'TableV2.Column.Decorator',
        //   'x-toolbar': 'TableColumnSchemaToolbar',
        //   'x-settings': 'fieldSettings:TableColumn',
        //   'x-component': 'TableV2.Column',
        //   properties: {
        //     code: {
        //       'x-collection-field': 'cloudComponents.code',
        //       'x-component': 'CollectionField',
        //       'x-component-props': {
        //         ellipsis: true,
        //       },
        //       'x-read-pretty': true,
        //       'x-decorator': null,
        //       'x-decorator-props': {
        //         labelStyle: {
        //           display: 'none',
        //         },
        //       },
        //     },
        //   },
        // },
        // data: {
        //   type: 'void',
        //   'x-decorator': 'TableV2.Column.Decorator',
        //   'x-toolbar': 'TableColumnSchemaToolbar',
        //   'x-settings': 'fieldSettings:TableColumn',
        //   'x-component': 'TableV2.Column',
        //   properties: {
        //     data: {
        //       'x-collection-field': 'cloudComponents.data',
        //       'x-component': 'CollectionField',
        //       'x-component-props': {},
        //       'x-read-pretty': true,
        //       'x-decorator': null,
        //       'x-decorator-props': {
        //         labelStyle: {
        //           display: 'none',
        //         },
        //       },
        //     },
        //   },
        // },
        // description: {
        //   type: 'void',
        //   'x-decorator': 'TableV2.Column.Decorator',
        //   'x-toolbar': 'TableColumnSchemaToolbar',
        //   'x-settings': 'fieldSettings:TableColumn',
        //   'x-component': 'TableV2.Column',
        //   properties: {
        //     description: {
        //       'x-collection-field': 'cloudComponents.description',
        //       'x-component': 'CollectionField',
        //       'x-component-props': {
        //         ellipsis: true,
        //       },
        //       'x-read-pretty': true,
        //       'x-decorator': null,
        //       'x-decorator-props': {
        //         labelStyle: {
        //           display: 'none',
        //         },
        //       },
        //     },
        //   },
        // },
        enabled: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            enabled: {
              'x-collection-field': 'cloudComponents.enabled',
              'x-component': 'CollectionField',
              'x-component-props': {
                ellipsis: true,
              },
              'x-read-pretty': true,
              'x-decorator': null,
              'x-decorator-props': {
                labelStyle: {
                  display: 'none',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'void',
  properties: {
    table,
  },
};

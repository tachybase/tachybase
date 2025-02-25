import { uid } from '@tachybase/schema';

import { tval } from './locale';

export const createSchema = () => {
  const filterSchema = {
    'x-component': 'Action',
    'x-component-props': {
      popover: true,
    },
    type: 'void',
    title: tval('Filter'),
    properties: {
      popover: {
        type: 'void',
        'x-decorator': 'Form',
        'x-decorator-props': {},
        'x-component': 'Action.Popover',
        'x-component-props': {
          trigger: 'click',
          placement: 'bottomLeft',
        },
        properties: {
          filter: {
            type: 'object',
            default: {
              $and: [{}],
            },
            'x-component': 'Filter',
            'x-component-props': {
              useDataSource: '{{cm.useFilterDataSource}}',
            },
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Popover.Footer',
            properties: {
              actions: {
                type: 'void',
                'x-component': 'ActionBar',
                properties: {
                  saveDefault: {
                    type: 'void',
                    'x-component': 'Filter.SaveDefaultValue',
                    'x-component-props': {},
                  },
                  cancel: {
                    type: 'void',
                    title: tval('Cancel'),
                    'x-component': 'Action',
                    'x-component-props': {
                      useAction: '{{cm.useCancelFilterAction}}',
                    },
                  },
                  submit: {
                    type: 'void',
                    title: tval('Submit'),
                    'x-component': 'Action',
                    'x-component-props': {
                      type: 'primary',
                      useAction: '{{cm.useFilterAction}}',
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
  const schema = {
    type: 'void',
    name: 'actionLog',
    'x-decorator': 'ResourceActionProvider',
    'x-decorator-props': {
      collection: 'action_logs',
      dragSort: false,
      request: {
        resource: 'action_logs',
        action: 'list',
        params: {
          pageSize: 20,
          filter: {},
          appends: [],
        },
      },
    },
    'x-designer': 'ActionLog.Designer',
    'x-component': 'CardItem',
    properties: {
      actions: {
        type: 'void',
        'x-component': 'ActionBar',
        'x-component-props': {
          layout: 'one-column',
          style: {
            marginBottom: 16,
          },
        },
        properties: {
          [uid()]: { ...filterSchema },
        },
      },
      table: {
        type: 'void',
        'x-component': 'Table.Void',
        'x-component-props': {
          rowKey: 'id',
          useDataSource: '{{cm.useDataSourceFromRAC}}',
        },
        properties: {
          column1: {
            type: 'void',
            title: tval('Created at'),
            'x-component': 'Table.Column',
            properties: {
              created_at: {
                type: 'string',
                'x-component': 'DatePicker',
                'x-read-pretty': true,
                'x-component-props': {
                  format: 'YYYY-MM-DD HH:mm:ss',
                },
              },
            },
          },
          column2: {
            type: 'void',
            title: tval('Created by'),
            'x-component': 'Table.Column',
            properties: {
              'user.nickname': {
                type: 'string',
                'x-component': 'Input',
                'x-read-pretty': true,
              },
            },
          },
          column3: {
            type: 'void',
            title: tval('Collection display name'),
            'x-component': 'Table.Column',
            properties: {
              'collection.title': {
                type: 'string',
                'x-component': 'Input',
                'x-read-pretty': true,
              },
            },
          },
          column4: {
            type: 'void',
            title: tval('Action type'),
            'x-component': 'Table.Column',
            properties: {
              type: {
                type: 'string',
                'x-component': 'Select',
                'x-read-pretty': true,
                enum: [
                  { label: tval('Add new'), value: 'create', color: 'green' },
                  { label: tval('Update'), value: 'update', color: 'blue' },
                  { label: tval('Delete'), value: 'destroy', color: 'red' },
                ],
              },
            },
          },
          [uid()]: {
            type: 'void',
            title: tval('Actions'),
            'x-component': 'Table.Column',
            'x-component-props': {
              width: 60,
              align: 'center',
            },
            properties: {
              [uid()]: {
                title: tval('View'),
                type: 'void',
                'x-action': 'view',
                'x-component': 'Action.Link',
                'x-component-props': {
                  openMode: 'drawer',
                },
                properties: {
                  drawer: {
                    type: 'void',
                    'x-component': 'Action.Container',
                    'x-component-props': {
                      className: 'tb-action-popup',
                    },
                    title: tval('View record'),
                    properties: {
                      created_at: {
                        type: 'string',
                        title: tval('Created at'),
                        'x-decorator': 'FormItem',
                        'x-component': 'DatePicker',
                        'x-read-pretty': true,
                        'x-component-props': {
                          format: 'YYYY-MM-DD HH:mm:ss',
                        },
                      },
                      'user.nickname': {
                        type: 'string',
                        title: tval('Created by'),
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-read-pretty': true,
                      },
                      'collection.title': {
                        type: 'string',
                        title: tval('Collection display name'),
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-read-pretty': true,
                      },
                      type: {
                        type: 'string',
                        title: tval('Action type'),
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-read-pretty': true,
                        enum: [
                          {
                            label: tval('Insert'),
                            value: 'create',
                            color: 'green',
                          },
                          {
                            label: tval('Update'),
                            value: 'update',
                            color: 'blue',
                          },
                          {
                            label: tval('Delete'),
                            value: 'destroy',
                            color: 'red',
                          },
                        ],
                      },
                      changes: {
                        type: 'array',
                        title: tval('Data changes'),
                        'x-decorator': 'FormItem',
                        'x-component': 'Table.Array',
                        'x-component-props': {
                          pagination: false,
                          showIndex: true,
                        },
                        items: {
                          type: 'object',
                          properties: {
                            column1: {
                              type: 'void',
                              'x-component': 'Table.Column',
                              'x-component-props': { title: tval('Field display name') },
                              properties: {
                                field: {
                                  type: 'string',
                                  'x-decorator': 'FormilyFormItem',
                                  'x-component': 'ActionLog.Field',
                                },
                              },
                            },
                            column2: {
                              type: 'void',
                              'x-component': 'Table.Column',
                              'x-component-props': { title: tval('Before change') },
                              properties: {
                                before: {
                                  type: 'string',
                                  'x-decorator': 'FormilyFormItem',
                                  'x-component': 'ActionLog.FieldValue',
                                },
                              },
                            },
                            column3: {
                              type: 'void',
                              'x-component': 'Table.Column',
                              'x-component-props': { title: tval('After change') },
                              properties: {
                                after: {
                                  type: 'string',
                                  'x-decorator': 'FormilyFormItem',
                                  'x-component': 'ActionLog.FieldValue',
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
        },
      },
    },
  };
  return schema;
};

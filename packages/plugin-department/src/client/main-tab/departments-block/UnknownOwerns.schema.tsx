export const schemaUnknownOwerns = {
  type: 'void',
  properties: {
    drawer: {
      title: '{{t("Select Owners")}}',
      'x-component': 'Action.Drawer',
      properties: {
        resource: {
          type: 'void',
          'x-decorator': 'FormItem',
          'x-component': 'RequestProvider',
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
                  default: {
                    $and: [
                      {
                        username: {
                          $includes: '',
                        },
                      },
                      {
                        nickname: {
                          $includes: '',
                        },
                      },
                    ],
                  },
                  'x-action': 'filter',
                  'x-component': 'Filter.Action',
                  'x-use-component-props': 'useFilterActionProps',
                  'x-component-props': {
                    icon: 'FilterOutlined',
                  },
                  'x-align': 'left',
                },
              },
            },
            table: {
              type: 'void',
              'x-component': 'Table.Void',
              'x-component-props': {
                rowKey: 'id',
                rowSelection: {
                  type: 'checkbox',
                  onChange: '{{ handleSelect }}',
                },
                useDataSource: '{{ cm.useDataSourceFromRAC }}',
              },
              properties: {
                username: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: {
                    username: {
                      type: 'string',
                      'x-component': 'CollectionField',
                      'x-read-pretty': true,
                    },
                  },
                },
                nickname: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: {
                    nickname: {
                      type: 'string',
                      'x-component': 'CollectionField',
                      'x-read-pretty': true,
                    },
                  },
                },
                phone: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: {
                    phone: {
                      type: 'string',
                      'x-component': 'CollectionField',
                      'x-read-pretty': true,
                    },
                  },
                },
                email: {
                  type: 'void',
                  'x-decorator': 'Table.Column.Decorator',
                  'x-component': 'Table.Column',
                  properties: {
                    email: {
                      type: 'string',
                      'x-component': 'CollectionField',
                      'x-read-pretty': true,
                    },
                  },
                },
              },
            },
          },
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Drawer.Footer',
          properties: {
            cancel: {
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': {
                useAction: '{{ cm.useCancelAction }}',
              },
            },
            confirm: {
              title: '{{t("Confirm")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useSelectOwners }}',
              },
            },
          },
        },
      },
    },
  },
};

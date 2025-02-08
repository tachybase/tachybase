export const schemaUnknownOwerns = {
  type: 'void',
  properties: {
    drawer: {
      title: '{{t("Select Owners")}}',
      'x-component': 'Action.Drawer',
      properties: {
        resource: {
          type: 'void',
          'x-decorator': 'ownersTableBlockProvider',
          'x-component': 'CardItem',
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
                  'x-use-component-props': 'useOwnersFilterActionProps',
                  'x-component-props': {
                    icon: 'FilterOutlined',
                  },
                  'x-align': 'left',
                },
                cancel: {
                  title: '{{ t("Cancel") }}',
                  'x-component': 'Action',
                  'x-use-component-props': 'useCancelActionProps',
                },
                submit: {
                  title: '{{ t("Submit") }}',
                  'x-component': 'Action',
                  'x-use-component-props': 'useSelectOwners',
                  'x-component-props': {
                    type: 'primary',
                  },
                },
              },
            },
            table: {
              type: 'array',
              'x-component': 'TableV2',
              'x-use-component-props': 'useOwnersTableBlockProps',
              'x-component-props': {
                rowKey: 'id',
                rowSelection: {
                  type: 'checkbox',
                  // onChange: '{{ handleSelect }}',
                },
                onRowSelectionChange: '{{ handleSelect }}',
                // useDataSource: '{{ cm.useDataSourceFromRAC }}',
              },
              properties: {
                username: {
                  type: 'void',
                  'x-decorator': 'TableV2.Column.Decorator',
                  'x-component': 'TableV2.Column',
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
                  'x-decorator': 'TableV2.Column.Decorator',
                  'x-component': 'TableV2.Column',
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
                  'x-decorator': 'TableV2.Column.Decorator',
                  'x-component': 'TableV2.Column',
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
                  'x-decorator': 'TableV2.Column.Decorator',
                  'x-component': 'TableV2.Column',
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
        // footer: {
        //   type: 'void',
        //   'x-component': 'Action.Drawer.Footer',
        //   properties: {
        //     cancel: {
        //       title: '{{t("Cancel")}}',
        //       'x-component': 'Action',
        //       'x-component-props': {
        //         useAction: '{{ cm.useCancelAction }}',
        //       },
        //     },
        //     confirm: {
        //       title: '{{t("Confirm")}}',
        //       'x-component': 'Action',
        //       'x-component-props': {
        //         type: 'primary',
        //         useAction: '{{ useSelectOwners }}',
        //       },
        //     },
        //   },
        // },
      },
    },
  },
};

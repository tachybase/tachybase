import React from 'react';
import { uid } from '@tachybase/schema';

export const getSchemaHe = (department, user) => {
  const schemaNotUser = user
    ? {}
    : {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 16,
            },
          },
          properties: {
            [uid()]: {
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
            actions: {
              type: 'void',
              'x-component': 'MemberActions',
            },
          },
        },
      };
  const tableSchemaDepartMent = department
    ? {
        isOwner: {
          type: 'void',
          'x-decorator': 'Table.Column.Decorator',
          'x-component': 'Table.Column',
          'x-component-props': { style: { minWidth: 100 } },
          title: '{{t("Owner")}}',
          properties: {
            isOwner: {
              type: 'boolean',
              'x-component': 'IsOwnerField',
            },
          },
        },
      }
    : {};

  const schemaActions = department
    ? {
        remove: {
          type: 'void',
          'x-component': 'RowRemoveAction',
        },
      }
    : {};

  return {
    type: 'void',
    properties: {
      ...schemaNotUser,
      table: {
        type: 'void',
        'x-component': 'Table.Void',
        'x-component-props': {
          rowKey: 'id',
          rowSelection: {
            type: 'checkbox',
          },
          useDataSource: '{{ useMembersDataSource }}',
          pagination: {
            showTotal: '{{ useShowTotal }}',
          },
        },
        properties: {
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
          departments: {
            type: 'void',
            'x-decorator': 'Table.Column.Decorator',
            'x-component': 'Table.Column',
            properties: {
              departments: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
            },
          },
          ...tableSchemaDepartMent,
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
          actions: {
            type: 'void',
            title: '{{t("Actions")}}',
            'x-component': 'Table.Column',
            properties: {
              actions: {
                type: 'void',
                'x-component': 'Space',
                'x-component-props': { split: '|' },
                properties: {
                  update: {
                    type: 'void',
                    title: '{{t("Configure")}}',
                    'x-component': 'Action.Link',
                    'x-component-props': { type: 'primary' },
                    properties: {
                      drawer: {
                        type: 'void',
                        'x-component': 'Action.Drawer',
                        'x-decorator': 'FormV2',
                        title: '{{t("Configure")}}',
                        properties: {
                          departments: {
                            title: '{{t("Departments")}}',
                            'x-decorator': 'FormItem',
                            'x-component': 'UserDepartmentsField',
                          },
                        },
                      },
                    },
                  },
                  ...schemaActions,
                },
              },
            },
          },
        },
      },
    },
  };

  // return {
  //   type: 'void',
  //   properties: T(
  //     y(
  //       {},
  //       user
  //         ? {}
  //         : {
  //             actions: {
  //               type: 'void',
  //               'x-component': 'ActionBar',
  //               'x-component-props': {
  //                 style: {
  //                   marginBottom: 16,
  //                 },
  //               },
  //               properties: {
  //                 [uid()]: {
  //                   type: 'void',
  //                   title: '{{ t("Filter") }}',
  //                   'x-action': 'filter',
  //                   'x-component': 'Filter.Action',
  //                   'x-use-component-props': 'useFilterActionProps',
  //                   'x-component-props': {
  //                     icon: 'FilterOutlined',
  //                   },
  //                   'x-align': 'left',
  //                 },
  //                 actions: {
  //                   type: 'void',
  //                   'x-component': 'MemberActions',
  //                 },
  //               },
  //             },
  //           },
  //     ),
  //     {
  //       table: {
  //         type: 'void',
  //         'x-component': 'Table.Void',
  //         'x-component-props': {
  //           rowKey: 'id',
  //           rowSelection: { type: 'checkbox' },
  //           useDataSource: '{{ useMembersDataSource }}',
  //           pagination: { showTotal: '{{ useShowTotal }}' },
  //         },
  //         properties: T(
  //           y(
  //             {
  //               nickname: {
  //                 type: 'void',
  //                 'x-decorator': 'Table.Column.Decorator',
  //                 'x-component': 'Table.Column',
  //                 properties: { nickname: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
  //               },
  //               username: {
  //                 type: 'void',
  //                 'x-decorator': 'Table.Column.Decorator',
  //                 'x-component': 'Table.Column',
  //                 properties: { username: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
  //               },
  //               departments: {
  //                 type: 'void',
  //                 'x-decorator': 'Table.Column.Decorator',
  //                 'x-component': 'Table.Column',
  //                 properties: {
  //                   departments: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true },
  //                 },
  //               },
  //             },
  //             department
  //               ? {
  //                   isOwner: {
  //                     type: 'void',
  //                     'x-decorator': 'Table.Column.Decorator',
  //                     'x-component': 'Table.Column',
  //                     'x-component-props': { style: { minWidth: 100 } },
  //                     title: '{{t("Owner")}}',
  //                     properties: { isOwner: { type: 'boolean', 'x-component': 'IsOwnerField' } },
  //                   },
  //                 }
  //               : {},
  //           ),
  //           {
  //             phone: {
  //               type: 'void',
  //               'x-decorator': 'Table.Column.Decorator',
  //               'x-component': 'Table.Column',
  //               properties: { phone: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
  //             },
  //             email: {
  //               type: 'void',
  //               'x-decorator': 'Table.Column.Decorator',
  //               'x-component': 'Table.Column',
  //               properties: { email: { type: 'string', 'x-component': 'CollectionField', 'x-read-pretty': true } },
  //             },
  //             actions: {
  //               type: 'void',
  //               title: '{{t("Actions")}}',
  //               'x-component': 'Table.Column',
  //               properties: {
  //                 actions: {
  //                   type: 'void',
  //                   'x-component': 'Space',
  //                   'x-component-props': { split: '|' },
  //                   properties: y(
  //                     {
  //                       update: {
  //                         type: 'void',
  //                         title: '{{t("Configure")}}',
  //                         'x-component': 'Action.Link',
  //                         'x-component-props': { type: 'primary' },
  //                         properties: {
  //                           drawer: {
  //                             type: 'void',
  //                             'x-component': 'Action.Drawer',
  //                             'x-decorator': 'FormV2',
  //                             title: '{{t("Configure")}}',
  //                             properties: {
  //                               departments: {
  //                                 title: '{{t("Departments")}}',
  //                                 'x-decorator': 'FormItem',
  //                                 'x-component': 'UserDepartmentsField',
  //                               },
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                     department ? { remove: { type: 'void', 'x-component': 'RowRemoveAction' } } : {},
  //                   ),
  //                 },
  //               },
  //             },
  //           },
  //         ),
  //       },
  //     },
  //   ),

  //   // properties: {

  //   // }
  // };
};

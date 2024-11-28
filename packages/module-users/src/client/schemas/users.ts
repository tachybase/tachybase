import { useEffect } from 'react';
import { useActionContext, useCollectionRecord, useRecord, useRequest } from '@tachybase/client';
import { ISchema, uid } from '@tachybase/schema';

export const userCollection = {
  name: 'users',
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: { type: 'number', title: '{{t("ID")}}', 'x-component': 'InputNumber', 'x-read-pretty': true },
      interface: 'id',
    },
    {
      interface: 'input',
      type: 'string',
      name: 'nickname',
      uiSchema: {
        type: 'string',
        title: '{{t("Nickname")}}',
        'x-component': 'Input',
      },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'username',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Username")}}',
        'x-component': 'Input',
        'x-validator': { username: true },
        required: true,
      },
    },
    {
      interface: 'email',
      type: 'string',
      name: 'email',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Email")}}',
        'x-component': 'Input',
        'x-validator': 'email',
        required: true,
      },
    },
    {
      interface: 'phone',
      type: 'string',
      name: 'phone',
      unique: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Phone")}}',
        'x-component': 'Input',
        'x-validator': 'phone',
        required: true,
      },
    },
    {
      interface: 'password',
      type: 'password',
      name: 'password',
      hidden: true,
      uiSchema: {
        type: 'string',
        title: '{{t("Password")}}',
        'x-component': 'Password',
      },
    },
    {
      interface: 'm2m',
      type: 'belongsToMany',
      name: 'roles',
      target: 'roles',
      foreignKey: 'userId',
      otherKey: 'roleName',
      onDelete: 'CASCADE',
      sourceKey: 'id',
      targetKey: 'name',
      through: 'rolesUsers',
      uiSchema: {
        type: 'array',
        title: '{{t("Roles")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'title',
            value: 'name',
          },
        },
      },
    },
    // {
    //   name: 'departments',
    //   type: 'belongsToMany',
    //   interface: 'm2m',
    //   target: 'departments',
    //   foreignKey: 'userId',
    //   otherKey: 'departmentId',
    //   onDelete: 'CASCADE',
    //   sourceKey: 'id',
    //   targetKey: 'id',
    //   through: 'departmentsUsers',
    //   uiSchema: {
    //     type: 'array',
    //     title: '{{t("Departments")}}',
    //     'x-component': 'DepartmentField',
    //   },
    // },
  ],
};

export const userFieldset = {
  nickname: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  username: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  email: {
    title: '{{t("Email")}}',
    'x-component': 'Input',
    'x-validator': 'email',
    'x-decorator': 'FormItem',
    required: false,
  },
  phone: {
    title: '{{t("Phone")}}',
    'x-component': 'Input',
    'x-validator': 'phone',
    'x-decorator': 'FormItem',
    required: false,
  },
  password: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    required: true,
  },
  roles: {
    'x-component': 'CollectionField',
    'x-collection-field': 'users.roles',
    'x-decorator': 'FormItem',
  },
};

const create: ISchema = {
  type: 'void',
  'x-action': 'create',
  'x-acl-action': 'create',
  title: "{{t('Add new')}}",
  'x-component': 'Action',
  'x-decorator': 'ACLActionProvider',
  'x-component-props': {
    openMode: 'drawer',
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
      properties: {
        body: {
          type: 'void',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
          'x-decorator-props': {
            dataSource: 'main',
            collection: userCollection,
          },
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useCreateFormBlockProps',
              properties: {
                actionBar: {
                  type: 'void',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 24,
                    },
                  },
                  properties: {
                    cancel: {
                      title: '{{ t("Cancel") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useCancelActionProps',
                    },
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useCreateActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                      'x-action-settings': {
                        assignedValues: {},
                      },
                    },
                  },
                },
                nickname: userFieldset.nickname,
                username: userFieldset.username,
                email: userFieldset.email,
                phone: userFieldset.phone,
                password: userFieldset.password,
                roles: userFieldset.roles,
              },
            },
          },
        },
      },
    },
  },
};

export const update: ISchema = {
  type: 'void',
  title: '{{ t("Edit profile") }}',
  'x-action': 'update',
  'x-component': 'Action.Link',
  'x-component-props': {
    openMode: 'drawer',
    icon: 'EditOutlined',
  },
  'x-decorator': 'ACLActionProvider',
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Edit profile") }}',
      'x-component': 'Action.Container',
      properties: {
        card: {
          type: 'void',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: userCollection,
          },
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useEditFormBlockProps',
              properties: {
                actionBar: {
                  type: 'void',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 24,
                    },
                  },
                  properties: {
                    cancel: {
                      title: '{{ t("Cancel") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useCancelActionProps',
                    },
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useUpdateActionProps',
                      'x-component-props': {
                        type: 'primary',
                      },
                    },
                  },
                },
                nickname: userFieldset.nickname,
                username: userFieldset.username,
                email: userFieldset.email,
                phone: userFieldset.phone,
                roles: userFieldset.roles,
              },
            },
          },
        },
      },
    },
  },
};

export const changePassword: ISchema = {
  type: 'void',
  title: '{{ t("Change password") }}',
  'x-action': 'update',
  'x-component': 'Action.Link',
  'x-component-props': {
    openMode: 'drawer',
    icon: 'EditOutlined',
  },
  'x-decorator': 'ACLActionProvider',
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Change password") }}',
      'x-component': 'Action.Container',
      properties: {
        card: {
          type: 'void',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: userCollection,
          },
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useEditFormBlockProps',
              properties: {
                actionBar: {
                  type: 'void',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 24,
                    },
                  },
                  properties: {
                    cancel: {
                      title: '{{ t("Cancel") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useCancelActionProps',
                    },
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useUpdateActionProps',
                      'x-component-props': {
                        type: 'primary',
                      },
                    },
                  },
                },
                password: {
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    component: 'PasswordField',
                  },
                  'x-decorator': 'FormItem',
                  required: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export const usersSchema: ISchema = {
  type: 'void',
  properties: {
    block1: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-component': 'CardItem',
      'x-decorator-props': {
        collection: userCollection,
        action: 'list',
        params: {
          pageSize: 50,
          appends: ['roles'],
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
            delete: {
              type: 'void',
              title: '{{ t("Delete") }}',
              'x-action': 'destroy',
              'x-decorator': 'ACLActionProvider',
              'x-component': 'Action',
              'x-use-component-props': 'useDestroyActionProps',
              'x-component-props': {
                icon: 'DeleteOutlined',
                confirm: {
                  title: "{{t('Delete record')}}",
                  content: "{{t('Are you sure you want to delete it?')}}",
                },
              },
            },
            create,
          },
        },
        table: {
          type: 'array',
          'x-uid': 'input',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'id',
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
                nickname: {
                  type: 'number',
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
                username: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            column3: {
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
            column4: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              title: '{{t("Roles")}}',
              properties: {
                roles: {
                  type: 'array',
                  'x-component': 'UserRolesField',
                },
              },
            },
            column5: {
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
                    update,
                    changePassword,
                    delete: {
                      type: 'void',
                      title: '{{t("Delete")}}',
                      'x-action': 'destroy',
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

export const getRoleUsersSchema = (): ISchema => ({
  type: 'void',
  properties: {
    provider: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-acl-action': 'roles.users:list',
      'x-use-decorator-props': 'useTableBlockDecoratorProps',
      // 'x-component': 'CardItem',
      'x-decorator-props': {
        association: 'roles.users',
        // dataSource: "main",
        action: 'list',
        // params: {
        // filter: {
        //   roleName: roles?.name || null,
        // }
        // },
        rowKey: 'role.title',
      },
      properties: {
        actionBar: {
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
              'x-component': 'Space',
              properties: {
                remove: {
                  type: 'void',
                  title: '{{t("Remove")}}',
                  'x-component': 'Action',
                  'x-component-props': {
                    icon: 'MinusOutlined',
                    confirm: {
                      title: "{{t('Remove')}}",
                      content: "{{t('Are you sure you want to remove these users?')}}",
                    },
                    style: {
                      marginRight: 8,
                    },
                    useAction: '{{ useBulkRemoveUsers }}',
                  },
                },
                create: {
                  type: 'void',
                  title: '{{t("Add users")}}',
                  'x-component': 'Action',
                  'x-component-props': {
                    type: 'primary',
                    icon: 'PlusOutlined',
                  },
                  properties: {
                    drawer: {
                      type: 'void',
                      'x-component': 'Action.Drawer',
                      'x-decorator': 'FormV2',
                      title: '{{t("Add users")}}',
                      properties: {
                        resource: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'RoleUsersProvider',
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
                                    $and: [{ username: { $includes: '' } }, { nickname: { $includes: '' } }],
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
                                  onChange: '{{ handleSelectRoleUsers }}',
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
                            submit: {
                              title: '{{t("Submit")}}',
                              'x-component': 'Action',
                              'x-component-props': {
                                type: 'primary',
                                useAction: '{{ useAddRoleUsers }}',
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
            username: {
              type: 'void',
              title: '{{t("Username")}}',
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
              title: '{{t("Nickname")}}',
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
            actions: {
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
                    remove: {
                      type: 'void',
                      title: '{{ t("Remove") }}',
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'useRemoveUser',
                      'x-component-props': {
                        confirm: {
                          title: "{{t('Remove user')}}",
                          content: "{{t('Are you sure you want to remove it?')}}",
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
});

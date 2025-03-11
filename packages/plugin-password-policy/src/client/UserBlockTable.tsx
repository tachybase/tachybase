import React from 'react';
import {
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useRecord,
  useRequest,
  useTableBlockContext,
} from '@tachybase/client';

import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { userBlockCollection } from './collections/userBlocks';

const createForm = {
  type: 'void',
  'x-acl-action-props': {
    skipScopeCheck: true,
  },
  // 'x-acl-action': 'users:create',
  'x-decorator': 'FormBlockProvider',
  'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
  'x-decorator-props': {
    dataSource: 'main',
    collection: 'users',
  },
  'x-component': 'CardItem',
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
              marginBottom: 'var(--tb-spacing)',
            },
          },
          properties: {
            submit: {
              title: '{{t("Submit")}}',
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
        username: {
          type: 'string',
          title: '{{ t("Username or Email") }}',
          required: true,
          'x-component': 'RemoteSelect',
          'x-decorator': 'FormItem',
          'x-component-props': {
            placeholder: '{{ t("Please enter username, nickname or email") }}',
            fieldNames: {
              label: 'nickname',
              value: 'id',
            },
            service: {
              resource: 'users',
              action: 'list',
              params: {
                filter: {
                  $or: [
                    {
                      blockExpireAt: null,
                    },
                    {
                      blockExpireAt: {
                        $lt: new Date(),
                      },
                    },
                  ],
                },
                pageSize: 20,
                sort: ['username'],
              },
            },
            manual: false,
          },
        },
        blockExpireAt: {
          type: 'string',
          title: '{{ t("Block Until") }}',
          required: true,
          'x-component': 'DatePicker',
          'x-decorator': 'FormItem',
          'x-component-props': {
            showTime: true,
            disabledDate: '{{ (current) => current && current < new Date() }}',
            showNow: false,
            placeholder: '{{ t("Please select block expiration time") }}',
          },
          'x-validator': {
            minimum: '{{ new Date().toISOString() }}',
          },
        },
      },
    },
  },
};

const create = {
  type: 'void',
  title: "{{t('Block New User')}}",
  'x-component': 'Action',
  'x-decorator': 'ACLActionProvider',
  'x-component-props': {
    openMode: 'drawer',
    type: 'primary',
    icon: 'PlusOutlined',
    useAction: '{{ useCreateAction }}',
  },
  'x-align': 'right',
  'x-acl-action-props': {
    skipScopeCheck: true,
  },
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Block New User") }}',
      'x-component': 'Action.Container',
      'x-component-props': {
        className: 'tb-action-popup',
      },
      properties: {
        form: createForm,
      },
    },
  },
};

const editAction = {
  type: 'void',
  title: '{{ t("Edit") }}',
  'x-action': 'updateBlockUser',
  'x-component': 'Action.Link',
  'x-component-props': {
    openMode: 'drawer',
    icon: 'EditOutlined',
  },
  'x-decorator': 'ACLActionProvider',
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Edit") }}',
      'x-component': 'Action.Container',
      'x-component-props': {
        className: 'tb-action-popup',
      },
      properties: {
        form: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: false,
          },
          // 'x-acl-action': 'password-policy:update',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: userBlockCollection,
            useParams: '{{ useParamsFromRecord }}',
          },
          'x-component': 'CardItem',
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
                      marginBottom: 'var(--tb-spacing)',
                    },
                  },
                  properties: {
                    submit: {
                      title: '{{t("Submit")}}',
                      'x-action': 'submit',
                      'x-component': 'Action',
                      'x-use-component-props': 'useUpdateActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                      'x-action-settings': {
                        triggerWorkflows: [],
                        onSuccess: {
                          manualClose: false,
                          redirecting: false,
                          successMessage: '{{t("Updated successfully")}}',
                        },
                        skipValidator: false,
                      },
                      type: 'void',
                    },
                  },
                },
                username: {
                  type: 'string',
                  title: '{{ t("Username") }}',
                  'x-component': 'Input',
                  'x-decorator': 'FormItem',
                  'x-component-props': {
                    disabled: true,
                  },
                  'x-read-pretty': true,
                },
                nickname: {
                  type: 'string',
                  title: '{{ t("Nickname") }}',
                  'x-component': 'Input',
                  'x-decorator': 'FormItem',
                  'x-component-props': {
                    disabled: true,
                  },
                  'x-read-pretty': true,
                },
                blockExpireAt: {
                  type: 'string',
                  title: '{{ t("Block Until") }}',
                  required: true,
                  'x-component': 'DatePicker',
                  'x-component-props': {
                    showTime: true,
                    disabledDate: '{{ (current) => current && current < new Date() }}',
                    showNow: false,
                    placeholder: '{{ t("Please select block expiration time") }}',
                  },
                  'x-validator': {
                    minimum: '{{ new Date().toISOString() }}',
                  },
                  'x-decorator': 'FormItem',
                },
              },
            },
          },
        },
      },
    },
  },
};

const table = {
  type: 'void',
  'x-decorator': 'TableBlockProvider',
  'x-acl-action': 'password-policy:blockList',
  'x-use-decorator-props': 'useTableBlockDecoratorProps',
  'x-decorator-props': {
    collection: userBlockCollection,
    action: 'blockList',
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
        username: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            username: {
              'x-collection-field': 'users.username',
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
        nickname: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            nickname: {
              'x-collection-field': 'users.nickname',
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
        updatedAt: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            updatedAt: {
              'x-collection-field': 'users.updatedAt',
              'x-component': 'CollectionField',
              'x-component-props': {
                ellipsis: true,
                showTime: true,
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
        blockExpireAt: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            blockExpireAt: {
              'x-collection-field': 'users.blockExpireAt',
              'x-component': 'CollectionField',
              'x-component-props': {
                ellipsis: true,
                showTime: true,
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
        actions: {
          type: 'void',
          title: '{{ t("Actions") }}',
          'x-action-column': 'actions',
          'x-decorator': 'TableV2.Column.ActionBar',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 200,
            fixed: 'right',
          },
          properties: {
            actions: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': {
                split: '|',
              },
              properties: {
                edit: editAction,
                delete: {
                  type: 'void',
                  title: '{{ t("Unblock") }}',
                  'x-action': 'destroy',
                  'x-component': 'Action.Link',
                  'x-component-props': {
                    useAction: '{{ useUnblockAction }}',
                    danger: true,
                  },
                  'x-decorator': 'ACLActionProvider',
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
  properties: {
    table,
  },
};

const useBlockedUsers = (options = {}) => {
  const api = useAPIClient();
  return useRequest(
    () =>
      api.resource('users').list({
        filter: {
          blockExpireAt: {
            $exists: true,
            $ne: null,
          },
        },
      }),
    {
      ...options,
      manual: true,
    },
  );
};

const useUserSearch = () => {
  const api = useAPIClient();
  const { service } = useTableBlockContext();

  return async (search) => {
    if (!search || search.length < 2) return [];

    try {
      // 获取当前已封禁用户的列表
      const blockedUsers = await service?.load();
      const blockedUserIds = blockedUsers?.data?.map((user) => user.id) || [];

      // 搜索未被封禁的用户
      const { data } = await api.resource('users').list({
        filter: {
          $or: [
            { username: { $like: `%${search}%` } },
            { nickname: { $like: `%${search}%` } },
            { email: { $like: `%${search}%` } },
          ],
          id: {
            $notIn: blockedUserIds,
          },
          blockExpireAt: {
            $exists: false,
          },
        },
        fields: ['id', 'username', 'nickname', 'email'],
        sort: ['username'],
        pageSize: 20,
      });

      return data.map((user) => ({
        label: `${user.username}${user.nickname ? ` (${user.nickname})` : ''}${user.email ? ` - ${user.email}` : ''}`,
        value: user.username,
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };
};

const useCreateAction = () => {
  const api = useAPIClient();
  const { service } = useTableBlockContext();
  const { setVisible } = useActionContext();

  return {
    async run(values) {
      await api.resource('users').update({
        filter: {
          username: values.username,
        },
        values: {
          blockExpireAt: values.blockExpireAt,
        },
      });
      service?.refresh();
      setVisible(false);
    },
  };
};

// const useEditAction = () => {
//   const { t } = useTranslation();
//   const api = useAPIClient();
//   const record = useRecord();
//   const { service } = useTableBlockContext();
//   const { setVisible } = useActionContext();

//   return {
//     async run(values) {
//       await api.resource('password-policy').updateBlockUser({
//         filterByTk: record.id,
//         values: {
//           blockExpireAt: values.blockExpireAt
//         }
//       });
//       service?.refresh();
//       setVisible(false);
//     },
//     initialValues: {
//       username: record.username,
//       nickname: record.nickname,
//       blockExpireAt: record.blockExpireAt
//     }
//   };
// };

const useUnblockAction = () => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const record = useRecord();
  const { service } = useTableBlockContext();
  const { modal } = App.useApp();

  return {
    async run() {
      modal.confirm({
        title: t('Unblock User'),
        content: t('Are you sure you want to unblock this user?'),
        async onOk() {
          await api.resource('password-policy').updateBlockUser({
            filterByTk: record.id,
            values: {
              blockExpireAt: null,
            },
          });
          service?.refresh();
        },
      });
    },
  };
};

// const renderBlockDuration = (value, record) => {
//   if (!record.blockExpireAt) return '';
//   const now = new Date();
//   const expireAt = new Date(record.blockExpireAt);
//   const diff = expireAt.getTime() - now.getTime();
//   if (diff <= 0) return '已过期';

//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//   if (days > 0) return `${days}天${hours}小时`;
//   if (hours > 0) return `${hours}小时${minutes}分钟`;
//   return `${minutes}分钟`;
// };

// const useCreateFormValues = () => {
//   return {};
// };

export const UserBlockTable: React.FC = () => {
  const scope = {
    useBlockedUsers,
    useCreateAction,
    // useEditAction,
    useUnblockAction,
    useUserSearch,
    // renderBlockDuration,
    // useCreateFormValues
  };

  return <SchemaComponent schema={schema} scope={scope} />;
};

export const schemaMemberActions = {
  type: 'void',
  'x-component': 'Space',
  properties: {
    remove: {
      type: 'void',
      title: '{{t("Remove")}}',
      'x-component': 'Action',
      'x-component-props': {
        icon: 'UserDeleteOutlined',
        confirm: {
          title: "{{t('Remove members')}}",
          content: "{{t('Are you sure you want to remove these members?')}}",
        },
        style: {
          marginRight: 8,
        },
        useAction: '{{ useBulkRemoveMembersAction }}',
      },
    },
    refresh: {
      type: 'void',
      title: '{{ t("Refresh") }}',
      'x-component': 'Action',
      'x-use-component-props': 'useRefreshActionProps',
      'x-component-props': {
        icon: 'ReloadOutlined',
        style: {
          marginRight: 8,
        },
      },
    },
    create: {
      type: 'void',
      title: '{{t("Add members")}}',
      'x-component': 'Action',
      'x-component-props': {
        type: 'primary',
        icon: 'UserAddOutlined',
      },
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'AddMembers',
        },
      },
    },
  },
};

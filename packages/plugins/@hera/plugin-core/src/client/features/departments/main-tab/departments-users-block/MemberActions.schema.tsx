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

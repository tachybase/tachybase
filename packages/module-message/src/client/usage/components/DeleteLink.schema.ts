export const getSchemaDeleteLink = (params) => {
  const { record } = params;
  return {
    name: `delete-${record.id}`,
    type: 'void',
    title: '{{ t("Delete") }}',
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
    'x-action-settings': {
      triggerWorkflows: [],
    },
    'x-decorator': 'ACLActionProvider',
  };
};

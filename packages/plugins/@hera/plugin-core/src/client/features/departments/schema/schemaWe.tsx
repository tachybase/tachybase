export const schemaWe = {
  type: 'void',
  properties: {
    remove: {
      title: '{{ t("Remove") }}',
      'x-component': 'Action.Link',
      'x-component-props': {
        confirm: { title: "{{t('Remove member')}}", content: "{{t('Are you sure you want to remove it?')}}" },
        useAction: '{{ useRemoveMemberAction }}',
      },
    },
  },
};

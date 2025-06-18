export const getSchemaActionTodos = (params) => {
  const { record, popoverComponent, popoverComponentProps } = params;
  return {
    name: `assignee-view-${record.id}`,
    type: 'void',
    'x-component': 'Action.Link',
    title: '{{t("View")}}',
    properties: {
      drawer: {
        type: 'void',
        'x-component': popoverComponent,
        'x-component-props': {
          className: 'tb-action-popup',
          ...popoverComponentProps,
        },
        properties: {
          content: {
            type: 'void',
            'x-component': 'CheckContent',
          },
        },
      },
    },
  };
};

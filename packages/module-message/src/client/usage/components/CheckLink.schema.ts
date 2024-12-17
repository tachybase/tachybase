export const getSchemaCheckLink = (params) => {
  const { record, popoverComponent, popoverComponentProps } = params;
  return {
    name: `view-${record.id}`,
    type: 'void',
    title: '{{t("View", {"ns":["messages","client"]})}}',
    'x-action': 'view',
    'x-decorator': 'ACLActionProvider',
    'x-component': 'Action.Link',
    'x-component-props': {
      openMode: 'drawer',
    },
    'x-use-component-props': 'usePropsCheckLink',
    properties: {
      drawer: {
        type: 'void',
        title: '{{t("View record", {"ns":["messages","client"]})}}',
        'x-component': popoverComponent,
        'x-component-props': {
          className: 'tb-action-popup',
          ...popoverComponentProps,
        },
        properties: {
          checkContent: {
            'x-component': 'CheckContent',
          },
        },
      },
    },
  };
};

export const getSchemaActionLaunch = (params) => {
  const { record, popoverComponent, popoverComponentProps } = params;

  return {
    name: `view-${record.id}`,
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
          content: Object.assign(
            {
              type: 'void',
            },
            record.approvalId
              ? {}
              : {
                'x-decorator': 'RecordDecorator',
              },
            {
              'x-component': 'ViewActionContent',
            },
          ),
        },
      },
    },
  }
}

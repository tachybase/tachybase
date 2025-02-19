export const workflowsCollection = {
  name: 'workflows',
  fields: [
    {
      name: 'color',
      type: 'string',
      interface: 'color',
      uiSchema: {
        title: '{{t("Color")}}',
        type: 'string',
        'x-component': 'ColorPicker',
        required: true,
      },
    },
    {
      name: 'icon',
      type: 'string',
      interface: 'icon',
      uiSchema: {
        title: '{{t("Icon")}}',
        type: 'string',
        'x-component': 'IconPicker',
        required: true,
      },
    },
  ],
};

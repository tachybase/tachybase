import { NAMESPACE } from '../../locale';

export const collectionWorkflows = {
  title: `{{t("Approval Launch", { ns: "${NAMESPACE}" })}}`,
  name: 'workflows',
  fields: [
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        title: '{{t("Name")}}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'string',
      name: 'description',
      interface: 'input',
      uiSchema: {
        title: '{{t("Description")}}',
        type: 'string',
        'x-component': 'Input.TextArea',
      },
    },
    {
      type: 'boolean',
      name: 'enabled',
      interface: 'select',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Status", { ns: "workflow" })}}',
        'x-component': 'Select',
        enum: [
          {
            label: '{{t("On", { ns: "workflow" })}}',
            value: true,
          },
          {
            label: '{{t("Off", { ns: "workflow" })}}',
            value: false,
          },
        ],
      },
    },
  ],
};

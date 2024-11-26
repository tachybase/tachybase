export const collectionWorkflowsManager = {
  name: 'customEventSources',
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'input',
      uiSchema: {
        title: 'ID',
        type: 'number',
        'x-component': 'InputNumber',
      },
    },
    {
      name: 'collectionName',
      type: 'string',
      interface: 'input',
      uiSchema: {
        title: '{{t("collection Name")}}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      name: 'pathDesc',
      type: 'text',
      interface: 'input',
      uiSchema: {
        title: '{{t("path")}}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'belongsTo',
      name: 'workflow',
      foreignKey: 'workflowId',
      primaryKey: false,
      interface: 'm2o',
      uiSchema: {
        type: 'number',
        title: '{{t("Workflow", { ns: "workflow" })}}',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          fieldNames: {
            label: 'title',
            value: 'id',
          },
          service: {
            resource: 'workflows',
          },
        },
      },
    },
    {
      type: 'belongsTo',
      name: 'uiSchema',
      foreignKey: 'uiSchemaId',
      primaryKey: false,
      interface: 'm2o',
      uiSchema: {
        type: 'number',
        title: '{{t("uiSchema", { ns: "workflow" })}}',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          fieldNames: {
            label: 'title',
            value: 'id',
          },
          service: {
            resource: 'uiSchema',
          },
        },
      },
    },
    {
      type: 'belongsTo',
      name: 'completeUiSchema',
      foreignKey: 'completeUiSchemaId',
      primaryKey: false,
      interface: 'm2o',
      uiSchema: {
        type: 'number',
        title: '{{t("completeUiSchema", { ns: "workflow" })}}',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          fieldNames: {
            label: 'title',
            value: 'id',
          },
          service: {
            resource: 'uiSchema',
          },
        },
      },
    },
  ],
};

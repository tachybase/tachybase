import { NAMESPACE } from '../locale';

export const CollectionFlowNodes = {
  title: `{{t("Node", { ns: "${NAMESPACE}" })}}`,
  name: 'flow_nodes',
  fields: [
    {
      type: 'bigInt',
      name: 'id',
      interface: 'm2o',
      uiSchema: {
        type: 'number',
        title: 'ID',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          fieldNames: { label: 'title', value: 'id' },
          service: { resource: 'flow_nodes', params: { filter: { type: 'manual' } } },
        },
      },
    },
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: { type: 'string', title: '{{t("Title")}}', 'x-component': 'Input' },
    },
  ],
};

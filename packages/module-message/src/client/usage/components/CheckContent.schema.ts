import { tval } from '../../locale';

export const getSchemaCheckContent = (record) => {
  const { id, schemaName } = record;
  return {
    name: `messages-content-${id}`,
    type: 'void',
    'x-component': 'Tabs',
    properties: {
      tab1: {
        type: 'void',
        title: tval('Details'),
        'x-component': 'Tabs.TabPane',
        properties: {
          schemaName: {
            type: 'void',
            'x-component': 'RemoteSchemaComponent',
            'x-component-props': {
              uid: schemaName,
              noForm: true,
            },
          },
        },
      },
    },
  };
};

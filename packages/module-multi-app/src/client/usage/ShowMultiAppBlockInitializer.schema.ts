export const schemaShowMultiAppBlockInitializer = {
  type: 'void',
  'x-component': 'CardItem',
  'x-toolbar': 'BlockSchemaToolbar',
  'x-settings': 'blockSettings:table',
  properties: {
    app: {
      type: 'void',
      'x-component': 'ViewMultiAppPane',
      'x-component-props': {
        admin: false,
      },
    },
  },
};

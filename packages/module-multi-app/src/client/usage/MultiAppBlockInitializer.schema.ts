export const schemaMultiAppBlockInitializer = {
  type: 'void',
  'x-component': 'CardItem',
  'x-toolbar': 'BlockSchemaToolbar',
  'x-settings': 'blockSettings:table',
  properties: {
    app: {
      type: 'void',
      'x-component': 'AppManager',
      'x-component-props': {
        admin: false,
      },
    },
  },
};

export const fieldsets = {
  name: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.name',
    'x-component-props': {},
  },
  code: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.code',
    'x-component-props': {},
  },

  data: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.data',
    'x-component-props': {
      default: '{}',
    },
  },

  description: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.description',
    'x-component-props': {},
  },

  enabled: {
    type: 'boolean',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.enabled',
    'x-component-props': {},
  },
};

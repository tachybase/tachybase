export const fieldsets = {
  name: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudComponents.name',
    'x-component-props': {},
  },
  code: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudComponents.code',
    'x-component-props': {},
  },

  data: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudComponents.data',
    'x-component-props': {
      default: '{}',
    },
  },

  description: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudComponents.description',
    'x-component-props': {},
  },

  enabled: {
    type: 'boolean',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudComponents.enabled',
    'x-component-props': {},
  },
};

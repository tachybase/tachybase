export const fieldsets = {
  module: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.module',
    'x-component-props': {},
  },
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
    default: `
import React from 'react';
import dayjs from 'dayjs';
import { Button, Card } from 'antd';

export default () => {
  const format = () => {
    return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  };
  return (
    <Card>
      <Button type="primary">
        Click me!
      </Button>
      <p>{format()}</p>
    </Card>
  );
};
    `.trim(),
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

  isServer: {
    type: 'boolean',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.isServer',
    'x-component-props': {},
  },

  isClient: {
    type: 'boolean',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.isClient',
    'x-component-props': {},
  },

  clientPlugin: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.clientPlugin',
    'x-component-props': {},
  },

  serverPlugin: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.serverPlugin',
    'x-component-props': {},
  },

  component: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'cloudLibraries.component',
    'x-component-props': {},
  },
};

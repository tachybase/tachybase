import { ISchema } from '@tachybase/schema';

export const blockSchema: ISchema = {
  type: 'void',
  'x-decorator': 'CardItem',
  'x-decorator-props': {
    title: '',
  },
  'x-settings': 'blockSettings:quickAccess',
  'x-schema-toolbar': 'BlockSchemaToolbar',
  'x-component': 'QuickAccessBlock',
  properties: {
    actions: {
      'x-component': 'QuickAccessBlock.ActionBar',
      'x-initializer': 'quickAccess:configureActions',
    },
  },
};

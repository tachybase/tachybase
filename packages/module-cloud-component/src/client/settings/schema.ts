import { ISchema } from '@tachybase/schema';

export const schema: ISchema = {
  type: 'void',
  'x-decorator': 'CardItem',
  'x-decorator-props': {
    title: '',
  },
  'x-settings': 'blockSettings:cloudComponent',
  'x-schema-toolbar': 'BlockSchemaToolbar',
  'x-component': 'CloudComponentBlock',
  'x-component-props': {
    element: 'CloudComponentVoid',
  },
};

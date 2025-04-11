import { ISchema } from '@tachybase/schema';

export default function getSchemaStepFormBlockInitializer({ collection }) {
  const { name: collectionName, title: collectionTitle, dataSource } = collection;

  return {
    type: 'void',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:createForm',
    'x-component': 'CardItem',
    'x-decorator': 'FormBlockProvider',
    'x-decorator-props': {
      dataSource: dataSource,
      collection: collectionName,
      isCustomizedCreate: true,
    },
    'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
    properties: {
      step: {
        type: 'void',
        title: collectionTitle,
        'x-component': 'StepFormContainer',
      },
    },
  } as ISchema;
}

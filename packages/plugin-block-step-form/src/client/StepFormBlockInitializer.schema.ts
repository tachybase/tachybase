import { ISchema, uid } from '@tachybase/schema';

export default function getSchemaStepFormBlockInitializer({ isEdit, collection }) {
  const { name: collectionName, title: collectionTitle, dataSource } = collection;

  return {
    type: 'void',
    'x-acl-action': `${collectionName}:${isEdit ? 'update' : 'create'}`,
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:stepsForm',
    'x-component': 'CardItem',
    'x-decorator': 'FormBlockProvider',
    'x-decorator-props': {
      dataSource: dataSource,
      collection: collectionName,
      isCustomizedCreate: true,
    },
    'x-use-decorator-props': isEdit ? 'useEditFormBlockDecoratorProps' : 'useCreateFormBlockDecoratorProps',
    properties: {
      step: {
        type: 'void',
        'x-uid': uid(),
        title: collectionTitle,
        'x-component': 'StepFormContainer',
        'x-component-props': {
          collection: collectionName,
          dataSource: dataSource,
        },
        properties: {
          step1: {
            type: 'void',
            'x-uid': uid(),
            'x-component': 'StepsForm.Step',
            'x-component-props': {
              title: '步骤 1fsf',
              uid: '80mx9t3ojf5',
            },
          },
          actionBar: {
            type: 'void',
            'x-uid': uid(),
            'x-initializer': 'stepsForm:configureActions',
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: {
                marginTop: 24,
              },
            },
          },
        },
      },
      actionBar: {
        'x-initializer': 'stepsForm:configureActions',
        'x-component': 'ActionBar',
        'x-component-props': {
          layout: 'one-column',
          style: {
            marginTop: 24,
          },
        },
      },
    },
  } as ISchema;
}

import { ISchema } from '@tachybase/schema';

import { stepFormActionInitializer } from '../initializers/stepFormActionInitializer';
import { stepsFormBlockSettings } from '../settings/stepsForm.block';
import { getSchemaStepItem } from './stepItem';

export const getSchemaStepFormBlockInitializer = ({
  dataSource = 'main',
  collection,
  isEdit = false,
  isCusomeizeCreate = false,
  stepTitle = 'Step 1',
}) => {
  const { name: collectionName, title: collectionTitle } = collection;

  return {
    type: 'void',
    'x-decorator': 'FormBlockProvider',
    'x-decorator-props': {
      dataSource: dataSource,
      collection: collectionName,
      isCustomizedCreate: isCusomeizeCreate,
    },
    'x-use-decorator-props': isEdit ? 'useEditFormBlockDecoratorProps' : 'useCreateFormBlockDecoratorProps',
    'x-component': 'CardItem',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': stepsFormBlockSettings.name,
    'x-acl-action': `${collectionName}:${isEdit ? 'update' : 'create'}`,
    properties: {
      step: {
        type: 'void',
        title: collectionTitle,
        'x-component': 'StepsForm',
        'x-component-props': {
          collection: collectionName,
          dataSource: dataSource,
          isEdit: isEdit,
        },
        properties: {
          step1: getSchemaStepItem({
            title: stepTitle,
          }),
          actionBar: {
            type: 'void',
            'x-initializer': stepFormActionInitializer.name,
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
    },
  } as ISchema;
};

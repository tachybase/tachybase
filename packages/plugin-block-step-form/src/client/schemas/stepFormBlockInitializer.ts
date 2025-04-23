import { ISchema } from '@tachybase/schema';

import { stepFormActionInitializer } from '../initializers/stepFormActionInitializer';
import { stepsFormBlockSettings } from '../settings/stepsForm';
import { getSchemaStepItem } from './stepItem';

export const getSchemaStepFormBlockInitializer = ({
  dataSource = 'main',
  collection,
  isEdit = false,
  isCusomeizeCreate = false,
  stepTitle = 'Step 1',
}) => {
  return {
    type: 'void',
    'x-decorator': 'FormBlockProvider',
    'x-decorator-props': {
      dataSource,
      collection,
      isCustomizedCreate: isCusomeizeCreate,
    },
    'x-use-decorator-props': isEdit ? 'useEditFormBlockDecoratorProps' : 'useCreateFormBlockDecoratorProps',
    'x-component': 'CardItem',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': stepsFormBlockSettings.name,
    'x-acl-action': `${collection}:${isEdit ? 'update' : 'create'}`,
    properties: {
      step: {
        type: 'void',
        title: stepTitle,
        'x-component': 'StepsForm',
        'x-component-props': {
          collection,
          dataSource,
          isEdit,
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

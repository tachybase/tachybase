import { uid } from '@tachybase/schema';

export const getSchemaStepItem = ({ title, ...others }) => {
  const id = uid();
  return {
    type: 'void',
    name: id,
    'x-component': 'StepFormContainer',
    'x-component-props': {
      uid: id,
      title,
    },
    properties: {
      step: {
        type: 'void',
        'x-component': 'FormV2',
        'x-component-props': {
          uid: id,
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'form:configureFields',
            properties: {},
          },
        },
      },
    },
  };
};

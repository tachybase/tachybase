import { uid } from '@tachybase/schema';

export const getSchemaStepItem = ({ title }) => {
  const id = uid();
  return {
    type: 'void',
    name: id,
    // TODO: StepsForm.Step
    'x-component': 'StepsForm.Step',
    'x-component-props': {
      title,
      uid: id,
    },
    properties: {
      step: {
        type: 'void',
        // TODO: StepForm
        'x-component': 'StepForm',
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

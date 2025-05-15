import { stepTitleSettings } from '../settings/stepTitle';

export const getSchemaViewStepTitle = ({ name, title, contentSchema }) => {
  return {
    type: 'void',
    properties: {
      [name]: {
        type: 'void',
        'x-decorator': 'BlockItem',
        'x-component': 'div',
        'x-component-props': {
          style: {
            paddingTop: '12px',
            marginTop: '-12px',
          },
        },
        'x-toolbar': 'TableColumnSchemaToolbar',
        'x-settings': stepTitleSettings.name,
        'x-template-uid': contentSchema?.['x-template-uid'],
        'x-content': title,
      },
    },
  };
};

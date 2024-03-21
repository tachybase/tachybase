import React from 'react';
import { ActionInitializer, tval } from '@nocobase/client';

export const CreateSubmitActionInitializer: React.FC = (props) => {
  const schema = {
    title: tval('Submit'),
    'x-action': 'submit',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      type: 'primary',
      htmlType: 'submit',
      useProps: '{{ useCreateActionProps }}',
    },
    'x-action-settings': {
      assignedValues: {},
      triggerWorkflows: [],
      pageMode: false,
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
CreateSubmitActionInitializer.displayName = 'CreateSubmitActionInitializer';

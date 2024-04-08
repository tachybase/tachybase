import React from 'react';
import { ActionInitializer } from '../../../schema-initializer/items/ActionInitializer';

export const CreateSubmitActionInitializer = (props) => {
  const schema = {
    title: '{{ t("Submit") }}',
    'x-action': 'submit',
    'x-component': 'Action',
    'x-use-component-props': 'useCreateActionProps',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:createSubmit',
    'x-component-props': {
      type: 'primary',
      htmlType: 'submit',
    },
    'x-action-settings': {
      triggerWorkflows: [],
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};

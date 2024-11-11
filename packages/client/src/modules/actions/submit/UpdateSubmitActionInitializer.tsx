import React from 'react';

import { ActionInitializer } from '../../../schema-initializer/items/ActionInitializer';

export const UpdateSubmitActionInitializer = (props) => {
  const schema = {
    title: '{{ t("Submit") }}',
    'x-action': 'submit',
    'x-component': 'Action',
    'x-use-component-props': 'useUpdateActionProps',
    // 'x-designer': 'Action.Designer',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:updateSubmit',
    'x-component-props': {
      type: 'primary',
      htmlType: 'submit',
    },
    'x-action-settings': {
      triggerWorkflows: [],
      onSuccess: {
        manualClose: false,
        redirecting: false,
        successMessage: '{{t("Updated successfully")}}',
      },
      isDeltaChanged: false,
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};

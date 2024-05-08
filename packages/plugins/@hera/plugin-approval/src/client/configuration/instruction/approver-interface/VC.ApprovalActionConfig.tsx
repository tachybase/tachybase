import { ActionInitializer, useSchemaInitializerItem } from '@tachybase/client';
import React from 'react';

export const ApprovalActionConfigComponent = () => {
  const itemConfig = useSchemaInitializerItem();
  const { action, actionProps = {}, ...restItemConfig } = itemConfig;

  return (
    <ActionInitializer
      {...restItemConfig}
      schema={{
        type: 'void',
        title: restItemConfig.title,
        'x-decorator': 'ApprovalActionProvider',
        'x-decorator-props': {
          status: action,
        },
        'x-component': 'Action',
        'x-component-props': {
          ...actionProps,
          useAction: '{{ useSubmit }}',
        },
        'x-designer': 'Action.Designer',
        'x-action': `${action}`,
      }}
    />
  );
};

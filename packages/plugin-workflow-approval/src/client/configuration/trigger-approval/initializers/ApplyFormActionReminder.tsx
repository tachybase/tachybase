import React from 'react';
import { ActionInitializer, useSchemaInitializerItem } from '@tachybase/client';

export const ApplyFormActionReminder = () => {
  const itemConfig = useSchemaInitializerItem();
  const { action, actionProps = {}, ...restItemConfig } = itemConfig;
  return (
    <ActionInitializer
      {...restItemConfig}
      schema={{
        type: 'void',
        title: restItemConfig.title,
        'x-decorator': 'ProviderActionReminder',
        'x-component': 'Action',
        'x-component-props': {
          ...actionProps,
          useAction: '{{ useActionReminder }}',
        },
        'x-designer': 'Action.Designer',
      }}
    />
  );
};

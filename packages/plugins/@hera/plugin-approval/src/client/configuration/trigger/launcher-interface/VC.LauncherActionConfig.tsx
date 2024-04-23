import { ActionInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';

// 区块-配置操作
export const LauncherActionConfigComponent = () => {
  const itemConfig = useSchemaInitializerItem();
  const { action, actionProps = {}, ...restItemConfig } = itemConfig;
  return (
    <ActionInitializer
      {...restItemConfig}
      schema={{
        type: 'void',
        title: restItemConfig.title,
        'x-decorator': 'ApplyActionStatusProvider',
        'x-decorator-props': {
          value: action,
        },
        'x-component': 'Action',
        'x-component-props': {
          ...actionProps,
          useAction: '{{ useSubmit }}',
        },
        'x-designer': 'Action.Designer',
        'x-action': `${action}`,
        'x-action-settings': {
          assignedValues: {},
        },
      }}
    />
  );
};

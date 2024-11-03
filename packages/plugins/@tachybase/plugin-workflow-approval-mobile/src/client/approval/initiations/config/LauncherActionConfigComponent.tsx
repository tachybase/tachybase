import React from 'react';
import { ActionInitializer, useSchemaInitializerItem } from '@tachybase/client';

// 卡片-配置操作
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

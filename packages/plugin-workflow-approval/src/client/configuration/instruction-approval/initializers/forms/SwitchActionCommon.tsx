import React from 'react';
import { InitializerWithSwitch, useSchemaInitializerItem } from '@tachybase/client';

export const SwitchActionCommon = () => {
  const itemConfig = useSchemaInitializerItem();
  const { statusApproval, actionProps, ...others } = itemConfig;
  return (
    <InitializerWithSwitch
      {...others}
      item={itemConfig}
      schema={{
        type: 'void',
        title: others.title,
        'x-decorator': 'ApprovalActionProvider',
        'x-decorator-props': {
          status: statusApproval,
        },
        'x-component': 'Action',
        'x-component-props': {
          ...actionProps,
          useAction: `{{ () => useSubmit({source: "updateRecord"}) }}`,
        },
        'x-designer': 'Action.Designer',
        'x-action': `${statusApproval}`,
      }}
      type="x-action"
    />
  );
};

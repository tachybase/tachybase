import React from 'react';
import { InitializerWithSwitch, SchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../../pc/constants';
import { NAMESPACE } from '../../../pc/locale';

export const ApprovalAddActionButton = new SchemaInitializer({
  name: 'ApprovalAddActionButton',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'approvalStatusResolved',
      title: `{{t("Continue the process", { ns: "${NAMESPACE}" })}}`,
      Component: ActionInitializer,
      statusApproval: APPROVAL_ACTION_STATUS.APPROVED,
      actionProps: {
        type: 'primary',
      },
    },
    {
      name: 'approvalStatusRejected',
      title: `{{t("Terminate the process", { ns: "${NAMESPACE}" })}}`,
      Component: ActionInitializer,
      statusApproval: APPROVAL_ACTION_STATUS.REJECTED,
      actionProps: {
        danger: true,
      },
    },
    {
      name: 'approvalStatusPending',
      title: `{{t("Save temporarily", { ns: "${NAMESPACE}" })}}`,
      Component: ActionInitializer,
      statusApproval: APPROVAL_ACTION_STATUS.PENDING,
    },
  ],
});

function ActionInitializer() {
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
}

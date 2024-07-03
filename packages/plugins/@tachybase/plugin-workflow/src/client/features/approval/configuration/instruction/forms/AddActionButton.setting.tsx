import React from 'react';
import { CompatibleSchemaInitializer, InitializerWithSwitch, useSchemaInitializerItem } from '@tachybase/client';

import { JOB_STATUS } from '../../../../../constants';
import { APPROVAL_ACTION_STATUS } from '../../../constants';
import { NAMESPACE } from '../../../locale';

/**
 * @deprecated
 */
// NOTE: 似乎没用, 但删除又报错, 先保留着
const addActionButton_deprecated = new CompatibleSchemaInitializer({
  name: 'ApprovalAddActionButton',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'jobStatusResolved',
      title: `{{t("Continue the process", { ns: "${NAMESPACE}" })}}`,
      Component: ActionInitializer,
      action: JOB_STATUS.RESOLVED,
      actionProps: {
        type: 'primary',
      },
    },
    {
      name: 'jobStatusRejected',
      title: `{{t("Terminate the process", { ns: "${NAMESPACE}" })}}`,
      Component: ActionInitializer,
      action: JOB_STATUS.REJECTED,
      actionProps: {
        danger: true,
      },
    },
    {
      name: 'jobStatusPending',
      title: `{{t("Save temporarily", { ns: "${NAMESPACE}" })}}`,
      Component: ActionInitializer,
      action: JOB_STATUS.PENDING,
    },
  ],
});

export const ApprovalAddActionButton = new CompatibleSchemaInitializer(
  {
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
  },
  addActionButton_deprecated,
);

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

import { SchemaInitializer } from '@tachybase/client';

import { APPROVAL_TODO_STATUS } from '../../../../common/constants/approval-todo-status';
import { tval } from '../../../../locale';
import { SwitchActionCommon } from './SwitchActionCommon';

export const FormActionButtonInitializer = new SchemaInitializer({
  name: 'FormActionButtonInitializer',
  title: '{{t("Configure actions")}}',
  items: [
    {
      name: 'approvalStatusResolved',
      title: tval('Continue the process'),
      Component: SwitchActionCommon,
      statusApproval: APPROVAL_TODO_STATUS.APPROVED,
      actionProps: {
        type: 'primary',
      },
    },
    {
      name: 'approvalStatusRejected',
      title: tval('Terminate the process'),
      Component: SwitchActionCommon,
      statusApproval: APPROVAL_TODO_STATUS.REJECTED,
      actionProps: {
        danger: true,
      },
    },
    {
      name: 'approvalStatusPending',
      title: tval('Save temporarily'),
      Component: SwitchActionCommon,
      statusApproval: APPROVAL_TODO_STATUS.PENDING,
    },
  ],
});

import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function WithdrawActionProvider({ children }) {
  const { data } = useCurrentUserContext();
  const { approval } = useContextApprovalExecution();
  const { workflow, status, createdById } = approval;

  const isSameId = data.data.id === createdById;
  const isEnabledWithdraw = workflow.enabled && workflow.config.withdrawable;
  const isStatusSubmitted = APPROVAL_ACTION_STATUS.SUBMITTED === status;

  if (isSameId && isEnabledWithdraw && isStatusSubmitted) {
    return children;
  }

  return null;
}

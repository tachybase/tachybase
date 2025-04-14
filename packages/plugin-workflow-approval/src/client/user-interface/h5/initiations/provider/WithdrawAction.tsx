import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../../common/constants/approval-initiation-status';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function WithdrawActionProvider({ children }) {
  const { data } = useCurrentUserContext();
  const { approval } = useContextApprovalExecution();
  const { status, createdById, workflow } = approval;

  const isSameId = data.data.id === createdById;
  const isEnabledWithdraw = workflow.enabled && workflow.config.withdrawable;
  const isStatusSubmitted = APPROVAL_INITIATION_STATUS.SUBMITTED === status;
  if (isSameId && isEnabledWithdraw && isStatusSubmitted) {
    return children;
  }

  return null;
}

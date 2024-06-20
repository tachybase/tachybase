import { useCurrentUserContext } from '@tachybase/client';

import { useFlowContext } from '../../../../../FlowContext';
import { APPROVAL_STATUS } from '../../../constants';
import { useApproval } from '../../approval-common/ApprovalData.provider';

export function WithdrawActionProvider({ children }) {
  const { data } = useCurrentUserContext();
  const { status, createdById } = useApproval();
  const { workflow } = useFlowContext();

  const isSameId = data.data.id === createdById;
  const isEnabledWithdraw = workflow.enabled && workflow.config.withdrawable;
  const isStatusSubmitted = APPROVAL_STATUS.SUBMITTED === status;

  if (isSameId && isEnabledWithdraw && isStatusSubmitted) {
    return children;
  }

  return null;
}
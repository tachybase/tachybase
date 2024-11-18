import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';

import { APPROVAL_STATUS } from '../../../constants';
import { useApproval } from '../../common/ApprovalData.provider';
import { useResubmit } from '../../common/Resubmit.provider';

export function WithdrawActionProvider({ children }) {
  const { data } = useCurrentUserContext();
  const { status, createdById } = useApproval();
  const { workflow } = useFlowContext();
  const { isResubmit } = useResubmit();

  const isSameId = data.data.id === createdById;
  const isEnabledWithdraw = workflow.enabled && workflow.config.withdrawable;
  const isStatusSubmitted = APPROVAL_STATUS.SUBMITTED === status;

  if (isSameId && isEnabledWithdraw && isStatusSubmitted && !isResubmit) {
    return children;
  }

  return null;
}

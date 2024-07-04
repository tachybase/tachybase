import { useCurrentUserContext } from '@tachybase/client';

import { useFlowContext } from '../../../../../FlowContext';
import { APPROVAL_STATUS } from '../../../constants';
import { useApproval } from '../../approval-common/ApprovalData.provider';

export function ProviderActionResubmit(props) {
  const { data } = useCurrentUserContext();
  const { status, createdById } = useApproval();
  const { workflow } = useFlowContext();

  const isSameId = data.data.id === createdById;
  // const isEnabledWithdraw = workflow.enabled && workflow.config.withdrawable;
  // const isNotDraft = status !== APPROVAL_STATUS.DRAFT;

  if (isSameId) {
    return props.children;
  }

  return null;
}

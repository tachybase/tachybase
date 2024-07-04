import { useCurrentUserContext } from '@tachybase/client';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function ProviderActionResubmit(props) {
  const { data } = useCurrentUserContext();
  const { approval } = useContextApprovalExecution();
  const { status, createdById } = approval;

  const isSameId = data.data.id === createdById;
  // const isEnabledWithdraw = workflow.enabled && workflow.config.withdrawable;
  // const isNotDraft = status !== APPROVAL_STATUS.DRAFT;

  if (isSameId) {
    return props.children;
  }

  return null;
}

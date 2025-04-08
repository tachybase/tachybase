import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../../../common/constants/approval-initiation-status';
import { useApproval } from '../../../common/ApprovalData.provider';
import { useContextApprovalExecution } from '../../common/ApprovalExecution.provider';

export const ProviderActionReminder = (props) => {
  const { data } = useCurrentUserContext();

  const { status, createdById, latestExecutionId } = useApproval();
  const approvalExecution = useContextApprovalExecution();

  const isSameId = data.data.id === createdById;
  const isSameExecutionId = latestExecutionId === approvalExecution.id;
  const isDraft = status === APPROVAL_INITIATION_STATUS.DRAFT;
  const isReturned = status === APPROVAL_INITIATION_STATUS.RETURNED;

  if (isSameId && !isDraft && !isReturned && isSameExecutionId) {
    return props.children;
  }

  return null;
};

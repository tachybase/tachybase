import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_STATUS } from '../../../../constants';
import { useApproval } from '../../../common/ApprovalData.provider';
import { useContextApprovalExecution } from '../../common/ApprovalExecution.provider';

export const ProviderActionReminder = (props) => {
  const { data } = useCurrentUserContext();

  const { status, createdById, latestExecutionId } = useApproval();
  const approvalExecution = useContextApprovalExecution();

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === approvalExecution.id;
  const isDraft = status === APPROVAL_STATUS.DRAFT;
  const isReturned = status === APPROVAL_STATUS.RETURNED;

  if (isSameId && !isDraft && !isReturned && isSameExcutionId) {
    return props.children;
  }

  return null;
};

import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../../common/constants/approval-initiation-status';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useResubmit } from './Resubmit.provider';

export function ProviderActionResubmit(props) {
  const { data } = useCurrentUserContext();
  const { approval } = useContextApprovalExecution();
  const { isResubmit } = useResubmit();
  const { status, createdById } = approval;

  const isSameId = data.data.id === createdById;
  const isDraft = status === APPROVAL_INITIATION_STATUS.DRAFT;
  const isReturned = status === APPROVAL_INITIATION_STATUS.RETURNED;
  if (isSameId && !isResubmit && !isDraft && !isReturned) {
    return props.children;
  }

  return null;
}

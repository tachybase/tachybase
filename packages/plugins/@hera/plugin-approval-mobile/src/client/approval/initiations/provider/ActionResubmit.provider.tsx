import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useResubmit } from './Resubmit.provider';

export function ProviderActionResubmit(props) {
  const { data } = useCurrentUserContext();
  const { approval } = useContextApprovalExecution();
  const { isResubmit } = useResubmit();
  const { status, createdById } = approval;

  const isSameId = data.data.id === createdById;
  const isDraft = status === APPROVAL_ACTION_STATUS.DRAFT;
  const isReturned = status === APPROVAL_ACTION_STATUS.RETURNED;
  if (isSameId && !isResubmit && !isDraft && !isReturned) {
    return props.children;
  }

  return null;
}

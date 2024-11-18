import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_STATUS } from '../../../../constants';
import { useApproval } from '../../../common/ApprovalData.provider';
import { useResubmit } from '../../../common/Resubmit.provider';

export function ProviderActionResubmit(props) {
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();
  const { status, createdById } = useApproval();

  const isSameId = data.data.id === createdById;
  const isDraft = status === APPROVAL_STATUS.DRAFT;
  const isReturned = status === APPROVAL_STATUS.RETURNED;
  if (isSameId && !isResubmit && !isDraft && !isReturned) {
    return props.children;
  }

  return null;
}

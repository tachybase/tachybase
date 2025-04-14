import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../../../common/constants/approval-initiation-status';
import { useApproval } from '../../../common/ApprovalData.provider';
import { useResubmit } from '../../../common/Resubmit.provider';

export const ProviderActionResubmit = (props) => {
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();
  const { status, createdById } = useApproval();

  const isSameId = data.data.id === createdById;
  const isDraft = status === APPROVAL_INITIATION_STATUS.DRAFT;
  const isReturned = status === APPROVAL_INITIATION_STATUS.RETURNED;
  if (isSameId && !isResubmit && !isDraft && !isReturned) {
    return props.children;
  }

  return null;
};

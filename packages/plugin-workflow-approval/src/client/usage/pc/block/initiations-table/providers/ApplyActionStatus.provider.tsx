import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';

import { useApproval } from '../../../common/ApprovalData.provider';
import { useResubmit } from '../../../common/Resubmit.provider';
import { APPROVAL_STATUS } from '../../../constants';
import { ProviderContextApprovalStatus } from '../ApprovalStatus.context';

export const ProviderApplyActionStatus = (props) => {
  const { value, children } = props;
  const { status, createdById } = useApproval();
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();
  const isSameId = data.data.id === createdById;
  const isStatusDid = [APPROVAL_STATUS.RESUBMIT, APPROVAL_STATUS.DRAFT, APPROVAL_STATUS.RETURNED].includes(status);

  if (value === APPROVAL_STATUS.DRAFT && status === APPROVAL_STATUS.DRAFT) {
    return null;
  }

  if (isSameId && (isStatusDid || isResubmit)) {
    return <ProviderContextApprovalStatus value={value}>{children}</ProviderContextApprovalStatus>;
  }

  return null;
};

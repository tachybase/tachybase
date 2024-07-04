import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function ActionBarProvider(props) {
  const { data } = useCurrentUserContext();
  const { approval, id } = useContextApprovalExecution();
  const { status, createdById, latestExecutionId } = approval;

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === id;
  const isExcutionDid = [
    APPROVAL_ACTION_STATUS.DRAFT,
    APPROVAL_ACTION_STATUS.RETURNED,
    APPROVAL_ACTION_STATUS.SUBMITTED,
    APPROVAL_ACTION_STATUS.RESUBMIT,
  ].includes(status);

  if (!isSameId || !isSameExcutionId || !isExcutionDid) {
    return null;
  }

  return props.children;
}

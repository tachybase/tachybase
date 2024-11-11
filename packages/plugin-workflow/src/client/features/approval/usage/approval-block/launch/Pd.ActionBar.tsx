import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_STATUS } from '../../../constants';
import { useApproval } from '../../approval-common/ApprovalData.provider';
import { useContextApprovalExecution } from '../common/ApprovalExecution.provider';

export function ActionBarProvider(props) {
  const { data } = useCurrentUserContext();
  const { status, createdById, latestExecutionId } = useApproval();
  const approvalExecution = useContextApprovalExecution();

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === approvalExecution.id;

  if (!isSameId || !isSameExcutionId) {
    return null;
  }

  return props.children;
}

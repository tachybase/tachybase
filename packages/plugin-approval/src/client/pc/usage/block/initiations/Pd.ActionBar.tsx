import { useCurrentUserContext } from '@tachybase/client';

import { useApproval } from '../../common/ApprovalData.provider';
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

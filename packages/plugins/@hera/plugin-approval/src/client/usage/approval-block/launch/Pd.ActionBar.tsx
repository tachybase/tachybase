import { useCurrentUserContext } from '@tachybase/client';
import { useContextApprovalExecution } from '../common/ApprovalExecution.provider';
import { useApproval } from '../../approval-common/ApprovalData.provider';
import { APPROVAL_STATUS } from '../../../constants';

export function ActionBarProvider(props) {
  const { data } = useCurrentUserContext();
  const { status, createdById, latestExecutionId } = useApproval();
  const approvalExecution = useContextApprovalExecution();

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === approvalExecution.id;
  const isExcutionDid = [APPROVAL_STATUS.DRAFT, APPROVAL_STATUS.RETURNED, APPROVAL_STATUS.SUBMITTED].includes(status);

  if (!isSameId || !isSameExcutionId || !isExcutionDid) {
    return null;
  }

  return props.children;
}

import { useCurrentUserContext } from '@tachybase/client';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { APPROVAL_ACTION_STATUS } from '../../constants';

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
  ].includes(status);

  if (!isSameId || !isSameExcutionId || !isExcutionDid) {
    return null;
  }

  return props.children;
}

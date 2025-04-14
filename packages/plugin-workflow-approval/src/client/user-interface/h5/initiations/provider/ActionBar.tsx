import { useCurrentUserContext } from '@tachybase/client';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function ActionBarProvider(props) {
  const { data } = useCurrentUserContext();
  const { approval, id } = useContextApprovalExecution();
  const { status, createdById, latestExecutionId } = approval;

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === id;

  if (!isSameId || !isSameExcutionId) {
    return null;
  }

  return props.children;
}

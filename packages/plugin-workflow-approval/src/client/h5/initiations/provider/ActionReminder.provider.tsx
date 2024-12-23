import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export const ProviderActionReminder = (props) => {
  const { data } = useCurrentUserContext();
  const { approval, id } = useContextApprovalExecution() || {};

  const { status, createdById, latestExecutionId } = approval || {};

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === id;
  const isDraft = status === APPROVAL_ACTION_STATUS.DRAFT;
  const isReturned = status === APPROVAL_ACTION_STATUS.RETURNED;

  if (isSameId && !isDraft && !isReturned && isSameExcutionId) {
    return props.children;
  }

  return null;
};

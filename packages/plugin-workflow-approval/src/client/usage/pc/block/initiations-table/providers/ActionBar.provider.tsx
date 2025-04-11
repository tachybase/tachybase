import { useCurrentUserContext } from '@tachybase/client';

import { useContextApprovalExecution } from '../../../../common/contexts/approvalExecution';
import { useApproval } from '../../../common/ApprovalData.provider';

export const ActionBarProvider = (props) => {
  const { data } = useCurrentUserContext();
  const { createdById, latestExecutionId } = useApproval();
  const approvalExecution = useContextApprovalExecution();

  const isSameId = data.data.id === createdById;
  const isSameExcutionId = latestExecutionId === approvalExecution.id;

  if (!isSameId || !isSameExcutionId) {
    return null;
  }

  return props.children;
};

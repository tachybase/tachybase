import React, { createContext, useContext } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';

import { APPROVAL_STATUS } from '../../../constants';
import { useApproval } from '../../common/ApprovalData.provider';
import { useResubmit } from '../../common/Resubmit.provider';

const ContextApprovalStatus = createContext(APPROVAL_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

export function ApplyActionStatusProvider(props) {
  const { value, children } = props;
  const { status, createdById } = useApproval();
  const { workflow } = useFlowContext();
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();
  const isSameId = data.data.id === createdById;
  const isEnabled = workflow.enabled;
  const isStatusDid = [APPROVAL_STATUS.RESUBMIT, APPROVAL_STATUS.DRAFT, APPROVAL_STATUS.RETURNED].includes(status);

  if (value === APPROVAL_STATUS.DRAFT && status === APPROVAL_STATUS.DRAFT) {
    return null;
  }

  if ((isSameId && isEnabled && isStatusDid) || (isSameId && isEnabled && isResubmit)) {
    return <ContextApprovalStatus.Provider value={value}>{children}</ContextApprovalStatus.Provider>;
  }

  return null;
}

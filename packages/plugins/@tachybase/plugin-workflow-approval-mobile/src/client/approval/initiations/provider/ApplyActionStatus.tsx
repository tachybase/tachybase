import React, { createContext, useContext } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useResubmit } from './Resubmit.provider';

const ContextApprovalStatus = createContext(APPROVAL_ACTION_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

export function ApplyActionStatusProvider(props) {
  const { value, children } = props;
  const { approval } = useContextApprovalExecution();
  const { status, createdById, workflow } = approval;
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();
  const isSameId = data.data.id === createdById;
  const isEnabled = workflow.enabled;
  const isStatusDid = [
    APPROVAL_ACTION_STATUS.DRAFT,
    APPROVAL_ACTION_STATUS.RETURNED,
    APPROVAL_ACTION_STATUS.RESUBMIT,
  ].includes(status);

  if (value === APPROVAL_ACTION_STATUS.DRAFT && status === APPROVAL_ACTION_STATUS.DRAFT) {
    return null;
  }

  if ((isSameId && isEnabled && isStatusDid) || (isSameId && isEnabled && isResubmit)) {
    return <ContextApprovalStatus.Provider value={value}>{children}</ContextApprovalStatus.Provider>;
  }

  return null;
}

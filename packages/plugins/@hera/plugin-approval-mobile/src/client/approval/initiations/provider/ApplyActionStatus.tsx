import React, { useContext } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { createContext } from 'react';
import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

const ContextApprovalStatus = createContext(APPROVAL_ACTION_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

export function ApplyActionStatusProvider(props) {
  const { value, children } = props;
  const { approval } = useContextApprovalExecution();
  const { status, createdById, workflow } = approval;
  const { data } = useCurrentUserContext();
  const isSameId = data.data.id === createdById;
  const isEnbled = workflow.enabled;
  const isStatusDid = [APPROVAL_ACTION_STATUS.DRAFT, APPROVAL_ACTION_STATUS.RETURNED].includes(status);

  if (isSameId && isEnbled && isStatusDid) {
    return <ContextApprovalStatus.Provider value={value}>{children}</ContextApprovalStatus.Provider>;
  }

  return null;
}

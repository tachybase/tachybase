import { createContext, useContext } from 'react';
import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../../common/constants/approval-initiation-status';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

const ContextApprovalStatus = createContext(APPROVAL_INITIATION_STATUS.SUBMITTED);

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
  const isStatusDid = [APPROVAL_INITIATION_STATUS.DRAFT, APPROVAL_INITIATION_STATUS.RETURNED].includes(status);

  if (isSameId && isEnbled && isStatusDid) {
    return <ContextApprovalStatus.Provider value={value}>{children}</ContextApprovalStatus.Provider>;
  }

  return null;
}

import { createContext, useContext } from 'react';
import { useCurrentUserContext } from '@tachybase/client';

import { APPROVAL_INITIATION_STATUS } from '../../../../common/constants/approval-initiation-status';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useResubmit } from './Resubmit.provider';

const ContextApprovalStatus = createContext(APPROVAL_INITIATION_STATUS.SUBMITTED);

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

  const isStatusDid = [
    APPROVAL_INITIATION_STATUS.DRAFT,
    APPROVAL_INITIATION_STATUS.RETURNED,
    APPROVAL_INITIATION_STATUS.RESUBMIT,
  ].includes(status);

  if (value === APPROVAL_INITIATION_STATUS.DRAFT && status === APPROVAL_INITIATION_STATUS.DRAFT) {
    return null;
  }

  if (isSameId && (isStatusDid || isResubmit)) {
    return <ContextApprovalStatus.Provider value={value}>{children}</ContextApprovalStatus.Provider>;
  }

  return null;
}

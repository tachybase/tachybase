import React, { useContext } from 'react';
import { useCurrentUserContext } from '@nocobase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { createContext } from 'react';
import { useApproval } from '../../approval-common/Pd.ApprovalData';
import { APPROVAL_STATUS } from '../../../constants';

const ContextApprovalStatus = createContext(APPROVAL_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

export function ApplyActionStatusProvider(props) {
  const { value, children } = props;
  const { status, createdById } = useApproval();
  const { workflow } = useFlowContext();
  const { data } = useCurrentUserContext();
  const isSameId = data.data.id === createdById;
  const isEnbled = workflow.enabled;
  const isStatusDid = [APPROVAL_STATUS.DRAFT, APPROVAL_STATUS.RETURNED].includes(status);

  if (isSameId && isEnbled && isStatusDid) {
    return <ContextApprovalStatus.Provider value={value}>{children}</ContextApprovalStatus.Provider>;
  }

  return null;
}

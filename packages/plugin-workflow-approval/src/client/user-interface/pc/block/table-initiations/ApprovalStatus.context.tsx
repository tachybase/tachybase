import { createContext, useContext } from 'react';

import { APPROVAL_INITIATION_STATUS } from '../../../../common/constants/approval-initiation-status';

const ContextApprovalStatus = createContext(APPROVAL_INITIATION_STATUS.SUBMITTED);

export const ProviderContextApprovalStatus = ContextApprovalStatus.Provider;

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

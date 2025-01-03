import { createContext, useContext } from 'react';

import { APPROVAL_STATUS } from '../../constants';

const ContextApprovalStatus = createContext(APPROVAL_STATUS.SUBMITTED);

export const ProviderContextApprovalStatus = ContextApprovalStatus.Provider;

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

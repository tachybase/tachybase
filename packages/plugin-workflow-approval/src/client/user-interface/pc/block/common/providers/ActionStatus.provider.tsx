import { createContext, useContext } from 'react';

import { APPROVAL_INITIATION_STATUS } from '../../../../../common/constants/approval-initiation-status';

const ContextApprovalStatus = createContext(APPROVAL_INITIATION_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

export function ApplyActionStatusProvider(props) {
  return <ContextApprovalStatus.Provider value={props.value}>{props.children}</ContextApprovalStatus.Provider>;
}

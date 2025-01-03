import React, { createContext, useContext } from 'react';

import { APPROVAL_STATUS } from '../../../constants';

const ContextApprovalStatus = createContext(APPROVAL_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextApprovalStatus);
}

export function ApplyActionStatusProvider(props) {
  return <ContextApprovalStatus.Provider value={props.value}>{props.children}</ContextApprovalStatus.Provider>;
}

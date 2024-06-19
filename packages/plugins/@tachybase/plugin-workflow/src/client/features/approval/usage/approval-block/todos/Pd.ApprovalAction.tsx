import React, { createContext, useContext } from 'react';

import { useContextApprovalExecutions } from './Pd.ApprovalExecutions';

export interface ApprovalAction {
  status: number | null;
}

const ContextApprovalAction = createContext<Partial<ApprovalAction>>({});

export function useContextApprovalAction() {
  return useContext(ContextApprovalAction);
}

export function ApprovalActionProvider({ children, ...props }) {
  const { status } = useContextApprovalExecutions();

  if (!status || status === props.status) {
    return <ContextApprovalAction.Provider value={props}>{children}</ContextApprovalAction.Provider>;
  }

  return null;
}

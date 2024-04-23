import React, { useContext } from 'react';
import { createContext } from 'react';
import { useContextApprovalExecutions } from './Pd.ApprovalExecutions';

export interface ApprovalAction {
  status: number | null;
}

const ContextApprovalAction = createContext<Partial<ApprovalAction>>({});

export function useContextApprovalAction() {
  return useContext(ContextApprovalAction);
}

export function ApprovalActionProvider({ children, ...props }) {
  const context = useContextApprovalExecutions();

  if (context && context.status !== props.status) {
    return null;
  }

  return <ContextApprovalAction.Provider value={props}>{children}</ContextApprovalAction.Provider>;
}

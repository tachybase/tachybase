import React, { useContext } from 'react';
import { createContext } from 'react';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export interface ApprovalAction {
  status: number | null;
}

const ContextApprovalAction = createContext<Partial<ApprovalAction>>({});

export function useContextApprovalAction() {
  return useContext(ContextApprovalAction);
}

export function ApprovalActionProvider({ children, ...props }) {
  const { status } = useContextApprovalExecution();

  if (!status || status === props.status) {
    return <ContextApprovalAction.Provider value={props}>{children}</ContextApprovalAction.Provider>;
  }

  return null;
}

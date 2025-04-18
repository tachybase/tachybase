import { createContext, useContext } from 'react';

import { useContextApprovalRecords } from './ApprovalExecutions.provider';

interface ApprovalAction {
  status: number | null;
}

const ContextApprovalAction = createContext<Partial<ApprovalAction>>({});

export function ApprovalActionProvider({ children, ...props }) {
  const { status } = useContextApprovalRecords();

  if (!status || status === props.status) {
    return <ContextApprovalAction.Provider value={props}>{children}</ContextApprovalAction.Provider>;
  }

  return null;
}

export function useContextApprovalAction() {
  const context = useContext(ContextApprovalAction);
  return context;
}

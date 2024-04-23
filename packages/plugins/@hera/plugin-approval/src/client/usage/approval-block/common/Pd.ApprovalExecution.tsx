import { createContext, useContext } from 'react';

interface ApprovalExecution {
  id: number;
}

export const ContextApprovalExecution = createContext<Partial<ApprovalExecution>>({});

export function useContextApprovalExecution() {
  return useContext(ContextApprovalExecution);
}

import { createContext, useContext } from 'react';

interface ApprovalExecution {
  id: number;
}

const ContextApprovalExecution = createContext<Partial<ApprovalExecution>>({});

export const ProviderContextApprovalExecution = ContextApprovalExecution.Provider;

export function useContextApprovalExecution() {
  return useContext(ContextApprovalExecution);
}

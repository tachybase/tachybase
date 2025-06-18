import { createContext, useContext } from 'react';

import { ApprovalExecution } from '../todos/interface/interface';

export const ContextApprovalExecution = createContext<Partial<ApprovalExecution>>({});

export function useContextApprovalExecution() {
  return useContext(ContextApprovalExecution);
}

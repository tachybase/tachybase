import { createContext, useContext } from 'react';
import { Approval } from '../interface';

interface ApprovalExecutions {
  id: number;
  approval: Approval;

  execution: any;
  status: number;

  snapshot: any;
  records: any[];

  job?: any;
  userId?: any;
}

export const ContextApprovalExecutions = createContext<Partial<ApprovalExecutions>>({});

export function useContextApprovalExecutions() {
  return useContext(ContextApprovalExecutions);
}

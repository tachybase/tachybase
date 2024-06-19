import { createContext, useContext } from 'react';

export interface Approval {
  id: number;
  collectionName: string;
  dataKey: string;
  workflow: any;
  executions: any[];
  approvalExecutions: any[];
  latestApprovalExecution: any;
  records: any[];
  createdById: number;
  status: number;
  data: any;
  applicantRole: any;
  latestExecutionId?: any;
}

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

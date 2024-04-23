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

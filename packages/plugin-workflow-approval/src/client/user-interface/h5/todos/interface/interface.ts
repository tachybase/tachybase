export interface ApprovalExecution {
  id: number;
  approval?: Approval;
  approvalExecution?: approvalExecution;
  approvalId?: number;
  comment?: any;
  execution: execution;
  executionId: number;
  index?: string;
  job: job;
  jobId: number;
  node: node;
  nodeId: number;
  snapshot?: snapshot;
  status: number;
  user?: user;
  userId?: number;
  workflow: any;
  workflowId: number;
  result: any;
  updatedAt: any;
}

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

export interface approvalExecution {
  approvalId: number;
  executionId: number;
  id: number;
  snapshot: {};
  status: any;
}

export interface execution {
  context: {};
  id: number;
  jobs: any[];
  key: string;
  status: number;
  workflowId: number;
}

export interface job {
  executionId: number;
  id: number;
  nodeId: number;
  nodeKey: string;
  result: any;
  status: number;
  upstreamId: any;
}

export interface node {
  branchIndex: any;
  config: {};
  downstreamId: any;
  id: number;
  key: string;
  title: string;
  type: string;
  upstreamId: any;
  workflowId: number;
}

export interface snapshot {
  ReasonCollection: any;
  account_collection: any;
  account_collection_id: any;
  account_comment: any;
  account_id: any;
  account_pay: any;
  account_pay_id: any;
  amount_pay: any;
  approve_status: string;
  approver_list: any[];
  approver_pre_list: any[];
  attachments: any[];
  category: string;
  cc_list: any[];
  comment_collection: any;
  comment_pay: any;
  company: any;
  company_id: any;
  company_pay: {};
  company_pay_id: number;
  company_receive: {};
  company_receive_id: number;
  createdById: number;
  date_pay: any;
  date_receive: any;
  id: number;
  items: any[];
  items_amount: any;
  items_amount_pay: any;
  items_amount_receive: number;
  items_amount_show: any;
  priority: string;
  project: any;
  project_collection_id: any;
  project_id: any;
  project_pay_id: any;
  reason: any;
  reason_collection: any;
  reason_pay: any;
  sort: number;
  style_temp: any;
}

export interface user {
  appLang: string;
  email: string;
  id: number;
  nickname: string;
  pdf_top_margin: any;
  phone: string;
  systemSettings: {};
  username: string;
}

export interface workflow {
  allExecuted: number;
  current: boolean;
  description: any;
  enabled: boolean;
  executed: number;
  id: number;
  key: string;
  nodes: any[];
  sync: boolean;
  title: string;
  triggerTitle: any;
  type: string;
}

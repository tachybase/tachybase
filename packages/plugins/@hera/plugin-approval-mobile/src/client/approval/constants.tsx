import React from 'react';
import { SchemaInitializerItemType } from '@tachybase/client';
import { JOB_STATUS } from '@tachybase/plugin-workflow/client';
import { ISchema } from '@tachybase/schema';

import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  ExclamationOutlined,
  HourglassOutlined,
  LoadingOutlined,
  MinusOutlined,
  RedoOutlined,
} from '@ant-design/icons';

import { lang, NAMESPACE, tval } from './locale';

/**显示状态 */
export const APPROVAL_STATUS = {
  /**已分配 */
  ASSIGNED: null,
  /** 待处理*/
  PENDING: 0,
  /**已退回 */
  RETURNED: 1,
  /**已通过 */
  APPROVED: 2,
  /**已拒绝 */
  REJECTED: -1,
  /**取消 */
  CANCELED: -2,
  /**撤回 */
  WITHDRAWN: -3,
};

export const ProcessedStatus = [1, 2, -1, -3];

export const approvalStatusOptions = [
  { value: APPROVAL_STATUS.ASSIGNED, label: `Assigned`, color: 'blue' },
  { value: APPROVAL_STATUS.PENDING, label: `Pending`, color: 'gold' },
  { value: APPROVAL_STATUS.RETURNED, label: `Returned`, color: 'purple' },
  { value: APPROVAL_STATUS.APPROVED, label: `Approved`, color: 'green' },
  { value: APPROVAL_STATUS.REJECTED, label: `Rejected`, color: 'red' },
  { value: APPROVAL_STATUS.WITHDRAWN, label: `Withdrawn` },
];

/**行为状态 */
export const APPROVAL_ACTION_STATUS = {
  /** 0：草稿 */
  DRAFT: 0,
  /** 1：已退回 */
  RETURNED: 1,
  /** 2：提交 */
  SUBMITTED: 2,
  /** 3：处理中 */
  PROCESSING: 3,
  /** 4：已完结 */
  APPROVED: 4,
  /**5：重新提交 */
  RESUBMIT: 5,
  /** -1：拒收 */
  REJECTED: -1,
};

export const ApprovalStatusEnums = [
  { value: APPROVAL_ACTION_STATUS.DRAFT, label: `Draft`, editable: true },
  {
    value: APPROVAL_ACTION_STATUS.RETURNED,
    label: `Returned`,
    color: 'purple',
    editable: true,
  },
  { value: APPROVAL_ACTION_STATUS.SUBMITTED, label: `Submitted`, color: 'cyan' },
  { value: APPROVAL_ACTION_STATUS.PROCESSING, label: `Processing`, color: 'gold' },
  { value: APPROVAL_ACTION_STATUS.APPROVED, label: `Approved`, color: 'green' },
  { value: APPROVAL_ACTION_STATUS.REJECTED, label: `Rejected`, color: 'red' },
  { value: APPROVAL_ACTION_STATUS.RESUBMIT, label: 'ReSubmit', color: 'blue', editable: true },
];

export const ApprovalPriorityType = [
  { value: '1', label: '一般', color: 'cyan' },
  { value: '2', label: '紧急', color: 'gold' },
  { value: '3', label: '非常紧急', color: 'red' },
];

export const ApprovalStatusEnumDict = ApprovalStatusEnums.reduce((e, t) => Object.assign(e, { [t.value]: t }), {});
export const JobStatusEnums = {
  [JOB_STATUS.PENDING]: { color: 'gold', label: `Pending` },
  [JOB_STATUS.RESOLVED]: { color: 'green', label: `Approved` },
  [JOB_STATUS.REJECTED]: { color: 'red', label: `Rejected` },
  [JOB_STATUS.RETRY_NEEDED]: { color: 'red', label: `Returned` },
};
export const VoteCategory = { SINGLE: Symbol('single'), ALL: Symbol('all'), VOTE: Symbol('vote') };
export const VoteCategoryEnums = [
  { value: VoteCategory.SINGLE, label: `Or"` },
  { value: VoteCategory.ALL, label: `And"` },
  {
    value: VoteCategory.VOTE,
    label: (v: number) => `${lang('Voting')} ( > ${(v * 100).toFixed(0)}%)`,
  },
].reduce((obj, vote) => Object.assign(obj, { [vote.value]: vote }), {});
export function voteOption(value: number) {
  switch (true) {
    case value === 1:
      return VoteCategory.ALL;
    case 0 < value && value < 1:
      return VoteCategory.VOTE;
    default:
      return VoteCategory.SINGLE;
  }
}
export function flatSchemaArray(sourceData, filter, needRecursion = false) {
  const flatArray = [];
  if (!sourceData) {
    return flatArray;
  }

  if (filter(sourceData) && (!needRecursion || !sourceData.properties)) {
    flatArray.push(sourceData);
  } else {
    sourceData.properties &&
      Object.keys(sourceData.properties).forEach((key) => {
        flatArray.push(...flatSchemaArray(sourceData.properties[key], filter));
      });
  }

  return flatArray;
}

type ValueOf<T> = T[keyof T];

export type FormType = {
  type: 'create' | 'update' | 'custom';
  title: string;
  actions: ValueOf<typeof JOB_STATUS>[];
  collection:
    | string
    | {
        name: string;
        fields: any[];
        [key: string]: any;
      };
};

export type ManualFormType = {
  title: string;
  config: {
    useInitializer: ({ allCollections }?: { allCollections: any[] }) => SchemaInitializerItemType;
    initializers?: {
      [key: string]: React.FC;
    };
    components?: {
      [key: string]: React.FC;
    };
    parseFormOptions(root: ISchema): { [key: string]: FormType };
  };
  block: {
    scope?: {
      [key: string]: () => any;
    };
    components?: {
      [key: string]: React.FC;
    };
  };
};

export const EXECUTION_STATUS = {
  QUEUEING: null,
  STARTED: 0,
  RESOLVED: 1,
  FAILED: -1,
  ERROR: -2,
  ABORTED: -3,
  CANCELED: -4,
  REJECTED: -5,
  RETRY_NEEDED: -6,
};

export const ExecutionStatusOptions = [
  {
    value: EXECUTION_STATUS.QUEUEING,
    label: 'Queueing',
    color: 'blue',
    icon: <HourglassOutlined />,
    description: 'Triggered but still waiting in queue to execute.',
  },
  {
    value: EXECUTION_STATUS.STARTED,
    label: 'On going',
    color: 'gold',
    icon: <LoadingOutlined />,
    description: 'Started and executing, maybe waiting for an async callback (manual, delay etc.).',
  },
  {
    value: EXECUTION_STATUS.RESOLVED,
    label: 'Resolved',
    color: 'green',
    icon: <CheckOutlined />,
    description: 'Successfully finished.',
  },
  {
    value: EXECUTION_STATUS.FAILED,
    label: 'Failed',
    color: 'red',
    icon: <ExclamationOutlined />,
    description: 'Failed to satisfy node configurations.',
  },
  {
    value: EXECUTION_STATUS.ERROR,
    label: 'Error',
    color: 'red',
    icon: <CloseOutlined />,
    description: 'Some node meets error.',
  },
  {
    value: EXECUTION_STATUS.ABORTED,
    label: 'Aborted',
    color: 'red',
    icon: <MinusOutlined rotate={90} />,
    description: 'Running of some node was aborted by program flow.',
  },
  {
    value: EXECUTION_STATUS.CANCELED,
    label: 'Canceled',
    color: 'volcano',
    icon: <MinusOutlined rotate={45} />,
    description: 'Manually canceled whole execution when waiting.',
  },
  {
    value: EXECUTION_STATUS.REJECTED,
    label: 'Rejected',
    color: 'volcano',
    icon: <MinusOutlined />,
    description: 'Rejected from a manual node.',
  },
  {
    value: EXECUTION_STATUS.RETRY_NEEDED,
    label: 'Retry needed',
    color: 'volcano',
    icon: <RedoOutlined />,
    description: 'General failed but should do another try.',
  },
];

import { JOB_STATUS } from '@tachybase/plugin-workflow/client';

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

export const PendingStatus = [0];

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

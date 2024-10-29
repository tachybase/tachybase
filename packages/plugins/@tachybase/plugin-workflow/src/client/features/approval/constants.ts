import { JOB_STATUS } from '../../constants';
import { lang, NAMESPACE } from './locale';

/**审批发起的状态*/
export const APPROVAL_STATUS = {
  /** 草稿 */
  DRAFT: 0,
  /** 退回 */
  RETURNED: 1,
  /** 提交 */
  SUBMITTED: 2,
  /** 处理中 */
  PROCESSING: 3,
  /** 通过 */
  APPROVED: 4,
  /** 重新发起 */
  RESUBMIT: 5,
  /** 已拒绝 */
  REJECTED: -1,
  /** 异常 */
  ERROR: -2,
};

/**
 *  审批执行的状态
 */
export const APPROVAL_ACTION_STATUS = {
  /** 已分配 */
  ASSIGNED: null,
  /** 待处理 */
  PENDING: 0,
  /** 退回 */
  RETURNED: 1,
  /** 通过 */
  APPROVED: 2,
  /** 已拒绝 */
  REJECTED: -1,
  /** 取消 */
  CANCELED: -2,
  /** 撤回 */
  WITHDRAWN: -3,
};
export const approvalStatusOptions = [
  { value: APPROVAL_ACTION_STATUS.ASSIGNED, label: `{{t("Assigned", { ns: "${NAMESPACE}" })}}`, color: 'blue' },
  { value: APPROVAL_ACTION_STATUS.PENDING, label: `{{t("Pending", { ns: "${NAMESPACE}" })}}`, color: 'gold' },
  { value: APPROVAL_ACTION_STATUS.RETURNED, label: `{{t("Returned", { ns: "${NAMESPACE}" })}}`, color: 'purple' },
  { value: APPROVAL_ACTION_STATUS.APPROVED, label: `{{t("Approved", { ns: "${NAMESPACE}" })}}`, color: 'green' },
  { value: APPROVAL_ACTION_STATUS.REJECTED, label: `{{t("Rejected", { ns: "${NAMESPACE}" })}}`, color: 'red' },
  { value: APPROVAL_ACTION_STATUS.WITHDRAWN, label: `{{t("Withdrawn", { ns: "${NAMESPACE}" })}}` },
];
export const approvalStatusConfigObj = approvalStatusOptions.reduce(
  (e, t) =>
    Object.assign(e, {
      [t.value]: t,
    }),
  {},
);
export const ApprovalStatusEnums = [
  {
    value: APPROVAL_STATUS.DRAFT,
    label: `{{t("Draft", { ns: "${NAMESPACE}" })}}`,
    editable: true,
  },
  {
    value: APPROVAL_STATUS.RETURNED,
    label: `{{t("Returned", { ns: "${NAMESPACE}" })}}`,
    color: 'purple',
    editable: true,
  },
  {
    value: APPROVAL_STATUS.SUBMITTED,
    label: `{{t("Submitted", { ns: "${NAMESPACE}" })}}`,
    color: 'cyan',
  },
  {
    value: APPROVAL_STATUS.PROCESSING,
    label: `{{t("Processing", { ns: "${NAMESPACE}" })}}`,
    color: 'gold',
  },
  {
    value: APPROVAL_STATUS.APPROVED,
    label: `{{t("Approved", { ns: "${NAMESPACE}" })}}`,
    color: 'green',
  },
  {
    value: APPROVAL_STATUS.RESUBMIT,
    label: `{{t("Resubmit", { ns: "${NAMESPACE}" })}}`,
    color: 'blue',
    editable: true,
  },
  {
    value: APPROVAL_STATUS.REJECTED,
    label: `{{t("Rejected", { ns: "${NAMESPACE}" })}}`,
    color: 'red',
  },
  {
    value: APPROVAL_STATUS.ERROR,
    label: `{{t("ERROR", { ns: "${NAMESPACE}" })}}`,
    color: '#FF0000',
  },
];
export const ApprovalStatusEnumDict = ApprovalStatusEnums.reduce((e, t) => Object.assign(e, { [t.value]: t }), {});
export const JobStatusEnums = {
  [JOB_STATUS.PENDING]: { color: 'gold', label: `{{t('Pending', { ns: "${NAMESPACE}" })}}` },
  [JOB_STATUS.RESOLVED]: { color: 'green', label: `{{t('Approved', { ns: "${NAMESPACE}" })}}` },
  [JOB_STATUS.REJECTED]: { color: 'red', label: `{{t('Rejected', { ns: "${NAMESPACE}" })}}` },
  [JOB_STATUS.RETRY_NEEDED]: { color: 'red', label: `{{t('Returned', { ns: "${NAMESPACE}" })}}` },
};
export const VoteCategory = { SINGLE: Symbol('single'), ALL: Symbol('all'), VOTE: Symbol('vote') };
export const VoteCategoryEnums = [
  { value: VoteCategory.SINGLE, label: `{{t("Or", { ns: "${NAMESPACE}" })}}` },
  { value: VoteCategory.ALL, label: `{{t("And", { ns: "${NAMESPACE}" })}}` },
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

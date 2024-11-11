/** 审批发起的状态 */
export const APPROVAL_STATUS = {
  DRAFT: 0,
  RETURNED: 1,
  SUBMITTED: 2,
  PROCESSING: 3,
  APPROVED: 4,
  RESUBMIT: 5,
  REJECTED: -1,
  ERROR: -2,
};

/** 审批执行的状态 */
export const APPROVAL_ACTION_STATUS = {
  ASSIGNED: null,
  PENDING: 0,
  RETURNED: 1,
  APPROVED: 2,
  REJECTED: -1,
  CANCELED: -2,
};

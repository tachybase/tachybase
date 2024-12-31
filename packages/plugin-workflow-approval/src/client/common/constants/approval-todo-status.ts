/**
 *  审批执行的状态
 */
export const APPROVAL_TODO_STATUS = {
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

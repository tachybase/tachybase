/**审批发起的状态*/
export const APPROVAL_INITIATION_STATUS = {
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

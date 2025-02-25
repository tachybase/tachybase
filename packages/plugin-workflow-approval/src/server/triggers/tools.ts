import { EXECUTION_STATUS } from '@tachybase/module-workflow';

import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../constants/status';

export const ExecutionStatusMap = {
  [EXECUTION_STATUS.RESOLVED]: APPROVAL_STATUS.APPROVED,
  [EXECUTION_STATUS.REJECTED]: APPROVAL_STATUS.REJECTED,
  [EXECUTION_STATUS.CANCELED]: APPROVAL_STATUS.DRAFT,
  [EXECUTION_STATUS.RETRY_NEEDED]: APPROVAL_STATUS.RETURNED,
  [EXECUTION_STATUS.FAILED]: APPROVAL_STATUS.ERROR,
  [EXECUTION_STATUS.ERROR]: APPROVAL_STATUS.ERROR,
  [EXECUTION_STATUS.ABORTED]: APPROVAL_STATUS.ERROR,
};
export const ApprovalJobStatusMap = {
  [APPROVAL_ACTION_STATUS.APPROVED]: APPROVAL_STATUS.APPROVED,
  [APPROVAL_ACTION_STATUS.REJECTED]: APPROVAL_STATUS.REJECTED,
  [APPROVAL_ACTION_STATUS.RETURNED]: APPROVAL_STATUS.RETURNED,
};

import { APPROVAL_TODO_STATUS } from '../../../../../common/constants/approval-todo-status';
import { useContextApprovalExecution } from '../../../../h5/context/ApprovalExecution';
import { useContextApprovalRecords } from './ApprovalExecutions.provider';

export const ProviderApprovalUpdateForm = (props) => {
  // TODO: 临时修复, 重构过程中将同类上下文合并
  const { status } = useContextApprovalRecords();
  const { status: statusMobile } = useContextApprovalExecution();
  if (status === APPROVAL_TODO_STATUS.PENDING || statusMobile === APPROVAL_TODO_STATUS.PENDING) {
    return props.children;
  } else {
    return null;
  }
};

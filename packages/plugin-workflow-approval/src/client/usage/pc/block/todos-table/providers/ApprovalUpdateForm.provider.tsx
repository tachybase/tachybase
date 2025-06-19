import { useContextApprovalExecution } from '../../../../h5/context/ApprovalExecution';
import { APPROVAL_ACTION_STATUS } from '../../../constants';
import { useContextApprovalRecords } from './ApprovalExecutions.provider';

export const ProviderApprovalUpdateForm = (props) => {
  // TODO: 临时修复, 重构过程中将同类上下文合并
  const { status } = useContextApprovalRecords();
  const { status: statusMobile } = useContextApprovalExecution();
  if (status === APPROVAL_ACTION_STATUS.PENDING || statusMobile === APPROVAL_ACTION_STATUS.PENDING) {
    return props.children;
  } else {
    return null;
  }
};

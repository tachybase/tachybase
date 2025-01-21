import { useContextApprovalExecution } from '../../../../h5/context/ApprovalExecution';
import { APPROVAL_ACTION_STATUS } from '../../../constants';
import { useContextApprovalRecords } from './ApprovalExecutions.provider';

export const ProviderApprovalUpdateForm = (props) => {
  const { status } = useContextApprovalRecords();
  const { status: statusMobile } = useContextApprovalExecution();
  if (status === APPROVAL_ACTION_STATUS.PENDING || statusMobile === APPROVAL_ACTION_STATUS.PENDING) {
    return props.children;
  } else {
    return null;
  }
};

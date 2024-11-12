import { APPROVAL_ACTION_STATUS } from '../../../constants';
import { useContextApprovalRecords } from './Pd.ApprovalExecutions';

export const ProviderApprovalUpdateForm = (props) => {
  const { status } = useContextApprovalRecords();
  if (status === APPROVAL_ACTION_STATUS.PENDING) {
    return props.children;
  } else {
    return null;
  }
};

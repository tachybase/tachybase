import { APPROVAL_ACTION_STATUS } from '../../../constants';
import { useContextApprovalExecutions } from './Pd.ApprovalExecutions';

export const ProviderApprovalUpdateForm = (props) => {
  const { status } = useContextApprovalExecutions();
  if (status === APPROVAL_ACTION_STATUS.PENDING) {
    return props.children;
  } else {
    return null;
  }
};

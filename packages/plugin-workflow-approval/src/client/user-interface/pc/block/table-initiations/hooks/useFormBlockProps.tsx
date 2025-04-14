import { useEffect } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { approvalInitiationStatusMap } from '../../../../../common/constants/approval-initiation-status-options';
import { useContextApprovalExecution } from '../../../../../common/contexts/approvalExecution';
import { useApproval } from '../../../common/ApprovalData.provider';
import { useResubmit } from '../../../common/Resubmit.provider';

export function useFormBlockProps() {
  const approval = useApproval() as any;
  const approvalExecution = useContextApprovalExecution();
  const form = useForm();
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();

  const { editable } = approvalInitiationStatusMap[approval.status];

  const needEditable =
    (isResubmit || editable) &&
    approval?.latestExecutionId === approvalExecution.id &&
    approval?.createdById === data?.data.id;

  useEffect(() => {
    if (!approval) {
      return;
    }

    if (needEditable) {
      form.setPattern('editable');
    } else {
      form.setPattern('readPretty');
    }
  }, [form, approval, needEditable]);

  return { form };
}

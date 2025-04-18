import { useEffect } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { approvalStatusEnums } from '../../../../common/constants/approval-initiation-status-options';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useResubmit } from '../provider/Resubmit.provider';

export function useFormBlockProps() {
  const { approval, id } = useContextApprovalExecution();
  const form = useForm();
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();

  const { editable } = approvalStatusEnums.find((value) => value.value === approval.status);

  const needEditable =
    (isResubmit || editable) && approval?.latestExecutionId === id && approval?.createdById === data?.data.id;

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

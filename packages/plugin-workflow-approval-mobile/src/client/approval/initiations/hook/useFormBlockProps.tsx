import { useEffect } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';

import { ApprovalStatusEnums } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useResubmit } from '../provider/Resubmit.provider';

export function useFormBlockProps() {
  const { approval, id } = useContextApprovalExecution();
  const { workflow } = approval;
  const form = useForm();
  const { data } = useCurrentUserContext();
  const { isResubmit } = useResubmit();

  const { editable } = ApprovalStatusEnums.find((value) => value.value === approval.status);

  const needEditable =
    (isResubmit || editable) &&
    approval?.latestExecutionId === id &&
    approval?.createdById === data?.data.id &&
    workflow.enabled;

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

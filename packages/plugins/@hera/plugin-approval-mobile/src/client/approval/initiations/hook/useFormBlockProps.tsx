import { useEffect } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useForm } from '@tachybase/schema';

import { ApprovalStatusEnums } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function useFormBlockProps() {
  const { approval, id } = useContextApprovalExecution();
  const { workflow } = approval;
  const form = useForm();
  const { data } = useCurrentUserContext();

  const { editable } = ApprovalStatusEnums.find((value) => value.value === approval.status);

  const needEditable =
    editable && approval?.latestExecutionId === id && approval?.createdById === data?.data.id && workflow.enabled;

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

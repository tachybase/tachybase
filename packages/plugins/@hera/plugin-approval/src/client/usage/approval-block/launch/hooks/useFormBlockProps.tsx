import { useEffect } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useForm } from '@tachybase/schema';

import { ApprovalStatusEnumDict } from '../../../../constants';
import { useApproval } from '../../../approval-common/ApprovalData.provider';
import { useContextApprovalExecution } from '../../common/ApprovalExecution.provider';

export function useFormBlockProps() {
  const approval = useApproval() as any;
  const approvalExecution = useContextApprovalExecution();
  const { workflow } = useFlowContext();
  const form = useForm();
  const { data } = useCurrentUserContext();

  const { editable } = ApprovalStatusEnumDict[approval.status];

  const needEditable =
    editable &&
    approval?.latestExecutionId === approvalExecution.id &&
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

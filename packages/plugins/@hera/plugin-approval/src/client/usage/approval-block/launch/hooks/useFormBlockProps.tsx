import { useCurrentUserContext } from '@nocobase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useForm } from '@tachybase/schema';
import { useEffect } from 'react';
import { useContextApprovalExecution } from '../../common/Pd.ApprovalExecution';
import { useApproval } from '../../../approval-common/Pd.ApprovalData';
import { ApprovalStatusEnumDict } from '../../../../constants';

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

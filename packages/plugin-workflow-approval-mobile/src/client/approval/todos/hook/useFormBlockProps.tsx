import { useEffect } from 'react';
import { useCurrentUserContext, useFormBlockContext, useRecord } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';

import { ApprovalStatusEnumDict } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function useFormBlockProps() {
  const { approval, id, workflow } = useContextApprovalExecution();
  const form = useForm();
  const { data } = useCurrentUserContext();

  const { editable } = ApprovalStatusEnumDict[approval.status];

  const needEditable =
    editable && approval?.latestExecutionId === id && approval.createdById === data?.data.id && workflow.enabled;

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

export function useUserJobsFormBlockProps() {
  const { userJob, execution } = useFlowContext();
  const record = useRecord();
  const { data: user } = useCurrentUserContext();
  const { form } = useFormBlockContext();

  const pattern =
    execution.status || userJob.status
      ? record
        ? 'readPretty'
        : 'disabled'
      : user?.data?.id !== userJob.userId
        ? 'disabled'
        : 'editable';

  useEffect(() => {
    form?.setPattern(pattern);
  }, [pattern, form]);

  return { form };
}

export const useWorkflowNoticeFormBlockProps = () => {
  const ctx = useFormBlockContext();
  const { snapshot } = useContextApprovalExecution();
  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx.form?.setInitialValues(snapshot);
    }
  }, [snapshot]);
  return {
    form: ctx.form,
  };
};

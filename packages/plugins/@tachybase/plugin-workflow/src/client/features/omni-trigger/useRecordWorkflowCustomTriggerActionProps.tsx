import { useActionContext, useBlockRequestContext, useCompile, useFilterByTk } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import { isURL } from '@tachybase/utils/client';

import { App, message } from 'antd';
import { useNavigate } from 'react-router-dom';

export function useRecordWorkflowCustomTriggerActionProps() {
  const compile = useCompile();
  const filterByTk = useFilterByTk();
  const _field = useField();
  const fieldSchema = useFieldSchema();
  const { field, resource } = useBlockRequestContext();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const { onSuccess, triggerWorkflows } = fieldSchema?.['x-action-settings'] || {};
  return {
    async onClick(e?, callback?) {
      (_field.data = field.data || {}), (_field.data.loading = true);
      try {
        await resource.trigger({
          filterByTk: filterByTk,
          triggerWorkflows: triggerWorkflows?.length
            ? triggerWorkflows
                .map((workflow) => [workflow.workflowKey, workflow.context].filter(Boolean).join('!'))
                .join(',')
            : undefined,
        });
        callback?.();
        setVisible?.(false);
        setSubmitted?.(true);
        if (!onSuccess?.successMessage) {
          return;
        }
        if (onSuccess?.manualClose) {
          modal.success({
            title: compile(onSuccess?.successMessage),
            onOk() {
              onSuccess?.redirecting &&
                onSuccess?.redirectTo &&
                (isURL(onSuccess.redirectTo)
                  ? (window.location.href = onSuccess.redirectTo)
                  : navigate(onSuccess.redirectTo));
            },
          });
        } else message.success(compile(onSuccess?.successMessage));
      } catch (error) {
        console.error(error);
      } finally {
        _field.data.loading = false;
      }
    },
  };
}

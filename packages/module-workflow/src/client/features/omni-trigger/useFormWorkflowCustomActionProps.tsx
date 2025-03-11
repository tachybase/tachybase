import {
  getAfterWorkflows,
  getBeforeWorkflows,
  useActionContext,
  useBlockRequestContext,
  useCollectValuesToSubmit,
  useCompile,
  useFilterByTk,
} from '@tachybase/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';
import { isURL } from '@tachybase/utils/client';

import { App, message } from 'antd';
import { useNavigate } from 'react-router-dom';

export function useFormWorkflowCustomActionProps() {
  const form = useForm();
  const { field, __parent, resource } = useBlockRequestContext();
  const { setVisible } = useActionContext();
  const filterByTk = useFilterByTk();
  const navigate = useNavigate();
  const fieldSchema = useFieldSchema();
  const _field = useField();
  const compile = useCompile();
  const { modal } = App.useApp();
  const collectionValuesToSubmit = useCollectValuesToSubmit();
  return (
    _field.componentProps.filterKeys,
    {
      async onClick() {
        const { onSuccess, skipValidator, triggerWorkflows } = fieldSchema?.['x-action-settings'] || {};
        if (!skipValidator) {
          await form.submit();
        }
        const values = await collectionValuesToSubmit();
        _field.data = field.data || {};
        _field.data.loading = true;
        try {
          const result = await resource.trigger({
            values,
            filterByTk,
            triggerWorkflows: getAfterWorkflows(triggerWorkflows),
            beforeWorkflows: getBeforeWorkflows(triggerWorkflows),
          });
          _field.data.data = result;
          __parent?.service?.refresh?.();
          setVisible?.(false);
          if (!onSuccess?.successMessage) {
            return;
          }

          onSuccess != null && onSuccess.manualClose
            ? modal.success({
                title: compile(onSuccess?.successMessage),
                onOk: async () => {
                  await form.reset();
                  return (
                    onSuccess?.redirecting &&
                    onSuccess?.redirectTo &&
                    (isURL(onSuccess.redirectTo)
                      ? (window.location.href = onSuccess.redirectTo)
                      : navigate(onSuccess.redirectTo))
                  );
                },
              })
            : message.success(compile(onSuccess == null ? void 0 : onSuccess.successMessage));
        } catch (error) {
          console.error(error);
        } finally {
          _field.data.loading = false;
        }
      },
    }
  );
}

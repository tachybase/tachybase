import { useAPIClient, useActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useContextApprovalAction } from '../provider/ApprovalAction';

export function useSubmit() {
  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const { id } = useContextApprovalExecution();
  const { status } = useContextApprovalAction();
  const { setVisible, setSubmitted } = useActionContext() as any;
  return {
    run: async () => {
      try {
        if (form.values.status) {
          return;
        }
        await form.submit();
        field.data = field.data ?? {};
        field.data.loading = true;
        setVisible(false);
        await api.resource('approvalRecords').submit({
          filterByTk: id,
          values: { ...form.values, status },
        });
        field.data.loading = false;
        await form.reset();
        // refreshAction?.();
        setSubmitted?.(true);
      } catch (error) {
        console.error(error);
        field.data && (field.data.loading = false);
      }
    },
  };
}

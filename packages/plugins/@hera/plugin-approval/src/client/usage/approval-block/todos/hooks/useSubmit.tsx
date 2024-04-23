import { useAPIClient, useActionContext } from '@nocobase/client';
import { useField, useForm } from '@nocobase/schema';
import { useContextApprovalAction } from '../Pd.ApprovalAction';
import { useContextApprovalExecutions } from '../Pd.ApprovalExecutions';

export function useSubmit() {
  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const approvalExecutions = useContextApprovalExecutions();
  const { status } = useContextApprovalAction();
  const { setVisible, setSubmitted } = useActionContext() as any;
  return {
    run() {
      return async () => {
        try {
          if (form.values.status) return;
          await form.submit(), (field.data = field.data ?? {});
          field.data.loading = true;
          await api.resource('approvalRecords').submit({
            filterByTk: approvalExecutions.id,
            values: { ...form.values, status },
          });
          field.data.loading = false;
          await form.reset();
          setSubmitted(true);
          setVisible(false);
        } catch (error) {
          console.error(error);
          field.data && (field.data.loading = false);
        }
      };
    },
  };
}

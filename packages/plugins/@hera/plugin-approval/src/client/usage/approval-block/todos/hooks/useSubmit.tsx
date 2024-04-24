import { useAPIClient, useActionContext, useRefreshActionProps } from '@nocobase/client';
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
  // TODO: 自动更新外层block, 提升交互体验
  // const { onClick: refreshAction } = useRefreshActionProps();
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
          filterByTk: approvalExecutions.id,
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

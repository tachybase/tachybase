import { useAPIClient, useActionContext } from '@nocobase/client';
import { useField } from '@nocobase/schema';
import { useApproval } from '../../../approval-common/Pd.ApprovalData';

export function useWithdrawAction() {
  const field = useField();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const approval = useApproval();
  const api = useAPIClient();
  return {
    run() {
      return async () => {
        try {
          field.data = field.data ?? {};
          field.data.loading = true;
          await api.resource('approvals').withdraw({
            filterByTk: approval.id,
          });
          setSubmitted(true);
          setVisible(false);
          field.data.loading = false;
        } catch (v) {
          if (field.data) {
            field.data.loading = false;
          }
        }
      };
    },
  };
}

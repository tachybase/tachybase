import { useAPIClient, useActionContext } from '@tachybase/client';
import { useField } from '@tachybase/schema';
import { useApproval } from '../../../approval-common/Pd.ApprovalData';

// 撤回
export function useWithdrawAction() {
  const field = useField();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const approval = useApproval();
  const api = useAPIClient();
  return {
    async run() {
      try {
        field.data = field.data ?? {};
        field.data.loading = true;

        await api.resource('approvals').withdraw({
          filterByTk: approval.id,
        });

        setVisible(false);

        setSubmitted(true);

        field.data.loading = false;
      } catch (v) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}

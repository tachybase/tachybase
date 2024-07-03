import { useActionContext, useAPIClient, useTableBlockContext } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { useApproval } from '../../../approval-common/ApprovalData.provider';
import { useHandleRefresh } from '../../common/useHandleRefresh';

// 撤回
export function useWithdrawAction() {
  const { refreshTable } = useHandleRefresh(100);

  const field = useField();
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
        // setSubmitted(true);

        field.data.loading = false;
        refreshTable();
      } catch (v) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}

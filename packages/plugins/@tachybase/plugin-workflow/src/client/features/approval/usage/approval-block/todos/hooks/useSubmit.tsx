import { useAPIClient } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { useHandleRefresh } from '../../common/useHandleRefresh';
import { useContextApprovalAction } from '../Pd.ApprovalAction';
import { useContextApprovalExecutions } from '../Pd.ApprovalExecutions';

export function useSubmit() {
  const { refreshTable } = useHandleRefresh();

  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const approvalExecutions = useContextApprovalExecutions();
  const { status } = useContextApprovalAction();

  return {
    run: async () => {
      try {
        if (form.values.status) {
          return;
        }

        await form.submit();
        field.data = field.data ?? {};
        field.data.loading = true;

        await api.resource('approvalRecords').submit({
          filterByTk: approvalExecutions.id,
          values: { ...form.values, status },
        });

        field.data.loading = false;
        await form.reset();

        refreshTable();
      } catch (error) {
        console.error(error);
        field.data && (field.data.loading = false);
      }
    },
  };
}

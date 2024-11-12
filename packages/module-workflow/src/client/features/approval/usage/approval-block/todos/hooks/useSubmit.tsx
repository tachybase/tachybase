import { useAPIClient, useCollection } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { useHandleRefresh } from '../../common/useHandleRefresh';
import { useContextApprovalAction } from '../Pd.ApprovalAction';
import { useContextApprovalRecords } from '../Pd.ApprovalExecutions';

export function useSubmit(props: any = {}) {
  const { refreshTable } = useHandleRefresh();
  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const collection = useCollection();
  const approvalExecutions = useContextApprovalRecords();
  const { status } = useContextApprovalAction();
  const { source } = props;
  const needUpdateRecord = source === 'updateRecord';

  return {
    run: async () => {
      try {
        if (form.values.status) {
          return;
        }
        await form.submit();
        field.data = field.data ?? {};
        field.data.loading = true;

        if (needUpdateRecord) {
          const collectionName = collection.name;
          const targetId = form.values.id;

          await api.resource(collectionName).update({
            filterByTk: targetId,
            values: form.values,
          });
        }

        await api.resource('approvalRecords').submit({
          filterByTk: approvalExecutions.id,
          values: {
            status,
            needUpdateRecord,
            data: form.values,
          },
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

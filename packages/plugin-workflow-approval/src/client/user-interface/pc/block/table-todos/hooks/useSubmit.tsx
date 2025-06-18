import { useAPIClient, useCollection } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { useHandleRefresh } from '../../common/hooks/useHandleRefresh';
import { useContextApprovalAction } from '../providers/ApprovalAction.provider';
import { useContextApprovalRecords } from '../providers/ApprovalExecutions.provider';

export function useSubmit(props: any = {}) {
  const { refreshTable } = useHandleRefresh();
  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const collection = useCollection();
  const approvalRecord = useContextApprovalRecords();
  const { status } = useContextApprovalAction();
  const { source } = props;
  const needUpdateRecord = source === 'updateRecord';

  return {
    run: async () => {
      try {
        // NOTE: 只有审批待办表的状态为 0(待处理), 才可以被审批
        if (!!approvalRecord.status) {
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
          filterByTk: approvalRecord.id,
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

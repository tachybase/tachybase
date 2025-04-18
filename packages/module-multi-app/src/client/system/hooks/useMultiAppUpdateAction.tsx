import {
  useActionContext,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useRecord,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

export const useMultiAppUpdateAction = (actionCallback?: (key: string, values: any) => void) => {
  const field = useField();
  const form = useForm();
  const ctx = useActionContext();
  // const { refresh } = useDataBlockRequest();
  const service = useDataBlockRequest();
  const resource = useDataBlockResource();
  const record = useCollectionRecordData();
  const { record: cardRecord } = useRecord();
  const filterByTk = record?.name || cardRecord?.name;
  return {
    async onClick() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      try {
        const res = await resource.update({ filterByTk, values: form.values });
        ctx.setVisible(false);
        await form.reset();
        service.refresh();
        actionCallback?.(filterByTk, res?.data?.data);
      } catch (e) {
        console.error(e);
      } finally {
        field.data.loading = false;
      }
    },
  };
};

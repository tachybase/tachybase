import {
  useActionContext,
  useBlockRequestContext,
  useCollectionRecordData,
  useFilterByTk,
  useParamsFromRecord,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

export const useComponentDestroyProps = () => {
  const filterByTk = useFilterByTk();
  const record = useCollectionRecordData();
  const { resource, service, block, __parent } = useBlockRequestContext();
  const { setVisible } = useActionContext();
  const data = useParamsFromRecord();
  const actionSchema = useFieldSchema();
  return {
    async onClick() {
      // if (!record.enabled) {
      //   console.log("%c Line:7 🍓 record.enable", "color:#3f7cff", record);
      //   return;
      // }
      await resource.destroy({
        filterByTk,
        ...data,
      });

      const { count = 0, page = 0, pageSize = 0 } = service?.data?.meta || {};
      if (count % pageSize === 1 && page !== 1) {
        service.run({
          ...service?.params?.[0],
          page: page - 1,
        });
      } else {
        service?.refresh?.();
      }

      if (block && block !== 'TableField') {
        __parent?.service?.refresh?.();
        setVisible?.(false);
      }
    },
  };
};

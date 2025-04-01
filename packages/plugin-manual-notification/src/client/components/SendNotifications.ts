import { useCollectionRecordData, useDataBlockResource } from '@tachybase/client';

export const useSendActionProps = () => {
  const resource = useDataBlockResource();
  const record = useCollectionRecordData();

  return {
    async onClick() {
      if (!record) {
        return;
      }
      try {
        await resource.send({ ...record });
      } catch (error) {
        console.error('send failed:', error);
      }
    },
  };
};

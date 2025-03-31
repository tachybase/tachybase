import { useCollectionRecordData, useDataBlockResource } from '@tachybase/client';

export const useSendActionProps = () => {
  const resource = useDataBlockResource();
  const record = useCollectionRecordData();

  return {
    async onClick() {
      console.log('%c Line:7 🍣 record', 'font-size:18px;color:#b03734;background:#3f7cff', record);
      console.log('%c Line:6 🍿 resource', 'font-size:18px;color:#ed9ec7;background:#93c0a4', resource);
    },
  };
};

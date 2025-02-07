import { useDataBlockRequest, useDataBlockResource } from '@tachybase/client';

export function useSyncCustomEventSource() {
  const { refresh } = useDataBlockRequest();
  const resource = useDataBlockResource();
  return {
    async onClick() {
      await resource.sync({
        name: 'sync',
      });

      refresh();
    },
  };
}

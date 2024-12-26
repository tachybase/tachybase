import {
  useActionContext,
  useAPIClient,
  useCollectionManager_deprecated,
  useRecord,
  useResourceActionContext,
  useResourceContext,
} from '@tachybase/client';

import { useParams } from 'react-router-dom';

export function useDestroyActionAndRefreshCM() {
  const { run: runFunc } = useDestroyAction();
  const { refreshCM } = useCollectionManager_deprecated();
  return {
    async run() {
      await runFunc();
      await refreshCM();
    },
  };
}
function useDestroyAction() {
  const apiClient = useAPIClient();
  const ctx = useActionContext();
  // const { targetKey } = useResourceContext();
  const { key: filterByTk } = useRecord();
  const { name } = useParams();
  const { refresh } = useResourceActionContext();

  return {
    async run() {
      await apiClient.resource('dataSources.collections', name).destroy({ filterByTk });

      ctx?.setVisible?.(false);

      refresh();
    },
  };
}

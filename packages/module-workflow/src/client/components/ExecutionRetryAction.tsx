import React from 'react';
import { useCollectionRecordData, useDataBlockRequest, useDataBlockResource } from '@tachybase/client';

export const ExecutionRetryAction = () => {
  const executionData = useCollectionRecordData();
  const resource = useDataBlockResource();
  const service = useDataBlockRequest();

  return {
    async onClick() {
      await resource.retry({
        filterByTk: executionData.id,
      });
      service?.refresh();
    },
  };
};

import React from 'react';
import { useCollectionRecordData, useDataBlockRequest, useDataBlockResource } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const ExecutionRetryAction = () => {
  const { t } = useTranslation();
  const executionData = useCollectionRecordData();
  const resource = useDataBlockResource();
  const service = useDataBlockRequest();

  return {
    async onClick() {
      await resource.retry({
        filterByTk: executionData.id,
        filter: {
          workflowId: executionData.workflowId,
        },
      });
      service?.refresh();
    },
  };
};

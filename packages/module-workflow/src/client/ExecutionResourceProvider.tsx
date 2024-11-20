import React from 'react';
import { ResourceActionProvider, TableBlockProvider, useCollectionRecordData, useRecord } from '@tachybase/client';

export const ExecutionResourceProvider = ({ params, filter = {}, ...others }) => {
  const workflow = useCollectionRecordData();
  const props = {
    ...others,

    params: {
      ...params,
      filter: {
        ...params?.filter,
        key: workflow.key,
      },
    },
  };

  return <TableBlockProvider {...props} />;
};

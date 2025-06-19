import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider } from '@tachybase/client';

import { useApiChangesCollection, useApiLogsCollection, useCollectionsCollection } from './collections';

export const ApiLogsBlockProvider = ({ children, ...restProps }) => {
  const apiChangesCollection = useApiChangesCollection();
  const apiLogsCollection = useApiLogsCollection();
  const collectionsCollection = useCollectionsCollection();

  return (
    <ExtendCollectionsProvider collections={[apiLogsCollection, apiChangesCollection, collectionsCollection]}>
      <TableBlockProvider name="api-logs" {...restProps}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};

import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider } from '@tachybase/client';

import { useAuditChangesCollection, useCollectionsCollection, useMessageCollection } from './collections';

export const MessageBlockProvider = ({ children, ...restProps }) => {
  const auditChangesCollection = useAuditChangesCollection();
  const MessageCollection = useMessageCollection();
  const collectionsCollection = useCollectionsCollection();

  return (
    <ExtendCollectionsProvider collections={[MessageCollection, auditChangesCollection, collectionsCollection]}>
      <TableBlockProvider name="message" {...restProps}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};

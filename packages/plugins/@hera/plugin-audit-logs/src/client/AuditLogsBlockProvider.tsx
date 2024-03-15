import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider } from '@nocobase/client';
import { useAuditChangesCollection, useAuditLogsCollection, useCollectionsCollection } from './collections';

export const AuditLogsBlockProvider: React.FC = ({ children, ...restProps }) => {
  const auditChangesCollection = useAuditChangesCollection();
  const auditLogsCollection = useAuditLogsCollection();
  const collectionsCollection = useCollectionsCollection();
  console.log('audit logs blocks');

  return (
    <ExtendCollectionsProvider collections={[auditLogsCollection, auditChangesCollection, collectionsCollection]}>
      <TableBlockProvider name="audit-logs" {...restProps}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};

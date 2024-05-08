import React from 'react';
import { AdminProvider, RemoteCollectionManagerProvider, RemoteSchemaComponent } from '@tachybase/client';
import { useParams } from 'react-router-dom';
export const OutboundPage = () => {
  const params = useParams();
  return (
    <AdminProvider>
      <RemoteCollectionManagerProvider>
        <RemoteSchemaComponent uid={params.id} />
      </RemoteCollectionManagerProvider>
    </AdminProvider>
  );
};

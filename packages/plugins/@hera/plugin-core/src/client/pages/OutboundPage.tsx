import React from 'react';
import { AdminProvider, RemoteCollectionManagerProvider, RemoteSchemaComponent } from '@nocobase/client';
import { useParams } from 'react-router-dom';
export const OutboundPage: React.FC = () => {
  const params = useParams();
  return (
    <AdminProvider>
      <RemoteCollectionManagerProvider>
        <RemoteSchemaComponent uid={params.id} />
      </RemoteCollectionManagerProvider>
    </AdminProvider>
  );
};

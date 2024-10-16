import React from 'react';
import { CollectionRecordProvider, DataBlockProvider, RemoteSchemaComponent } from '@tachybase/client';

import { useParams } from 'react-router-dom';

export const SwiperPage = () => {
  const params = useParams();
  const { name, collection, field, fieldParams } = params;
  const record = {};
  record[field] = fieldParams;
  return (
    <DataBlockProvider collection={collection} dataSource="main">
      <CollectionRecordProvider record={record} parentRecord={null}>
        <RemoteSchemaComponent uid={name} />
      </CollectionRecordProvider>
    </DataBlockProvider>
  );
};

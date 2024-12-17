import React from 'react';
import { useCollectionManager, useCollectionRecordData } from '@tachybase/client';

export const ColumnShowCollection = () => {
  const record = useCollectionRecordData();
  const cm = useCollectionManager();

  const collectionName = record.config?.collection;

  const collection: any = cm.getCollection(collectionName);

  const showName = collectionName ? `${collection?.options.title}(${collectionName})` : '-';

  return <div style={{ textAlign: 'left' }}>{showName}</div>;
};

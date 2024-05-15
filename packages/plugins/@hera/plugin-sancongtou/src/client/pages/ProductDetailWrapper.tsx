import { BlockItem, CollectionRecordProvider, DataBlockProvider, RemoteSchemaComponent } from '@tachybase/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';

export const ProductDetailWrapper = () => {
  const params = useParams();
  console.log('%c Line:8 🌭 params', 'font-size:18px;color:#465975;background:#ea7e5c', params);
  const { name, collection, field, fieldParams } = params;
  const record = {};
  record[field] = fieldParams;
  return (
    <DataBlockProvider collection={collection} dataSource="main">
      <CollectionRecordProvider record={record} parentRecord={null}>
        <BlockItem>
          <ProductDetail />
        </BlockItem>
        {/* <RemoteSchemaComponent uid={name} /> */}
      </CollectionRecordProvider>
    </DataBlockProvider>
  );
};

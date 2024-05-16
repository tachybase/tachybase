import { DataBlockProvider, useCollectionManager } from '@tachybase/client';
import React from 'react';
import { useParams } from 'react-router-dom';
// import { ProductDetail } from './ProductDetail';

// THINK: provider 主要作用是定位于, 连接数据库, 不做其他的逻辑
export const CardDetailProvider = (props) => {
  const params = useParams();
  const { collection: collectionName } = params;
  const cm = useCollectionManager();
  const collection = cm.getCollection(collectionName);
  const primaryKey = collection.getPrimaryKey();

  return (
    <DataBlockProvider
      dataSource="main"
      collection={collection}
      action="get"
      params={{
        appends: ['main_images'],
        filterByTk: params[primaryKey],
      }}
    >
      {props.children}
    </DataBlockProvider>
  );
};

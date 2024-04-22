import { DataBlockInitializer, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { createSchemaImageSearchBlock } from './Sm.ImageSearch';

interface ItemConfig {
  name: string;
  title: string;
  icon: string;
}

export function ImageSearchInitializer(props) {
  const { filterCollections } = props;
  const itemConfig: ItemConfig = useSchemaInitializerItem();

  const { insert } = useSchemaInitializer();

  const onCreateBlockSchema = async ({ item }) => {
    const { dataSource, collectionName, name } = item;
    const schema = createSchemaImageSearchBlock({
      dataSource,
      collectionName: collectionName || name,
      blockType: 'filter',
    });
    insert(schema);
  };

  return (
    <DataBlockInitializer
      {...itemConfig}
      componentType={'ImageSearch'}
      filter={filterCollections}
      onCreateBlockSchema={onCreateBlockSchema}
    />
  );
}

import React from 'react';
import { DataBlockInitializer, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { createTabSearchBlockSchema } from '../create/createTabSearchBlockSchema';

export const TabSearchBlockInitializer = (props) => {
  const { filterCollections, onlyCurrentDataSource, hideChildrenIfSingleCollection } = props;
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const onCreateBlockSchema = async ({ item }) => {
    const schema = createTabSearchBlockSchema({
      dataSource: item.dataSource,
      collectionName: item.collectionName || item.name,
      blockType: 'filter',
    });
    insert(schema);
  };

  return (
    <DataBlockInitializer
      {...itemConfig}
      onlyCurrentDataSource={onlyCurrentDataSource}
      icon="tab-search" // FIXME 这里有 bug，直接写字符串会出错
      componentType={'TabSearch'}
      filter={filterCollections}
      hideChildrenIfSingleCollection={hideChildrenIfSingleCollection}
      onCreateBlockSchema={onCreateBlockSchema}
    />
  );
};

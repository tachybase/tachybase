import React from 'react';

import { FormOutlined } from '@ant-design/icons';

import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '../../../../application';
import { useCollection_deprecated } from '../../../../collection-manager';
import { createTableSelectorUISchema } from './createTableSelectorUISchema';

export const TableSelectorInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { onCreateBlockSchema, componentType, createBlockSchema, ...others } = itemConfig;
  const { insert } = useSchemaInitializer();
  const collection = useCollection_deprecated();
  return (
    <SchemaInitializerItem
      icon={<FormOutlined />}
      {...others}
      onClick={async () => {
        insert(
          createTableSelectorUISchema({
            rowKey: collection.filterTargetKey,
            collectionName: collection.name,
            dataSource: collection.dataSource,
          }),
        );
      }}
    />
  );
};

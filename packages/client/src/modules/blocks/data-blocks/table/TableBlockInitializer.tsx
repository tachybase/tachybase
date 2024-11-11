import React from 'react';

import { TableOutlined } from '@ant-design/icons';

import { useSchemaInitializer, useSchemaInitializerItem } from '../../../../application/schema-initializer/context';
import { useCollectionManager_deprecated } from '../../../../collection-manager/hooks/useCollectionManager_deprecated';
import { Collection, CollectionFieldOptions } from '../../../../data-source/collection/Collection';
import { DataBlockInitializer } from '../../../../schema-initializer/items/DataBlockInitializer';
import { createTableBlockUISchema } from './createTableBlockUISchema';

export const TableBlockInitializer = ({
  filterCollections,
  onlyCurrentDataSource,
  hideSearch,
  createBlockSchema,
  templateWrap,
  showAssociationFields,
}: {
  filterCollections: (options: { collection?: Collection; associationField?: CollectionFieldOptions }) => boolean;
  onlyCurrentDataSource: boolean;
  hideSearch?: boolean;
  createBlockSchema?: (options: any) => any;
  templateWrap?: (
    templateSchema: any,
    {
      item,
    }: {
      item: any;
    },
  ) => any;
  showAssociationFields?: boolean;
}) => {
  const { createTableBlock } = useCreateTableBlock();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<TableOutlined />}
      componentType={'Table'}
      onCreateBlockSchema={async (options) => {
        if (createBlockSchema) {
          return createBlockSchema(options);
        }

        createTableBlock(options);
      }}
      onlyCurrentDataSource={onlyCurrentDataSource}
      hideSearch={hideSearch}
      filter={filterCollections}
      showAssociationFields={showAssociationFields}
    />
  );
};

export const useCreateTableBlock = () => {
  const { insert } = useSchemaInitializer();
  const { getCollection } = useCollectionManager_deprecated();

  const createTableBlock = ({ item }) => {
    const collection = getCollection(item.name, item.dataSource);
    const schema = createTableBlockUISchema({
      collectionName: item.name,
      dataSource: item.dataSource,
      rowKey: collection.filterTargetKey || 'id',
    });
    insert(schema);
  };

  return { createTableBlock };
};

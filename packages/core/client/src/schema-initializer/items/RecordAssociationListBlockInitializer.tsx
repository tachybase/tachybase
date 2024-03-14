import { TableOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '../../application';
import { useCollectionManager_deprecated } from '../../collection-manager';
import { useSchemaTemplateManager } from '../../schema-templates';
import { createListBlockSchema, useRecordCollectionDataSourceItems } from '../utils';

export const RecordAssociationListBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { onCreateBlockSchema, componentType, createBlockSchema, ...others } = itemConfig;
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { getCollection } = useCollectionManager_deprecated();
  const field = itemConfig.field;
  const collection = getCollection(field.target);
  const resource = `${field.collectionName}.${field.name}`;

  return (
    <SchemaInitializerItem
      icon={<TableOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          insert(
            createListBlockSchema({
              rowKey: collection.filterTargetKey,
              collection: field.target,
              resource,
              dataSource: collection.dataSource,
              association: resource,
              settings: 'blockSettings:list',
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('List', itemConfig, field.target, resource)}
    />
  );
};

export function useCreateAssociationListBlock() {
  const { insert } = useSchemaInitializer();
  const { getCollection } = useCollectionManager_deprecated();

  const createAssociationListBlock = useCallback(
    ({ item }) => {
      const field = item.associationField;
      const collection = getCollection(field.target);

      insert(
        createListBlockSchema({
          rowKey: collection.filterTargetKey,
          collection: field.target,
          dataSource: collection.dataSource,
          association: `${field.collectionName}.${field.name}`,
          settings: 'blockSettings:list',
        }),
      );
    },
    [getCollection, insert],
  );

  return { createAssociationListBlock };
}

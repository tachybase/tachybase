import { FormOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '../../application';
import { useCollectionManager_deprecated } from '../../collection-manager';
import { useSchemaTemplateManager } from '../../schema-templates';
import { createDetailsBlockSchema, useRecordCollectionDataSourceItems } from '../utils';

export const RecordAssociationDetailsBlockInitializer = () => {
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
      icon={<FormOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const s = await getTemplateSchemaByMode(item);
          insert(s);
        } else {
          insert(
            createDetailsBlockSchema({
              collection: field.target,
              resource,
              dataSource: collection.dataSource,
              association: resource,
              rowKey: collection.filterTargetKey || 'id',
              settings: 'blockSettings:multiDataDetails',
            }),
          );
        }
      }}
      items={useRecordCollectionDataSourceItems('Details', itemConfig, field.target, resource)}
    />
  );
};

export function useCreateAssociationDetailsBlock() {
  const { insert } = useSchemaInitializer();
  const { getCollection } = useCollectionManager_deprecated();

  const createAssociationDetailsBlock = useCallback(
    ({ item }) => {
      const field = item.associationField;
      const collection = getCollection(field.target);

      insert(
        createDetailsBlockSchema({
          collection: field.target,
          dataSource: collection.dataSource,
          association: `${field.collectionName}.${field.name}`,
          rowKey: collection.filterTargetKey || 'id',
          settings: 'blockSettings:multiDataDetails',
        }),
      );
    },
    [getCollection, insert],
  );

  return { createAssociationDetailsBlock };
}

import React, { useCallback } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { FormOutlined } from '@ant-design/icons';

import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '../../../../application';
import { useBlockAssociationContext } from '../../../../block-provider';
import { useCollection_deprecated } from '../../../../collection-manager';
import { useAssociationName } from '../../../../data-source';
import { useRecordCollectionDataSourceItems } from '../../../../schema-initializer/utils';
import { useSchemaTemplateManager } from '../../../../schema-templates';
import { createEditFormBlockUISchema } from './createEditFormBlockUISchema';

/**
 * @deprecated
 */
export const RecordFormBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { targetCollection, ...others } = itemConfig;
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const currentCollection = useCollection_deprecated();
  const collection = targetCollection || currentCollection;

  const { createEditFormBlock, templateWrap } = useCreateEditFormBlock();

  return (
    <SchemaInitializerItem
      icon={<FormOutlined />}
      {...others}
      onClick={async ({ item }) => {
        if (item.template) {
          const template = await getTemplateSchemaByMode(item);
          insert(templateWrap(template, { item }));
        } else {
          createEditFormBlock({ item });
        }
      }}
      items={useRecordCollectionDataSourceItems('FormItem', null, collection?.name)}
    />
  );
};

export function useCreateEditFormBlock() {
  const { insert } = useSchemaInitializer();
  const association = useAssociationName();
  const createEditFormBlock = useCallback(
    ({ item }) => {
      const collectionName = item.collectionName || item.name;
      if (!association && item.associationField) {
        const field = item.associationField;
        insert(
          createEditFormBlockUISchema({
            dataSource: item.dataSource,
            association: `${field.collectionName}.${field.name}`,
          }),
        );
      } else {
        insert(
          createEditFormBlockUISchema(
            association
              ? {
                  association,
                  dataSource: item.dataSource,
                  isCurrent: true,
                }
              : {
                  collectionName,
                  dataSource: item.dataSource,
                },
          ),
        );
      }
    },
    [association, insert],
  );

  const templateWrap = useCallback(
    (templateSchema, { item }) => {
      if (item.template.componentName === 'FormItem') {
        const blockSchema = createEditFormBlockUISchema(
          association
            ? {
                association,
                dataSource: item.dataSource,
                templateSchema: templateSchema,
                isCurrent: true,
              }
            : {
                collectionName: item.collectionName || item.name,
                dataSource: item.dataSource,
                templateSchema: templateSchema,
              },
        );
        if (item.mode === 'reference') {
          blockSchema['x-template-key'] = item.template.key;
        }
        return blockSchema;
      } else {
        return templateSchema;
      }
    },
    [association],
  );

  return { createEditFormBlock, templateWrap };
}

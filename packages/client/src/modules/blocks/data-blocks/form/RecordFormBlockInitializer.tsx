import { useCallback } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { FormOutlined } from '@ant-design/icons';

import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '../../../../application';
import { useCollection_deprecated } from '../../../../collection-manager';
import { useAssociationName, useCollectionManager } from '../../../../data-source';
import { useRecordCollectionDataSourceItems } from '../../../../schema-initializer/utils';
import { useSchemaTemplateManager } from '../../../../schema-templates';
import { createEditFormBlockUISchema, EditFormBlockOptions } from './createEditFormBlockUISchema';

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
  const cm = useCollectionManager();
  const fieldSchema = useFieldSchema();
  const actionType = fieldSchema?.['actionType'] as string | undefined;
  const association = useAssociationName();

  const createEditFormBlock = useCallback(
    ({ item }) => {
      const field = item.associationField;
      const collectionName = field?.target ? cm.getCollection(field.target).name : undefined;

      if (item.associationField) {
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
            association && !actionType
              ? {
                  association,
                  dataSource: item.dataSource,
                  isCurrent: true,
                }
              : {
                  dataSource: item.dataSource,
                  collectionName,
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
        const options: EditFormBlockOptions = {
          dataSource: item.dataSource,
          templateSchema,
        };

        if (item.associationField) {
          const field = item.associationField;
          options.association = `${field.collectionName}.${field.name}`;
        } else if (association) {
          options.association = association;
          options.isCurrent = true;
        } else {
          options.collectionName = item.collectionName || item.name;
        }

        const blockSchema = createEditFormBlockUISchema(options);

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

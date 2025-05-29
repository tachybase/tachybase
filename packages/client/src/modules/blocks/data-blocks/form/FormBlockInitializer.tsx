import React, { useCallback, useState } from 'react';
import { ISchema, Schema, uid, useFieldSchema } from '@tachybase/schema';

import { FormOutlined } from '@ant-design/icons';

import { useSchemaInitializer, useSchemaInitializerItem } from '../../../../application';
import { useAssociationName } from '../../../../data-source/collection/AssociationProvider';
import { Collection, CollectionFieldOptions } from '../../../../data-source/collection/Collection';
import { useDesignable } from '../../../../schema-component';
import { DataBlockInitializer } from '../../../../schema-initializer/items/DataBlockInitializer';
import { findSchema } from '../../../../schema-initializer/utils';
import { createCreateFormBlockUISchema } from './createCreateFormBlockUISchema';
import { createCreateFormEditUISchema, FormSchemaEditor } from './FormSchemaEditor';

export const FormBlockInitializer = ({
  filterCollections,
  onlyCurrentDataSource,
  hideSearch,
  createBlockSchema,
  componentType = 'FormItem',
  templateWrap: customizeTemplateWrap,
  showAssociationFields,
  hideChildrenIfSingleCollection,
  hideOtherRecordsInPopup,
  currentText,
  otherText,
}: {
  filterCollections: (options: { collection?: Collection; associationField?: CollectionFieldOptions }) => boolean;
  onlyCurrentDataSource: boolean;
  hideSearch?: boolean;
  createBlockSchema?: (options: any) => any;
  /**
   * 虽然这里的命名现在看起来比较奇怪，但为了兼容旧版本的 template，暂时保留这个命名。
   */
  componentType?: 'FormItem';
  templateWrap?: (
    templateSchema: any,
    {
      item,
    }: {
      item: any;
    },
  ) => any;
  showAssociationFields?: boolean;
  hideChildrenIfSingleCollection?: boolean;
  /**
   * 隐藏弹窗中的 Other records 选项
   */
  hideOtherRecordsInPopup?: boolean;
  /** 用于更改 Current record 的文案 */
  currentText?: string;
  /** 用于更改 Other records 的文案 */
  otherText?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const [pendingOptions, setPendingOptions] = useState<any>(null);
  const schemaUID = pendingOptions?.schema['x-uid'] || null;
  const itemConfig = useSchemaInitializerItem();
  const fieldSchema = useFieldSchema();
  const { createFormBlock, templateWrap, createEditFormBlock, removeEditableSchema } = useCreateFormBlock();
  const onCreateFormBlockSchema = useCallback(async (options) => {
    // if (createBlockSchema) {
    //   return createBlockSchema(options);
    // }

    // createFormBlock(options);
    const schema = await createEditFormBlock(options);
    setPendingOptions({ schema, ...options });
    setVisible(true);
  }, []);

  const handleClose = () => {
    const deleteSchema = findSchema(fieldSchema, 'x-uid', schemaUID) || {};
    if (deleteSchema) {
      removeEditableSchema(deleteSchema);
    }
    setVisible(false);
    setPendingOptions(null);
  };

  return (
    <>
      <DataBlockInitializer
        {...itemConfig}
        icon={<FormOutlined />}
        componentType={componentType}
        templateWrap={(templateSchema, options) => {
          if (customizeTemplateWrap) {
            return customizeTemplateWrap(templateSchema, options);
          }

          return templateWrap(templateSchema, options);
        }}
        onCreateBlockSchema={onCreateFormBlockSchema}
        filter={filterCollections}
        onlyCurrentDataSource={onlyCurrentDataSource}
        hideSearch={hideSearch}
        showAssociationFields={showAssociationFields}
        hideChildrenIfSingleCollection={hideChildrenIfSingleCollection}
        hideOtherRecordsInPopup={hideOtherRecordsInPopup}
        currentText={currentText}
        otherText={otherText}
      />
      <FormSchemaEditor key={schemaUID} open={visible} onCancel={handleClose} options={pendingOptions} />
    </>
  );
};

export const useCreateFormBlock = () => {
  const { insertAdjacent, remove } = useDesignable();
  const { insert } = useSchemaInitializer();
  const association = useAssociationName();
  const { isCusomeizeCreate: isCustomizeCreate } = useSchemaInitializerItem();

  const createFormBlock = useCallback(
    ({ item, fromOthersInPopup }) => {
      if (fromOthersInPopup) {
        insert(
          createCreateFormBlockUISchema({
            collectionName: item.collectionName || item.name,
            dataSource: item.dataSource,
            isCusomeizeCreate: true,
          }),
        );
      } else {
        insert(
          createCreateFormBlockUISchema(
            association
              ? {
                  association,
                  dataSource: item.dataSource,
                  isCusomeizeCreate: isCustomizeCreate,
                }
              : {
                  collectionName: item.collectionName || item.name,
                  dataSource: item.dataSource,
                  isCusomeizeCreate: isCustomizeCreate,
                },
          ),
        );
      }
    },
    [association, insert, isCustomizeCreate],
  );

  const templateWrap = (templateSchema, { item }) => {
    const schema = createCreateFormBlockUISchema({
      isCusomeizeCreate: isCustomizeCreate,
      dataSource: item.dataSource,
      templateSchema: templateSchema,
      collectionName: item.name,
      association,
    });
    if (item.template && item.mode === 'reference') {
      schema['x-template-key'] = item.template.key;
    }
    return schema;
  };

  const createEditFormBlock = useCallback(
    ({ item, fromOthersInPopup }) => {
      return new Promise((resolve) => {
        const insertPosition = 'beforeEnd';
        const schema = fromOthersInPopup
          ? createCreateFormEditUISchema({
              collectionName: item.collectionName || item.name,
              dataSource: item.dataSource,
              isCusomeizeCreate: true,
            })
          : createCreateFormEditUISchema(
              association
                ? {
                    association,
                    dataSource: item.dataSource,
                    isCusomeizeCreate: isCustomizeCreate,
                  }
                : {
                    collectionName: item.collectionName || item.name,
                    dataSource: item.dataSource,
                    isCusomeizeCreate: isCustomizeCreate,
                  },
            );

        insertAdjacent(insertPosition, gridRowColWrap(schema), {
          onSuccess: (result) => {
            resolve(result); // 往上层传递成功结果
          },
        });
      });
    },
    [association, isCustomizeCreate],
  );

  const removeEditableSchema = (schema: Schema) => {
    remove(schema, {
      removeParentsIfNoChildren: true,
      breakRemoveOn: {
        'x-component': 'Grid',
      },
    });
  };

  return {
    createFormBlock,
    templateWrap,
    createEditFormBlock,
    removeEditableSchema,
  };
};

const gridRowColWrap = (schema: ISchema) => {
  return {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [schema.name || uid()]: schema,
        },
      },
    },
  };
};

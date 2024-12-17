import React from 'react';
import { ISchema } from '@tachybase/schema';

import { useSchemaInitializer, useSchemaInitializerItem } from '../../../../application';
import { Collection, CollectionFieldOptions, useCollectionManager } from '../../../../data-source';
import { Icon } from '../../../../icon';
import { DataBlockInitializer } from '../../../../schema-initializer/items/DataBlockInitializer';

export const createTreeBlockSchema = (options) => {
  const { actionInitializers = 'TreeActionInitializers', collection, association, resource, ...others } = options;
  const resourceName = resource || association || collection;
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resourceName}:list`,
    'x-decorator': 'TreeBlockProvider',
    'x-decorator-props': {
      resource: resourceName,
      collection,
      association,
      readPretty: true,
      action: 'list',
      runWhenParamsChanged: true,
      ...others,
    },
    // 保存当前筛选区块所能过滤的数据区块
    'x-filter-targets': [],
    // 用于存储用户设置的每个字段的运算符，目前仅筛选表单区块支持自定义
    'x-filter-operators': {},
    // 'x-designer': 'Tree.Designer',
    'x-settings': 'blockSettings:filterTree',
    'x-component': 'CardItem',
    properties: {
      actionBar: {
        type: 'void',
        'x-initializer': 'filterTree:configureActions',
        'x-component': 'ActionBar',
        'x-component-props': {
          style: {
            marginBottom: 'var(--tb-spacing)',
          },
        },
        properties: {},
      },
      tree: {
        type: 'array',
        'x-component': 'Tree',
        'x-use-component-props': 'useTreeBlockProps',
      },
    },
  };
  return schema;
};

export const FilterTreeBlockInitializer = ({
  filterCollections,
  onlyCurrentDataSource,
  hideChildrenIfSingleCollection,
}: {
  filterCollections: (options: { collection?: Collection; associationField?: CollectionFieldOptions }) => boolean;
  onlyCurrentDataSource: boolean;
  hideChildrenIfSingleCollection?: boolean;
}) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();

  return (
    <DataBlockInitializer
      {...itemConfig}
      onlyCurrentDataSource={onlyCurrentDataSource}
      icon={<Icon type="TableOutlined" />}
      componentType={'FilterTree'}
      onCreateBlockSchema={async ({ item }) => {
        const collection = cm.getCollection(item.name);
        const schema = createTreeBlockSchema({
          // dataSource: item.dataSource,
          // collectionName: item.collectionName || item.name,
          // // 与数据卡片做区分
          // blockType: 'filter',
          collection: item.name,
          rowKey: collection.filterTargetKey || 'id',
        });
        insert(schema);
      }}
      filter={filterCollections}
      hideChildrenIfSingleCollection={hideChildrenIfSingleCollection}
    />
  );
};

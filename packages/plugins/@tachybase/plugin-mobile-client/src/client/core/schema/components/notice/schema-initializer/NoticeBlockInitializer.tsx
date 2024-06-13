import React from 'react';
import {
  DataBlockInitializer,
  Icon,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';

import { NoticeBar } from 'antd-mobile';

import { NoticeIcon } from '../../../../assets/svg';
import { createGridCardBlockSchema } from '../schema-create/createGridCardBlockSchma';

export const NoticeBlock = () => {
  return <NoticeBar content="月底冲量佣金上调" color="alert" />;
};

export const NoticeBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();
  const onCreateBlockSchema = async ({ item }) => {
    const collection = cm.getCollection(item.name);
    const schema = createGridCardBlockSchema(
      {
        collection: item.name,
        dataSource: item.dataSource,
        rowKey: collection.filterTargetKey || 'id',
        settings: 'blockSettings:gridCard',
      },
      'NoticeBlock',
    );
    insert(schema);
  };
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<Icon type="notice-block" />}
      componentType={'Notice'}
      onCreateBlockSchema={onCreateBlockSchema}
    />
  );
};

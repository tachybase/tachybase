import {
  DataBlockInitializer,
  Icon,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
import { createGridCardBlockSchema } from '../../schma-block/schema-create/createGridCardBlockSchma';
import { ISchema } from '@tachybase/schema';
import { Toast } from 'antd-mobile';

export const SwiperBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();

  const onCreateBlockSchema = async ({ item }) => {
    const collection = cm.getCollection(item.name);
    const value = collection.fields.find((field) => field.interface === 'attachment');
    if (!value) {
      Toast.show({ content: '当前数据源暂无可加载数据' });
      return;
    }
    const schema: ISchema = {
      type: 'void',
      name: item.name,
      title: collection.title,
      'x-decorator': 'DataBlockProvider',
      'x-decorator-props': {
        collection: item.name,
        dataSource: 'main',
      },
      'x-toolbar': 'BlockSchemaToolbar',
      'x-settings': 'SwiperFieldSettings',
      'x-component': 'SwiperBlock',
      'x-use-component-props': 'useSwiperBlockProps',
      'x-component-props': {
        resourceName: item.name,
        fieldValue: value.name,
      },
    };
    insert(schema);
  };

  return (
    <DataBlockInitializer
      {...itemConfig}
      icon="swiper-block"
      componentType={'Swiper'}
      onCreateBlockSchema={onCreateBlockSchema}
    />
  );
};

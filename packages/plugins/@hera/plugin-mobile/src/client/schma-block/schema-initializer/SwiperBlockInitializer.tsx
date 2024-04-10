import {
  DataBlockInitializer,
  Icon,
  css,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
import { Swiper, Toast } from 'antd-mobile';
import { createGridCardBlockSchema } from '../schema-create/createGridCardBlockSchma';
import { SwiperIcon } from '../../assets/svg';

export const SwiperBlock = () => {
  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];
  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div
        className={css`
          height: 120px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 48px;
          user-select: none;
        `}
        style={{ background: color }}
        onClick={() => {
          Toast.show(`你点击了卡片 ${index + 1}`);
        }}
      >
        {index + 1}
      </div>
    </Swiper.Item>
  ));
  return (
    <Swiper loop autoplay>
      {items}
    </Swiper>
  );
};

export const SwiperBlockInitializer = () => {
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
      'SwiperBlock',
    );
    insert(schema);
  };

  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<Icon type="swiper-block" />}
      componentType={'Swiper'}
      onCreateBlockSchema={onCreateBlockSchema}
    />
  );
};

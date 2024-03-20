import { ISchema } from '@formily/react';
import {
  DataBlockInitializer,
  css,
  Icon,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
import { uid } from '@nocobase/utils/client';
import { Swiper, Toast } from 'antd-mobile';

const SwiperSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M0 219.428571h73.142857v585.142858H0V219.428571z m950.857143 0h73.142857v585.142858h-73.142857V219.428571z m-146.285714-146.285714a73.142857 73.142857 0 0 1 73.142857 73.142857v731.428572a73.142857 73.142857 0 0 1-73.142857 73.142857H219.428571a73.142857 73.142857 0 0 1-73.142857-73.142857V146.285714a73.142857 73.142857 0 0 1 73.142857-73.142857h585.142858z m0 73.142857H219.428571v731.428572h585.142858V146.285714zM365.714286 694.857143a36.571429 36.571429 0 1 1 0 73.142857 36.571429 36.571429 0 0 1 0-73.142857z m146.285714 0a36.571429 36.571429 0 1 1 0 73.142857 36.571429 36.571429 0 0 1 0-73.142857z m146.285714 0a36.571429 36.571429 0 1 1 0 73.142857 36.571429 36.571429 0 0 1 0-73.142857z"></path>
  </svg>
);

const SwiperIcon = (props: any) => <Icon type="" component={SwiperSvg} {...props} />;

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
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<SwiperIcon />}
      componentType={'Swiper'}
      onCreateBlockSchema={async ({ item }) => {
        const collection = cm.getCollection(item.name);
        const schema = createGridCardBlockSchema({
          collection: item.name,
          dataSource: item.dataSource,
          rowKey: collection.filterTargetKey || 'id',
          settings: 'blockSettings:gridCard',
        });
        insert(schema);
      }}
    />
  );
};

const createGridCardBlockSchema = (options) => {
  const {
    formItemInitializers = 'ReadPrettyFormItemInitializers',
    actionInitializers = 'GridCardActionInitializers',
    itemActionInitializers = 'GridCardItemActionInitializers',
    collection,
    association,
    resource,
    template,
    dataSource,
    settings,
    ...others
  } = options;
  const resourceName = resource || association || collection;
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resourceName}:view`,
    'x-decorator': 'GridCard.Decorator',
    'x-decorator-props': {
      resource: resourceName,
      collection,
      association,
      dataSource,
      readPretty: true,
      action: 'list',
      params: {
        pageSize: 12,
      },
      runWhenParamsChanged: true,
      ...others,
    },
    'x-component': 'BlockItem',
    'x-component-props': {
      useProps: '{{ useGridCardBlockItemProps }}',
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': settings,
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'SwiperBlock',
      },
    },
  };
  return schema;
};

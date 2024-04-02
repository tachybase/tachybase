import { ISchema } from '@nocobase/schema';
import {
  DataBlockInitializer,
  Icon,
  css,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React, { useState } from 'react';
import { uid } from '@nocobase/utils/client';
import { Button, SearchBar, Tabs, Picker } from 'antd-mobile';

const TabSearchSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M1263.243636 908.939636l-156.485818-156.392727c25.6-37.050182 39.842909-79.685818 39.842909-128.093091 0-125.114182-102.4-227.514182-227.607272-227.514182a228.258909 228.258909 0 0 0-227.514182 227.514182c0 125.207273 102.4 227.607273 227.514182 227.607273 48.407273 0 91.042909-14.242909 128-39.842909l156.392727 156.392727a41.239273 41.239273 0 0 0 59.764363 0c19.921455-17.035636 19.921455-45.428364 0-59.671273zM921.786182 766.696727a140.846545 140.846545 0 0 1-142.242909-142.242909c0-79.592727 62.557091-142.149818 142.242909-142.149818 79.592727 0 142.242909 62.557091 142.242909 142.149818 0 79.685818-62.650182 142.242909-142.242909 142.242909z"></path>
    <path d="M694.272 894.696727H111.150545v-512h583.121455a43.752727 43.752727 0 0 0 42.728727-42.635636 43.752727 43.752727 0 0 0-42.728727-42.728727H111.150545V98.304h853.364364v156.392727a43.752727 43.752727 0 0 0 42.635636 42.635637 43.752727 43.752727 0 0 0 42.728728-42.635637V69.818182a57.064727 57.064727 0 0 0-56.878546-56.878546H82.757818A57.064727 57.064727 0 0 0 25.879273 69.818182v853.364363c0 31.278545 25.6 56.785455 56.785454 56.785455h611.607273a43.752727 43.752727 0 0 0 42.728727-42.635636 43.752727 43.752727 0 0 0-42.728727-42.635637z"></path>
    <path d="M637.393455 155.182545c-22.714182 0-42.635636 21.690182-42.635637 46.545455 0 24.762182 19.921455 46.545455 42.635637 46.545455h28.485818c22.714182 0 42.635636-21.783273 42.635636-46.545455 0-24.855273-19.921455-46.545455-42.635636-46.545455h-28.485818z m-199.121455 0c-22.714182 0-42.635636 21.690182-42.635636 46.545455 0 24.762182 19.921455 46.545455 42.635636 46.545455h28.485818c22.714182 0 42.635636-21.783273 42.635637-46.545455 0-24.855273-19.921455-46.545455-42.635637-46.545455h-28.485818z m-199.121455 0c-22.714182 0-42.635636 21.690182-42.635636 46.545455 0 24.762182 19.921455 46.545455 42.635636 46.545455h28.485819c22.714182 0 42.635636-21.783273 42.635636-46.545455 0-24.855273-19.921455-46.545455-42.635636-46.545455h-28.485819z"></path>
  </svg>
);

const TabSearchIcon = (props: any) => <Icon type="" component={TabSearchSvg} {...props} />;

export const TabSearchBlock = () => {
  const [visible, setVisible] = useState(false);
  const basicColumns = [
    [
      { label: '福建', value: 'Mon' },
      { label: '上海', value: 'Wed' },
    ],
  ];
  return (
    <>
      <div
        className={css`
          display: flex;
          margin-bottom: 8px;
        `}
      >
        <Tabs
          className={css`
            flex: 1;
          `}
        >
          <Tabs.Tab title="水果" key="fruits" />
          <Tabs.Tab title="蔬菜" key="vegetables" />
          <Tabs.Tab title="动物" key="animals" />
        </Tabs>
        <Button onClick={() => setVisible(true)}>全国</Button>
        <Picker
          columns={basicColumns}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
        />
      </div>
      <div
        className={css`
          display: flex;
          margin-bottom: 8px;
        `}
      >
        <SearchBar
          className={css`
            flex: 1;
          `}
          placeholder="请输入内容"
        />
        <Button>搜索</Button>
      </div>
    </>
  );
};

export const TabSearchBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<TabSearchIcon />}
      componentType={'TabSearch'}
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

export const createGridCardBlockSchema = (options) => {
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
    'x-component': 'CardItem',
    'x-component-props': {
      useProps: '{{ useGridCardBlockItemProps }}',
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': settings,
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'TabSearchBlock',
      },
    },
  };
  return schema;
};

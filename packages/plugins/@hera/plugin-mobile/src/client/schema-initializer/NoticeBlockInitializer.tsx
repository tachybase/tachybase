import { ISchema } from '@formily/react';
import {
  Icon,
  DataBlockInitializer,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React from 'react';
import { uid } from '@nocobase/utils/client';
import { NoticeBar } from 'antd-mobile';

const NoticeSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path
      d="M338.773333 362.666667H170.666667v298.666666h105.578666l45.013334 0.021334 17.258666 0.426666L682.666667 809.258667V214.890667L338.773333 362.666667z m-17.578666-85.333334L768 85.333333v853.333334l-448-191.978667L85.333333 746.666667V277.333333h235.861334zM170.666667 661.333333v85.333334h85.333333v-85.333334H170.666667zM853.333333 298.666667h85.333334v426.666666h-85.333334z"
      fill="#000000"
    ></path>
  </svg>
);

const NoticeIcon = (props: any) => <Icon type="" component={NoticeSvg} {...props} />;

export const NoticeBlock = () => {
  return <NoticeBar content="月底冲量佣金上调" color="alert" />;
};

export const NoticeBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<NoticeIcon />}
      componentType={'Notice'}
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
    'x-component': 'BlockItem',
    'x-component-props': {
      useProps: '{{ useGridCardBlockItemProps }}',
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': settings,
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'NoticeBlock',
      },
    },
  };
  return schema;
};

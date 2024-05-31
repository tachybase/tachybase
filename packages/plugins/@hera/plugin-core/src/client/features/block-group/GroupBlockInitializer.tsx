import React, { createContext, useState } from 'react';
import {
  BlockProvider,
  DataBlockInitializer,
  Icon,
  SchemaSettings,
  SchemaToolbar,
  SchemaToolbarProps,
  useBlockRequestContext,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { Spin } from 'antd';

import { GroupBlockConfigure } from './GroupBlockConfigure';

export const GroupBlockContext = createContext<any>({});

const GroupSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path
      d="M833.179846 36.584242h-73.160824a36.516572 36.516572 0 0 0 0 73.160824h73.160824c20.173491 0 36.516572 16.343081 36.516572 36.580412v768.060967a36.580412 36.580412 0 0 1-36.516572 36.580412H174.860114a36.580412 36.580412 0 0 1-36.580412-36.580412V146.325478c0-20.173491 16.343081-36.580412 36.580412-36.580412h73.160824a36.516572 36.516572 0 1 0 0-73.160824H174.860114A109.805076 109.805076 0 0 0 65.118879 146.325478v768.060967c0 60.584312 49.156923 109.741235 109.741235 109.741235h658.383572a109.805076 109.805076 0 0 0 109.677395-109.741235V146.325478A109.805076 109.805076 0 0 0 833.179846 36.584242z"
      fill="#2C2C2C"
    ></path>
    <path
      d="M357.826013 146.325478h292.451774a36.516572 36.516572 0 0 0 36.580412-36.580412V36.584242A36.516572 36.516572 0 0 0 650.277787 0.00383H357.826013a36.516572 36.516572 0 0 0-36.580412 36.580412v73.160824c0 20.173491 16.343081 36.580412 36.580412 36.580412z m-36.708092 622.888443a36.580412 36.580412 0 0 0 36.580412-36.580412V512.065755a36.516572 36.516572 0 1 0-73.096984 0v220.567754c0 20.173491 16.279241 36.580412 36.516572 36.580412z m146.321647-330.308989v293.728577a36.580412 36.580412 0 1 0 73.160824 0V438.904932a36.580412 36.580412 0 1 0-73.160824 0z m182.838219-146.321647v440.050224a36.644252 36.644252 0 0 0 73.160824 0V292.583285a36.644252 36.644252 0 0 0-73.160824 0z"
      fill="#2C2C2C"
    ></path>
  </svg>
);

const GroupIcon = (props: any) => <Icon type="" component={GroupSvg} {...props} />;

const InternalGroupBlockProvider = (props) => {
  const field = useField<any>();
  const { resource, service } = useBlockRequestContext();
  const [visible, setVisible] = useState(false);
  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  field.loaded = true;
  return (
    <GroupBlockContext.Provider
      value={{
        props: {
          resource: props.resource,
        },
        field,
        service,
        resource,
        visible,
        setVisible,
      }}
    >
      {props.children}
    </GroupBlockContext.Provider>
  );
};

export const GroupBlockProvider = (props) => {
  const params = { ...props.params };
  return (
    <BlockProvider name="group" {...props} params={params}>
      <InternalGroupBlockProvider {...props} params={params} />
    </BlockProvider>
  );
};

const createGroupBlockSchema = (options) => {
  const { collection, groupField } = options;
  const sumItem = [];
  collection?.fields.forEach((value) => {
    if (value.interface === 'number' || (value.interface === 'formula' && value.dataType === 'double')) {
      sumItem.push({
        label: value.uiSchema.title,
        field: [value.name],
        aggregation: 'sum',
        display: true,
      });
    }
  });
  const schema: ISchema = {
    title: collection.title,
    type: 'void',
    'x-acl-action': `${collection.name}:list`,
    'x-decorator': 'GroupBlockProvider',
    'x-decorator-props': {
      collection: collection.name,
      resource_deprecated: 'charts',
      action: 'query',
      groupField,
      params: {
        collection: collection.name,
        measures: sumItem,
      },
    },
    'x-toolbar': 'GroupBlockToolbar',
    'x-settings': 'groupBlockSettings',
    'x-component': 'CardItem',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'GroupBlock',
      },
    },
  };
  if (!sumItem.length) {
    delete schema['x-decorator-props']['resource_deprecated'];
  }
  if (collection.template === 'view' && !sumItem.length) {
    delete schema['x-decorator-props']['action'];
    delete schema['x-decorator-props']['groupField'];
  }
  return schema;
};

export const GroupBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<GroupIcon />}
      onCreateBlockSchema={async ({ item }) => {
        const collection = cm.getCollection(item.name);
        insert(
          createGroupBlockSchema({
            collection,
          }),
        );
      }}
    />
  );
};

export const groupBlockSettings = new SchemaSettings({
  name: 'groupBlockSettings',
  items: [
    {
      name: 'Configure',
      Component: 'GroupBlockConfigure',
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
      },
    },
  ],
});

export const GroupBlockToolbar = (
  props: React.JSX.IntrinsicAttributes & SchemaToolbarProps & { children?: React.ReactNode },
) => {
  const fieldSchema = useFieldSchema();
  return <SchemaToolbar title={fieldSchema.title} settings={fieldSchema['x-settings']} {...props} />;
};

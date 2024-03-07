import { TableOutlined } from '@ant-design/icons';
import { ISchema, useField, useFieldSchema, useForm } from '@formily/react';
import {
  useSchemaInitializer,
  useSchemaInitializerItem,
  SchemaSettings,
  SchemaToolbar,
  DataBlockInitializer,
  useCollectionManager_deprecated,
  useBlockRequestContext,
  BlockProvider,
  __UNSAFE__,
  SchemaSettingsSwitchItem,
  useDesignable,
} from '@nocobase/client';
import React, { createContext, useState } from 'react';
import { uid } from '@nocobase/utils/client';
import { Checkbox, Spin } from 'antd';
import { GroupBlockConfigure } from '../components/GroupBlockConfigure/GroupBlockConfigure';
import { GroupConfigure } from '../components/GroupBlockConfigure/GroupConfigure';

export const GroupBlockContext = createContext<any>({});

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
      <GroupConfigure />
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
      resource: 'charts',
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
  return schema;
};

export const GroupBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { getCollection } = useCollectionManager_deprecated();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<TableOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const collection = getCollection(item.name);
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
      type: 'itemGroup',
      name: 'displayFields',
      componentProps: { title: 'display Fields' },
      useChildren() {
        const item = [];
        const { dn } = useDesignable();
        const fieldSchema = useFieldSchema();
        const measures = fieldSchema['x-decorator-props'].params?.measures;
        if (measures && measures.length) {
          measures.forEach((value) => {
            item.push({
              type: 'item',
              Component: () => (
                <SchemaSettingsSwitchItem
                  title={value.label}
                  checked={value.display}
                  onChange={(chang) => {
                    value.display = chang;
                    dn.emit('patch', {
                      schema: fieldSchema,
                    });
                    dn.refresh();
                  }}
                />
              ),
            });
          });
        }
        return item;
      },
    },
    {
      name: 'Configure',
      Component: GroupBlockConfigure,
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

export const GroupBlockToolbar = (props) => {
  const fieldSchema = useFieldSchema();
  return <SchemaToolbar title={fieldSchema.title} settings={fieldSchema['x-settings']} {...props} />;
};

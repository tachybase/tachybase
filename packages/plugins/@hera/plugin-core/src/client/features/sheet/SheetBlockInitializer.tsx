import React, { createContext, useRef } from 'react';
import {
  DataBlockInitializer,
  DataBlockProvider,
  SchemaSettings,
  SchemaToolbar,
  useCollectionManager,
  useDataBlockRequest,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { TableOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';

import Sheet, { SheetRef } from '../../components/excel-table/Sheet';
import { demoData } from '../../components/x-sheet/demo';

export const SheetBlockContext = createContext<any>({});

const InternalSheetBlockProvider = (props) => {
  const field = useField<any>();
  const service = useDataBlockRequest();
  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  field.loaded = true;
  return (
    <SheetBlockContext.Provider
      value={{
        field,
        service,
      }}
    >
      {props.children}
    </SheetBlockContext.Provider>
  );
};

export const SheetBlock = () => {
  const ref = useRef<SheetRef>();
  return (
    <div style={{ height: '70vh' }}>
      <Button onClick={() => console.log('data', ref.current.getData())}>显示数据</Button>
      <Sheet ref={ref} data={demoData} />
    </div>
  );
};

export const SheetBlockProvider = (props) => {
  return (
    <DataBlockProvider name="sheet" {...props}>
      <InternalSheetBlockProvider {...props} />
    </DataBlockProvider>
  );
};

const createSheetBlockSchema = (options) => {
  const { collection } = options;
  const schema: ISchema = {
    title: collection.title,
    type: 'void',
    'x-acl-action': `${collection.name}:list`,
    'x-decorator': 'SheetBlockProvider',
    'x-decorator-props': {
      collection: collection.name,
    },
    'x-toolbar': 'SheetBlockToolbar',
    'x-settings': 'sheetBlockSettings',
    'x-component': 'CardItem',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'SheetBlock',
      },
    },
  };
  return schema;
};

export const SheetBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();
  return (
    <DataBlockInitializer
      {...itemConfig}
      icon={<TableOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const collection = cm.getCollection(item.name);
        insert(
          createSheetBlockSchema({
            collection,
          }),
        );
      }}
    />
  );
};

export const sheetBlockSettings = new SchemaSettings({
  name: 'sheetBlockSettings',
  items: [
    {
      name: 'remove',
      type: 'remove',
    },
  ],
});

export const SheetBlockToolbar = (props) => {
  const fieldSchema = useFieldSchema();
  return <SchemaToolbar title={fieldSchema.title} settings={fieldSchema['x-settings']} {...props} />;
};

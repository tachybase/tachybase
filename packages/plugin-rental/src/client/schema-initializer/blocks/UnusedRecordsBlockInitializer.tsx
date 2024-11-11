import React from 'react';
import {
  Application,
  SchemaInitializerItem,
  SchemaSettings,
  SchemaToolbar,
  useRequest,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { ToolOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

export class UnusedRecordsBlockHelper {
  constructor(private app: Application) {}
  async load() {
    this.app.schemaSettingsManager.add(unusedRecordsBlockSettings);
    this.app.schemaInitializerManager.get('page:addBlock').add('otherBlocks.unusedRecords', {
      name: 'unusedRecords',
      title: 'unusedRecords',
      Component: UnusedRecordsBlockInitializer.displayName,
    });
    this.app.addComponents({
      UnusedRecordsBlock,
      UnusedRecordsBlockInitializer,
      UnusedRecordsBlockToolbar,
    });
  }
}

export const UnusedRecordsBlock: React.FC = () => {
  const { data } = useRequest<any>({ resource: 'records', action: 'unused' });
  return <div>{data?.data?.map((number) => <Tag key={number}>{number}</Tag>)}</div>;
};

UnusedRecordsBlock.displayName = 'UnusedRecordsBlock';

export const UnusedRecordsBlockInitializer: React.FC = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<ToolOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-toolbar': 'UnusedRecordsBlockToolbar',
          'x-settings': 'unusedRecordsBlockSettings',
          'x-component': 'CardItem',
          properties: {
            viewer: {
              type: 'void',
              'x-component': 'UnusedRecordsBlock',
            },
          },
        });
      }}
    />
  );
};
UnusedRecordsBlockInitializer.displayName = 'UnusedRecordsBlockInitializer';

export const unusedRecordsBlockSettings = new SchemaSettings({
  name: 'unusedRecordsBlockSettings',
  items: [
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
      },
    },
  ],
});

export const UnusedRecordsBlockToolbar: React.FC = (props) => {
  const fieldSchema = useFieldSchema();
  return <SchemaToolbar title={fieldSchema.title} settings={fieldSchema['x-settings']} {...props} />;
};

UnusedRecordsBlockToolbar.displayName = 'UnusedRecordsBlockToolbar';

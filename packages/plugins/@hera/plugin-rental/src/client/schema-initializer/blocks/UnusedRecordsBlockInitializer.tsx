import React from 'react';
import {
  Application,
  SchemaInitializerItem,
  SchemaSettings,
  SchemaToolbar,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import { useFieldSchema } from '@formily/react';
import { ToolOutlined } from '@ant-design/icons';

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
  return <div>没使用的单号</div>;
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

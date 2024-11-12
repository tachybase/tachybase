import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { MenuOutlined } from '@ant-design/icons';

export const MMenuBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      icon={<MenuOutlined />}
      onClick={async () => {
        insert({
          type: 'void',
          'x-component': 'MMenu',
          'x-designer': 'MMenu.Designer',
          'x-component-props': {},
        });
      }}
      {...itemConfig}
    />
  );
};

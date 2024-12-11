import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { SettingOutlined } from '@ant-design/icons';

export const MSettingsBlockInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      icon={<SettingOutlined />}
      onClick={async () => {
        insert({
          type: 'void',
          'x-component': 'MSettings',
          'x-designer': 'MSettings.Designer',
          'x-component-props': {},
        });
      }}
      {...itemConfig}
    />
  );
};

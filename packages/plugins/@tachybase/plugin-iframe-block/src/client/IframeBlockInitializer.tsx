import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { Html5Outlined } from '@ant-design/icons';

export const IframeBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<Html5Outlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-settings': 'blockSettings:iframe',
          'x-decorator': 'BlockItem',
          'x-decorator-props': {
            name: 'iframe',
          },
          'x-component': 'Iframe',
          'x-component-props': {},
        });
      }}
    />
  );
};

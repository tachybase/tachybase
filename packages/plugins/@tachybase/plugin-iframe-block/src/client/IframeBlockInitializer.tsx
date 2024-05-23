import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { FormOutlined } from '@ant-design/icons';

export const IframeBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<FormOutlined />}
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

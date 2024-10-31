import React from 'react';
import {
  createTableBlockSchema,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { TableOutlined } from '@ant-design/icons';

import { AppManager } from './AppManager';
import { usePluginUtils } from './utils';

export const MultiAppBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = usePluginUtils();
  const itemConfig = useSchemaInitializerItem();

  return (
    <SchemaInitializerItem
      {...itemConfig}
      onClick={() => {
        insert({
          type: 'void',
          'x-decorator-props': {},
          'x-component': 'CardItem',
          // 'x-designer': 'TableBlockDesigner',
          'x-toolbar': 'BlockSchemaToolbar',
          'x-settings': 'blockSettings:table',
          properties: {
            app: {
              type: 'void',
              'x-component': 'AppManager',
            },
          },
        });
      }}
      // title={t('Multi app manager')}
    />
  );
};

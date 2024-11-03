import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

export const RunesweeperBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();

  return (
    <SchemaInitializerItem
      {...itemConfig}
      onClick={() => {
        insert({
          type: 'void',
          'x-decorator-props': {},
          'x-component': 'CardItem',
          'x-settings': 'RunesweeperSettings',
          properties: {
            runesweeper: {
              type: 'void',
              'x-component': 'Runesweeper',
            },
          },
        });
      }}
    />
  );
};

import React from 'react';
import { merge } from '@tachybase/schema';

import { SchemaInitializerSwitch, useSchemaInitializer, useSchemaInitializerItem } from '../../../application';
import { useCurrentSchema } from '../../../schema-initializer/utils';

export const AssociationFilterDesignerDisplayField = () => {
  const itemConfig = useSchemaInitializerItem();
  const { schema } = itemConfig;
  const { exists, remove } = useCurrentSchema(schema.name, 'name', itemConfig.find, itemConfig.remove);
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerSwitch
      checked={exists}
      title={itemConfig.title}
      onClick={() => {
        if (exists) {
          return remove();
        }
        const s = merge(schema || {}, itemConfig.schema || {});
        itemConfig?.schemaInitialize?.(s);
        insert(s);
      }}
    />
  );
};

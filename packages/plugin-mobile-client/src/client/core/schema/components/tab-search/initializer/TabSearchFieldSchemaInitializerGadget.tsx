import React from 'react';
import {
  SchemaInitializerSwitch,
  useCurrentSchema,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import { merge } from '@tachybase/schema';

export const TabSearchFieldSchemaInitializerGadget = () => {
  const itemConfig = useSchemaInitializerItem();
  const { schema } = itemConfig;
  const { exists, remove } = useCurrentSchema(schema.name, 'name', itemConfig.find, itemConfig.remove);
  const { insert } = useSchemaInitializer();

  const onClick = () => {
    if (exists) {
      return remove();
    }
    const s = merge(schema || {}, itemConfig.schema || {});
    itemConfig?.schemaInitialize?.(s);
    insert(s);
  };

  return <SchemaInitializerSwitch checked={exists} title={itemConfig.title} onClick={onClick} />;
};

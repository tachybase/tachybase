import {
  SchemaInitializerSwitch,
  useCurrentSchema,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import { merge } from '@nocobase/schema';
import React from 'react';

export const ImageSearchItemIntializer = () => {
  const { insert } = useSchemaInitializer();

  const itemConfig = useSchemaInitializerItem();

  const { schema: oldSchema, title } = itemConfig;
  const { exists, remove } = useCurrentSchema(oldSchema.name, 'name', itemConfig.find, itemConfig.remove);

  const onClick = () => {
    if (exists) {
      return remove();
    }
    const { schema: latestSchema } = itemConfig;

    const newSchema = merge(oldSchema || {}, latestSchema || {});

    insert(newSchema);
  };

  return <SchemaInitializerSwitch checked={exists} title={title} onClick={onClick} />;
};

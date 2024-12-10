import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { getSchemaBlockInitItem } from './BlockInitItem.schema';

export const ViewBlockInitItem = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const handleClick = ({ item }) => {
    const schema = getSchemaBlockInitItem({ item });
    insert(schema);
  };
  return <SchemaInitializerItem {...schemaInitializerItem} onClick={handleClick} />;
};

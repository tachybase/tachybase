import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { getSchemaTableMessagesWrapper } from '../components/TableMessagesWrapper.schema';

export const ViewBlockInitItem = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const handleClick = () => {
    const schema = getSchemaTableMessagesWrapper();
    insert(schema);
  };
  return <SchemaInitializerItem {...schemaInitializerItem} onClick={handleClick} />;
};

import React from 'react';
import { BlockInitializer, useSchemaInitializerItem } from '@tachybase/client';

export const CustomizeActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  return <BlockInitializer {...itemConfig} item={itemConfig} />;
};

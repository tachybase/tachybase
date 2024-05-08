import React from 'react';
import { InitializerWithSwitch, useSchemaInitializerItem } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

export const CollectionFieldInitializer = () => {
  const schema: ISchema = {};
  const itemConfig = useSchemaInitializerItem();
  return <InitializerWithSwitch {...itemConfig} item={itemConfig} schema={schema} type={'name'} />;
};

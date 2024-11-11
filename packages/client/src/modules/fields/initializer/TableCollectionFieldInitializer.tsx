import React from 'react';
import { ISchema } from '@tachybase/schema';

import { useSchemaInitializerItem } from '../../../application';
import { InitializerWithSwitch } from '../../../schema-initializer/items/InitializerWithSwitch';

export const TableCollectionFieldInitializer = () => {
  const schema: ISchema = {};
  const itemConfig = useSchemaInitializerItem();
  return <InitializerWithSwitch {...itemConfig} schema={schema} item={itemConfig} type={'x-collection-field'} />;
};

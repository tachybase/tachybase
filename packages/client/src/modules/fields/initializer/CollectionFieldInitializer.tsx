import React from 'react';
import { ISchema } from '@tachybase/schema';

import { useSchemaInitializerItem } from '../../../application';
import { InitializerWithSwitch } from '../../../schema-initializer/items/InitializerWithSwitch';

export const CollectionFieldInitializer = () => {
  const schema: ISchema = {};
  const itemConfig = useSchemaInitializerItem();
  return <InitializerWithSwitch {...itemConfig} item={itemConfig} schema={schema} type={'x-collection-field'} />;
};

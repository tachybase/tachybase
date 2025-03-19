import { useCallback } from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { schemaMultiAppBlock as schema } from './MultiAppBlock.schema';

export const MultiAppBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  const handleClick = useCallback(() => insert(schema), [insert]);

  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} />;
};

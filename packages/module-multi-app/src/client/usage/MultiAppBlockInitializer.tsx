import { useCallback } from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { schemaMultiAppBlockInitializer } from './MultiAppBlockInitializer.schema';

export const MultiAppBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  const handleClick = useCallback(() => insert(schemaMultiAppBlockInitializer), [insert]);

  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} />;
};

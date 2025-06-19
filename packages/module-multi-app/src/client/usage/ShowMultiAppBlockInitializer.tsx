import { useCallback } from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { schemaShowMultiAppBlockInitializer } from './ShowMultiAppBlockInitializer.schema';

export const ShowMultiAppBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  const handleClick = useCallback(() => insert(schemaShowMultiAppBlockInitializer), [insert]);

  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} />;
};

import React from 'react';
import {
  DataBlockInitializer,
  useCollectionManager,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';

import { getRemoteSchemaGroupBlock } from './GroupBlock.schema';
import { GroupIcon } from './GroupIcon';

export const GroupBlockInitializer = () => {
  const cm = useCollectionManager();
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const handleCresteBlockSchema = async ({ item }) => {
    const collection = cm.getCollection(item.name);
    const remoteSchema = getRemoteSchemaGroupBlock({
      collection,
    });
    insert(remoteSchema);
  };

  return <DataBlockInitializer {...itemConfig} icon={<GroupIcon />} onCreateBlockSchema={handleCresteBlockSchema} />;
};

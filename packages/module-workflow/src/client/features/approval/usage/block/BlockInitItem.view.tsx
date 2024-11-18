import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { getSchemaBlockInitItem } from './BlockInitItem.schema';

// 添加卡片-审批(发起/待办)
export const ViewBlockInitItem = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const onClick = ({ item }) => {
    const schema = getSchemaBlockInitItem({ item });
    insert(schema);
  };

  return <SchemaInitializerItem {...schemaInitializerItem} onClick={onClick} />;
};

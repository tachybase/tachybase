import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { getSchemaApprovalBlockItem } from './ApprovalBlockItem.schema';

// 添加卡片-审批(发起/待办)
export const ApprovalBlockComponent = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const onClick = ({ item }) => {
    const schema = getSchemaApprovalBlockItem({ item });
    insert(schema);
  };

  return <SchemaInitializerItem {...schemaInitializerItem} onClick={onClick} />;
};

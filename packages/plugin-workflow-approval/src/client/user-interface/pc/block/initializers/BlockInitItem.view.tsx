import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { getRemoteSchemaBlockInitItem } from './BlockInitItem.schema';

// 添加卡片-审批(发起/待办)
export const ViewBlockInitItem = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const onClick = ({ item }) => {
    const remoteSchema = getRemoteSchemaBlockInitItem({ item });
    insert(remoteSchema);
  };

  return <SchemaInitializerItem {...schemaInitializerItem} onClick={onClick} />;
};

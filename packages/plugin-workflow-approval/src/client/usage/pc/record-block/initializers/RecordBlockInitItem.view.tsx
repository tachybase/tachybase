import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { AuditOutlined } from '@ant-design/icons';

import { getRemoteSchemaRecordBlockInitItem } from './RecordBlockInitItem.remote';

// 初始化器,添加卡片-相关审批
export const ViewRecordBlockInitItem = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const onClick = () => {
    const remoteSchema = getRemoteSchemaRecordBlockInitItem();
    insert(remoteSchema);
  };
  return <SchemaInitializerItem icon={<AuditOutlined />} {...schemaInitializerItem} onClick={onClick} />;
};

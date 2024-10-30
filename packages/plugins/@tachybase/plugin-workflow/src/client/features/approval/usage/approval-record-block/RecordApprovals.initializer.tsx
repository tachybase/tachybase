import React from 'react';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { AuditOutlined } from '@ant-design/icons';

// 初始化器,添加区块-相关审批
export function RecordApprovalsInitializer() {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      icon={<AuditOutlined />}
      {...schemaInitializerItem}
      onClick={() => {
        const id = uid();
        insert({
          type: 'void',
          name: id,
          'x-uid': id,
          'x-decorator': 'ApprovalRecordBlock.Decorator',
          'x-component': 'CardItem',
          'x-designer': 'List.Designer',
          properties: {
            block: {
              type: 'void',
              'x-component': 'ApprovalRecordBlock.ViewComponent',
            },
          },
        });
      }}
    />
  );
}

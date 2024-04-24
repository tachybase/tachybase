import { AuditOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import { uid } from '@nocobase/utils/client';
import React from 'react';

// 初始化器,创建区块-相关审批
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

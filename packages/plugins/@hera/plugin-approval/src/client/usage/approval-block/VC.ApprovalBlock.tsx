import { TableOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import { uid } from '@nocobase/utils/client';
import React from 'react';
import { NAMESPACE } from '../../locale';
import { PathNameMap_ApprovalBlock } from './map';

// 创建区块-审批(发起/待办)
export const ApprovalBlockComponent = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      icon={<TableOutlined />}
      {...schemaInitializerItem}
      items={[
        {
          type: 'item',
          title: `{{t("Launch", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'ApprovalBlock.Launch',
          collection: 'approvals',
          params: {
            appends: ['createdBy.nickname', 'workflow.title', 'workflow.enabled'],
            except: ['data'],
          },
        },
        {
          type: 'item',
          title: `{{t("Todos", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'ApprovalBlock.Todos',
          collection: 'approvalRecords',
          params: {
            appends: [
              'user.id',
              'user.nickname',
              'node.id',
              'node.title',
              'job.id',
              'job.status',
              'job.result',
              'workflow.id',
              'workflow.title',
              'workflow.enabled',
              'execution.id',
              'execution.status',
            ],
          },
        },
      ]}
      onClick={({ item }) => {
        const id = uid();
        insert({
          type: 'void',
          name: id,
          'x-uid': id,
          'x-component': 'CardItem',
          'x-decorator': PathNameMap_ApprovalBlock.Decorator,
          'x-decorator-props': {
            collection: item.collection,
            action: 'listCentralized',
            params: item.params,
          },
          'x-designer': 'TableBlockDesigner',
          properties: {
            block: {
              type: 'void',
              'x-component': item['x-component'],
            },
          },
        });
      }}
    />
  );
};

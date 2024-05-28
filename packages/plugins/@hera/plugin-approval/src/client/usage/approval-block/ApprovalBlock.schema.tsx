import React from 'react';
import { Plugin, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { TableOutlined } from '@ant-design/icons';

import { NAMESPACE } from '../../locale';
import { ApprovalBlockProvider } from './ApprovalBlock.provider';
import { ApprovalBlockLaunch } from './launch/VC.ApprovalBlockLaunch';
import { ApprovalBlockTodos } from './todos/VC.ApprovalBlockTodos';

export class SCApprovalBlock extends Plugin {
  async load() {
    this.app.addComponents({
      'ApprovalBlock.Decorator': ApprovalBlockProvider,
      'ApprovalBlock.Launch': ApprovalBlockLaunch,
      'ApprovalBlock.Todos': ApprovalBlockTodos,
    });
  }
}

const schemaItems = [
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
];

const getSchemaInsert = ({ item }) => {
  const id = uid();
  const { collection, params, ['x-component']: xcomponent } = item;
  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-designer': 'TableBlockDesigner',
    'x-decorator': 'ApprovalBlock.Decorator',
    'x-decorator-props': {
      collection,
      params,
      action: 'listCentralized',
    },
    'x-component': 'CardItem',
    properties: {
      block: {
        type: 'void',
        'x-component': xcomponent,
      },
    },
  };
};

// 创建区块-审批(发起/待办)
export const ApprovalBlockComponent = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const onClick = ({ item }) => {
    const schema = getSchemaInsert({ item });
    insert(schema);
  };

  return (
    <SchemaInitializerItem icon={<TableOutlined />} {...schemaInitializerItem} items={schemaItems} onClick={onClick} />
  );
};

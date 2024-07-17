import React from 'react';
import { Plugin, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { TableOutlined } from '@ant-design/icons';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../../common/constants';
import { NAMESPACE } from '../../locale';
import { ApprovalBlockProvider } from './ApprovalBlock.provider';
import { CarbonCopyBlockProvider } from './carbon-copy/CarbonCopyBlock.provider';
import { CarbonCopyCenter } from './carbon-copy/CarbonCopyCenter.schema';
import { ApprovalBlockLaunch } from './launch/VC.ApprovalBlockLaunch';
import { ApprovalBlockLaunchApplication } from './launch/VC.ApprovalBlockLaunchApplication';
import { ApprovalBlockTodos } from './todos/VC.ApprovalBlockTodos';

export class SCApprovalBlock extends Plugin {
  async load() {
    this.app.addComponents({
      'ApprovalBlock.Decorator': ApprovalBlockProvider,
      'ApprovalBlock.Launch': ApprovalBlockLaunch,
      'ApprovalBlock.Launch.Application': ApprovalBlockLaunchApplication,
      'ApprovalBlock.Todos': ApprovalBlockTodos,
      CarbonCopyBlockProvider: CarbonCopyBlockProvider,
      CarbonCopyCenter: CarbonCopyCenter,
    });
  }
}

const schemaItems = [
  {
    type: 'itemGroup',
    name: 'Launch',
    title: `{{t("Launch", { ns: "${NAMESPACE}" })}}`,
    children: [
      {
        type: 'item',
        title: `{{t("Launch", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'ApprovalBlock.Launch.Application',
        collection: 'workflows',
        action: 'list',
      },
      {
        type: 'item',
        title: `{{t("MyLaunch", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'ApprovalBlock.Launch',
        collection: 'approvals',
        params: {
          appends: ['createdBy.nickname', 'workflow.title', 'workflow.enabled'],
          except: ['data'],
        },
      },
    ],
  },
  {
    type: 'item',
    title: `{{t("Todos", { ns: "${NAMESPACE}" })}}`,
    'x-component': 'ApprovalBlock.Todos',
    collection: 'approvalRecords',
    params: {
      appends: [
        'createdBy.id',
        'createdBy.nickname',
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
  {
    type: 'item',
    title: `{{t("CarbonCopy", { ns: "${NAMESPACE}" })}}`,
    'x-decorator': 'CarbonCopyBlockProvider',
    'x-component': 'CarbonCopyCenter',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:table',
    collection: COLLECTION_NAME_APPROVAL_CARBON_COPY,
    params: {
      appends: [
        'createdBy.id',
        'createdBy.nickname',
        'approval.status',
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
  const {
    collection,
    params,
    ['x-component']: xcomponent,
    action,
    ['x-decorator']: decorator,
    ['x-toolbar']: toolbar,
    ['x-settings']: settings,
  } = item;
  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-designer': 'TableBlockDesigner',
    'x-decorator': decorator || 'ApprovalBlock.Decorator',
    'x-decorator-props': {
      collection,
      params,
      action: action || 'listCentralized',
    },
    'x-component': 'CardItem',
    'x-toolbar': toolbar,
    'x-settings': settings,
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

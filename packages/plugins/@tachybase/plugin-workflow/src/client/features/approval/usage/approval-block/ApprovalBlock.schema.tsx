import React from 'react';
import { Plugin, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../../common/constants';
import { NAMESPACE } from '../../locale';
import { ApprovalBlockProvider } from './ApprovalBlock.provider';
import { CarbonCopyBlockProvider } from './carbon-copy/CarbonCopyBlock.provider';
import { CarbonCopyCenter } from './carbon-copy/CarbonCopyCenter.schema';
import { ApprovalBlockLaunch } from './launch/VC.ApprovalBlockLaunch';
import { ApprovalBlockLaunchApplication } from './launch/VC.ApprovalBlockLaunchApplication';
import { ViewApprovalBlockTodos } from './todos/ApprovalBlockTodos';

export class SCApprovalBlock extends Plugin {
  async load() {
    this.app.addComponents({
      'ApprovalBlock.Decorator': ApprovalBlockProvider,
      'ApprovalBlock.Launch': ApprovalBlockLaunch,
      'ApprovalBlock.Launch.Application': ApprovalBlockLaunchApplication,
      'ApprovalBlock.Todos': ViewApprovalBlockTodos,
      CarbonCopyBlockProvider: CarbonCopyBlockProvider,
      CarbonCopyCenter: CarbonCopyCenter,
    });
  }
}

export const schemaItems = [
  {
    type: 'item',
    icon: 'ClockCircleOutlined',
    title: `{{t("Initiate Request", { ns: "${NAMESPACE}" })}}`,
    'x-component': 'ApprovalBlock.Launch.Application',
    collection: 'workflows',
    action: 'list',
    Component: 'ApprovalBlock.BlockInitializer',
    useInsert: () => {
      return (schema) => {
        console.log('🚀 ~ file: ApprovalBlock.schema.tsx:45 ~ return ~ schema:', schema);
      };
    },
  },
  {
    type: 'item',
    icon: 'AuditOutlined',
    Component: 'ApprovalBlock.BlockInitializer',
    title: `{{t("My Requests", { ns: "${NAMESPACE}" })}}`,
    'x-component': 'ApprovalBlock.Launch',
    collection: 'approvals',
    params: {
      appends: [
        'createdBy.nickname',
        'workflow.title',
        'workflow.enabled',
        'records.id',
        'records.status',
        'records.node.title',
      ],
      except: ['data'],
    },
  },
  {
    type: 'item',
    icon: 'FormOutlined',
    Component: 'ApprovalBlock.BlockInitializer',
    title: `{{t("My Pending Tasks", { ns: "${NAMESPACE}" })}}`,
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
    icon: 'MailOutlined',
    Component: 'ApprovalBlock.BlockInitializer',
    title: `{{t("CC'd to Me", { ns: "${NAMESPACE}" })}}`,
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

export const getSchemaInsert = ({ item }) => {
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

// 添加区块-审批(发起/待办)
export const ApprovalBlockComponent = () => {
  const schemaInitializerItem = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();

  const onClick = ({ item }) => {
    const schema = getSchemaInsert({ item });
    insert(schema);
  };

  return <SchemaInitializerItem {...schemaInitializerItem} onClick={onClick} />;
};

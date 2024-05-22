import {
  ExtendCollectionsProvider,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import React from 'react';
import { ISchema } from '@tachybase/schema';
import { CalendarOutline } from 'antd-mobile-icons';
import { CollectionWorkflows } from './collection/Workflows.collection';
import { CollectionFlowNodes } from './collection/FlowNodes.collection';
import { CollectionApprovals } from './collection/Approvals.collection';
import { CollectionApprovalTodos } from './collection/ApprovalTodos';

export const ApprovalBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  const onCreateBlockSchema = async ({ item }) => {
    const schema: ISchema = {
      type: 'void',
      name: item.name,
      title: item.title,
      'x-toolbar': 'BlockSchemaToolbar',
      'x-settings': 'ApprovalSettings',
      'x-component': item.itemComponent,
      'x-component-props': {
        collectionName: item.collectionName,
      },
    };
    insert(schema);
  };
  return (
    <SchemaInitializerItem
      {...itemConfig}
      title="Approval"
      icon={<CalendarOutline />}
      items={ApprovalInitializerItem}
      onClick={onCreateBlockSchema}
    ></SchemaInitializerItem>
  );
};

export const ApprovalInitializerItem = [
  {
    type: 'itemGroup',
    name: 'initiations',
    title: '发起',
    children: [
      {
        type: 'item',
        name: 'initiationsApproval',
        title: '发起申请',
        itemComponent: 'InitiationsBlock',
        collectionName: 'workflows',
      },
      {
        type: 'item',
        name: 'currApproval',
        title: '我发起的',
        itemComponent: 'UserInitiationsBlock',
        dataSource: 'main',
        collectionName: 'approvals',
      },
    ],
  },
  {
    type: 'item',
    title: '审批',
    name: 'todos',
    itemComponent: 'TodosBlock',
    collectionName: 'approvalRecords',
  },
];

import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider, useRecord } from '@tachybase/client';
import { CollectionApprovalTodos } from '../../common/Cn.ApprovalTodos';
import { CollectionApprovals } from '../approval-common/Approvals.collection';
import { CollectionFlowNodes } from '../approval-common/FlowNodes.collection';
import { CollectionWorkflows } from '../approval-common/Workflows.collection';

export function ApprovalBlockDecorator({ children, ...props }) {
  const {
    collection,
    action = 'list',
    params = {
      filter: {},
    },
  } = props;

  const record = useRecord();
  const config = {
    collection,
    resource: collection,
    action,
    params: {
      pageSize: 20,
      sort: ['-createdAt'],
      ...params,
      filter: record?.id ? { dataKey: `${record.id}`, ...params.filter } : { ...params.filter },
    },
    rowKey: 'id',
    showIndex: true,
    dragSort: false,
  };

  return (
    <ExtendCollectionsProvider
      collections={[CollectionWorkflows, CollectionFlowNodes, CollectionApprovals, CollectionApprovalTodos]}
    >
      <TableBlockProvider name={collection} {...config}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
}

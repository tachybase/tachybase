import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider, useRecord } from '@tachybase/client';

import { CollectionApprovalTodos } from '../../collections/approvalRecords.collection';
import { CollectionApprovals } from '../../collections/approvals.collection';
import { CollectionFlowNodes } from '../../collections/flowNodes.collection';
import { CollectionWorkflows } from '../../collections/workflows.collection';

export const ApprovalBlockProvider = ({ children, ...props }) => {
  const {
    collection,
    params = {
      filter: {},
    },
    action = 'list',
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
      filter: record?.id
        ? {
            dataKey: `${record.id}`,
            ...params.filter,
          }
        : { ...params.filter },
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
};

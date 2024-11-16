import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider, useRecord } from '@tachybase/client';

import { collectionApprovalTodos } from '../../collections/approvalRecords';
import { CollectionApprovals } from '../../collections/approvals';
import { CollectionFlowNodes } from '../../collections/flowNodes';
import { CollectionWorkflows } from '../../collections/workflows';

export const ProviderApprovalBlockItem = ({ children, ...props }) => {
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
      collections={[CollectionWorkflows, CollectionFlowNodes, CollectionApprovals, collectionApprovalTodos]}
    >
      <TableBlockProvider name={collection} {...config}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};

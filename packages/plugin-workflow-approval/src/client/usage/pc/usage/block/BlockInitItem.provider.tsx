import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider, useRecord } from '@tachybase/client';

import { collectionApprovalTodos } from '../../../../common/collections/approvalRecords';
import { CollectionApprovals } from '../../../../common/collections/approvals';
import { CollectionFlowNodes } from '../../../../common/collections/flowNodes';
import { CollectionWorkflows } from '../../../../common/collections/workflows';

export const ProviderBlockInitItem = ({ children, ...props }) => {
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
